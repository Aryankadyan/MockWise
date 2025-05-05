/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Fetch available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);

        // Try to select a non-mobile camera (PC webcam) by default
        if (videoDevices.length > 0) {
          // Simple heuristic: prefer devices that don't have "back" or "front" in their label (common for mobile cameras)
          const pcCamera = videoDevices.find(
            device => !device.label.toLowerCase().includes("back") && !device.label.toLowerCase().includes("front")
          ) || videoDevices[0]; // Fallback to the first camera if no PC camera is identified
          setSelectedDeviceId(pcCamera.deviceId);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast.error("Error", {
          description: "Unable to access cameras. Please check permissions.",
        });
      }
    };

    getCameras();
  }, []);

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Error", {
          description: "Your answer should be more than 30 characters",
        });
        return;
      }

      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );
      setAiResult(aiResult);
    } else {
      startSpeechToText();
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/(json|```|`)/g, "");
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const parsedResult: AIResponse = cleanJsonResponse(
        aiResult.response.text()
      );
      return parsedResult;
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "An error occurred while generating feedback.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) {
      setLoading(false);
      return;
    }

    const currentQuestion = question.question;
    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        console.log("Query Snap Size", querySnap.size);
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      } else {
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        toast("Saved", { description: "Your answer has been saved.." });
      }

      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      toast("Error", {
        description: "An error occurred while generating feedback.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(!open);
    }
  };

  useEffect(() => {
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-8 max-w-3xl mx-auto">
      {/* Save Modal */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

<label htmlFor="camera-select" className="sr-only">Select a camera</label>
<select
  id="camera-select"
  onChange={(e) => setSelectedDeviceId(e.target.value)}
  value={selectedDeviceId || ""}
  className="mb-4 p-2 border rounded-lg"
>
  <option value="" disabled>Select a camera</option>
  {devices.map(device => (
    <option key={device.deviceId} value={device.deviceId}>
      {device.label || `Camera ${device.deviceId}`}
    </option>
  ))}
</select>

      {/* Webcam Section */}
      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border border-gray-200 p-4 bg-black rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        {isWebCam && selectedDeviceId ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-lg"
            videoConstraints={{
              deviceId: selectedDeviceId, // Use the selected device ID
            }}
          />
        ) : (
          <WebcamIcon className="w-24 h-24 text-gray-400 animate-pulse" />
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        <TooltipButton
          content={isWebCam ? "Turn Off Webcam" : "Turn On Webcam"}
          icon={
            isWebCam ? (
              <VideoOff className="w-6 h-6 text-red-500" />
            ) : (
              <Video className="w-6 h-6 text-teal-500" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
          className="p-3 bg-white rounded-full shadow-md hover:bg-teal-50 transition-all duration-200"
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="w-6 h-6 text-red-500 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6 text-indigo-500" />
            )
          }
          onClick={recordUserAnswer}
          className="p-3 bg-white rounded-full shadow-md hover:bg-indigo-50 transition-all duration-200"
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="w-6 h-6 text-gray-500" />}
          onClick={recordNewAnswer}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
            ) : (
              <Save className="w-6 h-6 text-emerald-500" />
            )
          }
          onClick={() => setOpen(!open)}
          disabled={!aiResult}
          className="p-3 bg-white rounded-full shadow-md hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50"
        />
      </div>

      {/* User Answer Display */}
      <div className="w-full mt-6 p-6 border border-gray-200 rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-sky-900">Your Answer:</h2>
        <p className="text-sm mt-3 text-orange-400 whitespace-pre-wrap leading-relaxed">
          {userAnswer || "Start recording to see your answer here..."}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-3">
            <strong className="text-indigo-700">Current Speech:</strong>{" "}
            <span className="italic">{interimResult}</span>
          </p>
        )}
      </div>

      {/* AI Feedback Section */}
      {aiResult && ( 
        <div className="w-full mt-6 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-indigo-900">AI Feedback:</h2>
          <div className="mt-3">
            <p className="text-sm text-gray-700">
              <strong className="text-indigo-700">Rating:</strong>{" "}
              <span className="text-lg font-semibold text-emerald-600">
                {aiResult.ratings}/10
              </span>
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong className="text-indigo-700">Feedback:</strong>{" "}
              <span className="leading-relaxed">{aiResult.feedback}</span>
            </p>
          </div> 
        </div>
      )}
    </div>
  );
};
