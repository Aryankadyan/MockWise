/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@clerk/clerk-react";
import Webcam from "react-webcam";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
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
import { TooltipButton } from "./tooltip";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { db } from "@/config/firebase.config";
import { collection, addDoc, where, query, serverTimestamp, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { SaveModal } from "./save-modal";

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
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

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
      Please compare the user's answer to the correct answer, and provide a
      rating (from 1 to 10) based on answer quality, and offer feedback for
      improvement.
      Return the result in JSON format with the fields "ratings" (number) 
      and "feedback" (string).
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
    setAiResult(null);
    stopSpeechToText();
    startSpeechToText();
  };


  const saveUserAnswer = async () => {
    setLoading(true);
  
    if (!aiResult) {
      toast.error("Missing AI result.");
      return;
    }
  
    const currentQuestion = question.question;
  
    try {
// query the firbase to check if the user answer already exists for this question
  
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );
      const querySnap = await getDocs(userAnswerQuery);

      // if the user already answerd the question dont save it again
      if (!querySnap.empty) {
        console.log("Query Snap Size", querySnap.size);
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      } else {
        // save the user answer

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

  async function saveResultToFirestore(): Promise<void> {
    if (!aiResult) {
      toast.error("AI feedback is not available. Please record your answer first.");
      return;
    }

    setIsSaving(true);

    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", question.question)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        toast.info("Already Answered", {
          description: "You have already answered this question.",
        });
        return;
      }

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

      toast.success("Your answer has been successfully saved.");

      setUserAnswer("")
      stopSpeechToText()
    } catch (error) {
      console.error("Error saving result to Firestore:", error);
      toast.error("An error occurred while saving your answer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div
      className="w-full flex flex-col items-center gap-8 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      { /* save modal */}
      <SaveModal 
      isOpen={open}
      onClose={()=> setOpen(false)}
      onConfirm={saveUserAnswer}
      loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center p-4 rounded-lg border-4 border-sky-300 shadow-lg transition-all duration-300 bg-gray-800 dark:bg-gray-900">
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
          <WebcamIcon className="w-16 h-16 text-muted-foreground" />
        )}
      </div>

      <div className="flex justify-center gap-4">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="w-6 h-6 text-foreground" />
            ) : (
              <Video className="w-6 h-6 text-foreground" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="w-6 h-6 text-foreground" />
            ) : (
              <Mic className="w-6 h-6 text-foreground" />
            )
          }
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="w-6 h-6 text-foreground" />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Save Result"
          icon={
            isSaving || isAiGenerating ? (
              <Loader className="w-6 h-6 text-foreground animate-spin" />
            ) : (
              <Save className="w-6 h-6 text-foreground" />
            )
          }
          onClick={saveResultToFirestore}
        />
      </div>

      <motion.div
        className="w-full mt-4 p-4 border rounded-md bg-slate-700 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-lg font-semibold">Your Answer:</h2>
        <p className="text-sm mt-2 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>
        {interimResult && (
          <p className="text-sm text-gray-400 mt-2">
            <strong>Current Speech:</strong> {interimResult}
          </p>
        )}
      </motion.div>

      {aiResult && (
      <motion.div
         className="w-full mt-4 p-4 border rounded-md bg-green-900 text-green-200"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
       >
          <h2 className="text-lg font-semibold">AI Feedback:</h2>
          <p className="text-sm mt-2">
           <strong>Rating:</strong> {aiResult.ratings}/10
          </p>
         <p className="text-sm mt-2">
           <strong>Feedback:</strong> {aiResult.feedback}
         </p>
       </motion.div>
    )}
    </motion.div>
  );
}

