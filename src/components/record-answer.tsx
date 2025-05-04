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
import { toast } from "sonner";
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
import { chatSession } from "@/scripts";
import { motion, AnimatePresence } from "framer-motion";

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
  } = useSpeechToText({ continuous: true, useLegacyResults: false });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Fetch available cameras
  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        setVideoDevices(cameras);
        if (cameras.length > 0) {
          setSelectedDeviceId(cameras[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching video devices:", error);
        toast.error("Unable to fetch camera devices.");
      }
    };
    if (isWebCam) {
      getVideoDevices();
    }
  }, [isWebCam]);

  const cleanJsonResponse = (responseText: string) => {
    const cleanText = responseText.trim().replace(/(json|```|`)/g, "");
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON: " + (error as Error).message);
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
      Please rate the user's answer (1-10) and provide constructive feedback. 
      Return JSON with { ratings: number, feedback: string }
    `;
    try {
      const aiResult = await chatSession.sendMessage(prompt);
      return cleanJsonResponse(aiResult.response.text());
    } catch (error) {
      toast("Error", { description: "Failed to generate feedback." });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer.length < 30) {
        toast.error("Answer too short (min. 30 chars)");
        return;
      }
      const aiRes = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );
      setAiResult(aiRes);
    } else {
      startSpeechToText();
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    setAiResult(null);
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    setLoading(true);
    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", question.question)
      );
      const querySnap = await getDocs(userAnswerQuery);
      if (!querySnap.empty) {
        toast.info("Already answered this question.");
        return;
      }
      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: question.question,
        correct_ans: question.answer,
        user_ans: userAnswer,
        feedback: aiResult?.feedback,
        rating: aiResult?.ratings,
        userId,
        createdAt: serverTimestamp(),
      });
      toast.success("Answer saved!");
      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      toast.error("Error saving answer.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const transcript = results
      .filter((r): r is ResultType => typeof r !== "string")
      .map((r) => r.transcript)
      .join(" ");
    setUserAnswer(transcript);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-6">
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      {/* Animated Webcam */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-[400px] md:w-96 rounded-xl p-1 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 shadow-lg"
      >
        <div className="w-full h-full rounded-lg bg-gray-900 overflow-hidden">
          {isWebCam ? (
            <WebCam
              onUserMedia={() => setIsWebCam(true)}
              onUserMediaError={() => setIsWebCam(false)}
              className="w-full h-full object-cover rounded-lg"
              videoConstraints={{
                deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <WebcamIcon className="w-24 h-24 text-gray-500" />
            </div>
          )}
        </div>
      </motion.div>

      {isWebCam && videoDevices.length > 1 && (
        <div className="flex items-center gap-2 text-white">
          <label>Select Camera:</label>
          <select
            value={selectedDeviceId ?? ""}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="px-2 py-1 rounded-md bg-gray-800 text-white"
          >
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stylish Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setIsWebCam(!isWebCam)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition duration-300 shadow-md hover:scale-105 ${
            isWebCam ? "bg-pink-600 hover:bg-pink-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isWebCam ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          {isWebCam ? "Turn Off Cam" : "Turn On Cam"}
        </button>

        <button
          onClick={recordUserAnswer}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition duration-300 shadow-md hover:scale-105 ${
            isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isRecording ? <CircleStop className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <button
          onClick={recordNewAnswer}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600 transition duration-300 shadow-md hover:scale-105"
        >
          <RefreshCw className="w-5 h-5" />
          Re-record
        </button>

        <button
          onClick={() => setOpen(true)}
          disabled={!aiResult}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition duration-300 shadow-md hover:scale-105 ${
            !aiResult ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isAiGenerating ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Result
        </button>
      </div>

      {/* Answer Section */}
      <div className="w-full mt-4 p-4 border rounded-xl bg-gray-900 text-white shadow-sm">
        <h2 className="text-lg font-bold mb-2 text-purple-300">Your Answer:</h2>
        <p className="text-sm text-gray-200 whitespace-pre-wrap">
          {userAnswer || "Start recording to see your answer here."}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-400 mt-2">
            <strong>Live Transcript:</strong> {interimResult}
          </p>
        )}

        {/* Feedback + Rating */}
        <AnimatePresence>
          {aiResult && (
            <motion.div
              className="mt-4 p-4 rounded-md border border-purple-500 bg-purple-950/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="font-semibold text-purple-300 text-md">AI Feedback</h3>
              <p className="text-sm text-emerald-200 mt-1">{aiResult.feedback}</p>
              <p className="text-sm text-orange-400 mt-1">
              🌟 Rating: <strong>{aiResult.ratings}/10</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


