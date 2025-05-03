/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAuth } from "@clerk/clerk-react";
import Webcam from "react-webcam";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import {
  CircleStop,
  Mic,
  RefreshCw,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { TooltipButton } from "./tooltip";
import { toast } from "sonner";

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
    error,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  useEffect(() => {
    if (error) {
      console.error("Speech-to-text error:", error);
      toast.error("Speech recognition error. Please check your microphone.");
    }
  }, [error]);

  useEffect(() => {
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  const recordUserAnswer = () => {
    if (isRecording) {
      stopSpeechToText();

      // Delay to let final results come in
      setTimeout(() => {
        if (userAnswer?.length < 40) {
          toast.error("Answer too short", {
            description: "Your answer should be more than 30 characters.",
          });
          return;
        }

        console.log("Final Answer:", userAnswer);
        // You can add saving logic here
      }, 500);
    } else {
      startSpeechToText();
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-100 rounded-md">
        {isWebCam ? (
          <Webcam
            videoConstraints={{ facingMode: "user" }}
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={(e) => {
              setIsWebCam(false);
              console.error("Webcam error:", e);
              toast.error("Webcam access failed. Please allow camera access.");
            }}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex justify-center gap-4">
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
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-100">
        <h2 className="text-lg font-semibold">Your Answer:</h2>

        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong> {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};







