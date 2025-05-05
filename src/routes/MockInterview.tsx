/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./Loader";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { QuestionSection } from "@/components/question-section";

export const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interviewId || !interview) {
    navigate("/generate", { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-10 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50">
      {/* Breadcrumb with Enhanced Styling */}
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumbItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
        className="px-6 text-gray-700 font-medium text-lg tracking-wide transition-all duration-300 hover:text-indigo-600"
      />

      {/* Alert Section with Modern Styling and Animation */}
      <div className="w-full px-6">
        <Alert className="bg-gradient-to-r from-teal-100 to-blue-100 border border-teal-300 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
          <Lightbulb className="h-6 w-6 text-teal-600 animate-pulse" />
          <div>
            <AlertTitle className="text-indigo-900 font-bold text-xl tracking-tight">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-gray-700 mt-2 leading-relaxed font-medium">
              Press <span className="text-teal-600 font-semibold">"Record Answer"</span> to begin answering the question. Once you
              finish the interview, you'll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong className="text-indigo-800">Note:</strong>{" "}
              <span className="font-medium text-gray-600">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {/* Question Section with Enhanced Layout */}
      {interview?.questions && interview?.questions.length > 0 && (
        <div className="w-full px-6 mt-8 flex flex-col items-start gap-6 bg-white py-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
          {(() => {
            console.log("Questions:", interview.questions);
            const questionSet = new Set(interview.questions.map(q => q.question));
            if (questionSet.size !== interview.questions.length) {
              console.warn("Duplicate questions detected:", interview.questions);
            }
            return (
              <QuestionSection
                questions={interview?.questions.map(q => ({
                  id: q.id, 
                  question: q.question,
                  answer: q.answer,
                }))}
              />
            );
          })()}
        </div> 
      )}
    </div>
  );
};



