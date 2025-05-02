/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./Loader";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import {
  Lightbulb,
  Sparkles,
  WebcamIcon,
  MicOff,
  Maximize,
  Minimize,
} from "lucide-react";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Webcam from "react-webcam";

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
  const [isMicAccessible, setIsMicAccessible] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [webcamBlocked, setWebcamBlocked] = useState(false);

  const navigate = useNavigate();
  const webcamRef = useRef<HTMLDivElement>(null);

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchInterview();
  }, [interviewId]);

  useEffect(() => {
    // Detect mic access
    navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
      setIsMicAccessible(false);
    });
  }, []);

  const toggleFullScreen = () => {
    if (!webcamRef.current) return;

    if (!document.fullscreenElement) {
      webcamRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen((prev) => !prev);
  };

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="flex flex-col w-full max-w-5xl mx-auto gap-8">
        {/* Header */}
        <div className="flex items-center justify-between w-full gap-2">
          <CustomBreadCrumb
            breadCrumbPage={interview?.position || ""}
            breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
          />
          <Link to={`/generate/interview/${interviewId}/start`}>
            <Button
              size="sm"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-600 rounded-md shadow-md hover:from-blue-500 hover:to-emerald-600 transition-all"
            >
              Start <Sparkles className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Interview Info */}
        {interview && <InterviewPin interview={interview} onMockPage />}

        {/* Alert */}
        <Alert className="bg-yellow-100/60 border-yellow-300 rounded-lg p-5 flex items-start gap-3 shadow-md">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <div>
            <AlertTitle className="text-yellow-800 font-semibold">
              Important Information
            </AlertTitle>
            <AlertDescription className="text-sm text-yellow-700 mt-1">
              Please enable your webcam and microphone to start the AI-generated mock interview.
              <br />
              You’ll receive a personalized report based on your responses.
              <br />
              <br />
              <span className="font-medium">Note:</span> Your video is{" "}
              <strong>never recorded</strong>. You can disable your webcam anytime.
            </AlertDescription>
          </div>
        </Alert>

        {/* Webcam Area */}
        <div className="flex justify-center w-full px-4">
          <div
            ref={webcamRef}
            className={`relative flex flex-col items-center justify-center 
              bg-white/10 backdrop-blur-md border border-white/20 
              shadow-xl rounded-xl transition-all overflow-hidden
              ${isFullScreen ? "w-full h-[70vh]" : "w-full max-w-lg h-[400px]"}`}
          >
            {isWebCamEnabled && !webcamBlocked ? (
              <Webcam
                onUserMedia={() => {
                  setIsWebCamEnabled(true);
                  setWebcamBlocked(false);
                }}
                onUserMediaError={() => {
                  setIsWebCamEnabled(false);
                  setWebcamBlocked(true);
                }}
                className="w-full h-full object-cover rounded-xl"
                audio={true}
                videoConstraints={{
                  facingMode: "user", // ensures front camera (PC/webcam)
                  width: 1280,
                  height: 720,
                }}
              />
            ) : (
              <WebcamIcon className="min-w-24 min-h-24 text-gray-400 animate-pulse" />
            )}

            {/* Fullscreen Button */}
            <Button
              onClick={toggleFullScreen}
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-all hover:scale-110"
            >
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </div>
        </div>

        {/* Webcam Toggle Button */}
        <div className="flex items-center justify-center">
          <Button
            onClick={() => setIsWebCamEnabled((prev) => !prev)}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white font-medium rounded-full shadow-md 
              hover:from-purple-600 hover:to-indigo-500 transition-all"
          >
            {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
          </Button>
        </div>

        {/* Warnings */}
        {webcamBlocked && (
          <p className="text-center text-sm mt-3 text-red-500 font-medium">
            🚫 Webcam access is blocked. Please enable it in browser settings.
          </p>
        )}

        {!isMicAccessible && (
          <div className="mt-3 flex items-center justify-center text-yellow-600 text-sm gap-2 font-medium">
            <MicOff size={18} /> Microphone access is blocked. Please allow it.
          </div>
        )}
      </div>
    </div>
  );
};
