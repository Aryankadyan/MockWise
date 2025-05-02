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
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

interface RecordAnswerProps {
  question: { id: string; question: string; answer: string };
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
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      interimResults: true,
      lang: "en-US",
    },
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Video constraints for PC camera
  const videoConstraints = {
    facingMode: "user", // Prefer front-facing camera (PC webcam)
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  // Detect if the device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Check if browser supports Web Speech API (Chrome/Edge)
  const isEdge = () => {
    return (
      typeof window.SpeechRecognition !== "undefined" ||
      typeof window.webkitSpeechRecognition !== "undefined"
    );
  };

  // Check microphone permission
  const checkMicPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      if (permissionStatus.state === "denied") {
        toast.error("Microphone Permission Denied", {
          description:
            "Please allow microphone access in your browser settings and reload the page.",
        });
        return false;
      } else if (permissionStatus.state === "prompt") {
        // Request permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
      }
      return true;
    } catch (err) {
      console.error("Error checking microphone permission:", err);
      toast.error("Microphone Access Error", {
        description:
          "Unable to access microphone. Please check your browser settings or microphone hardware.",
      });
      return false;
    }
  };

  const recordUserAnswer = async () => {
    if (!isEdge()) {
      toast.error("Browser Not Supported", {
        description:
          "Speech recognition is only supported in Google Chrome or Microsoft Edge. Please use one of these browsers or type your answer below.",
      });
      return;
    }

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
      // Check permission before starting
      const hasPermission = await checkMicPermission();
      if (!hasPermission) return;

      try {
        await startSpeechToText();
        console.log("Recording started");
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        toast.error("Recording Error", {
          description:
            "Failed to start microphone. Ensure your microphone is connected and try again.",
        });
      }
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
      toast("Error", {
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
    if (isEdge()) {
      recordUserAnswer(); // Start recording only in Edge/Chrome
    }
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

        toast("Saved", { description: "Your answer has been saved." });
      }

      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      toast("Error", {
        description: "An error occurred while saving the answer.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(!open);
    }
  };

  // Monitor speech-to-text errors
  useEffect(() => {
    if (error) {
      console.error("Speech-to-text error:", error);
      if (error.includes("Speech Recognition API is only available on Chrome")) {
        toast.error("Browser Not Supported", {
          description:
            "Speech recognition is only supported in Google Chrome or Microsoft Edge. Please use one of these browsers or type your answer below.",
        });
      } else {
        toast.error("Speech Recognition Error", {
          description: error || "Failed to process speech input. Please try again.",
        });
      }
    }
  }, [error]);

  // Update user answer from speech results
  useEffect(() => {
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    if (isEdge()) {
      setUserAnswer(combineTranscripts);
    }
  }, [results]);

  // Warn if accessed from a mobile device or non-Chrome/Edge browser
  useEffect(() => {
    if (isMobileDevice()) {
      console.warn(
        "Mobile device detected. Forcing PC webcam may not work as expected."
      );
    }
    if (!isEdge()) {
      console.warn(
        "Non-Chrome/Edge browser detected. Speech recognition requires Google Chrome or Microsoft Edge."
      );
      toast.info("Browser Not Supported", {
        description:
          "Speech recognition is only supported in Google Chrome or Microsoft Edge. Please use one of these browsers or type your answer below.",
      });
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={(stream) => {
              setIsWebCam(true);
              const videoTrack = stream.getVideoTracks()[0];
              console.log("Selected camera:", videoTrack.label);
            }}
            onUserMediaError={() => {
              setIsWebCam(false);
              toast.error("Webcam Error", {
                description:
                  "Unable to access webcam. Please ensure your PC webcam is enabled and permissions are granted.",
              });
            }}
            className="w-full h-full object-cover rounded-md"
            videoConstraints={videoConstraints}
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex items justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
          disabled={!isEdge()} // Disable in non-Chrome/Edge browsers
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
          disabled={!isEdge()} // Disable in non-Chrome/Edge browsers
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disabled={!aiResult}
        />
      </div>

      {!isEdge() && (
        <div className="w-full mt-4 p-4 border rounded-md bg-yellow-50">
          <p className="text-sm text-yellow-700">
            Speech recognition is not supported in your browser. Please use Google Chrome or Microsoft Edge for microphone recording.
          </p>
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="mt-2 h-32 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      )}

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <p className="font-semibold">Your Answer..</p>
        <div className="mt-2 space-y-2">
          {aiResult ? (
            <div>
              <p>Rating: {aiResult.ratings}</p>
              <p>Feedback: {aiResult.feedback}</p>
            </div>
          ) : (
            <p>Start Speaking...</p>
          )}
        </div>
      </div>
    </div>
  );
};

