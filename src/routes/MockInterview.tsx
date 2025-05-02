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
import { QuestionForm } from "@/components/question-form";

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
  
    if(isLoading){
        return <LoaderPage className="w-full h-[70vh]"/>
    }

    if(!interviewId){
        navigate("/generate", {replace: true})
    }

    if(!interview){
        navigate("/generate", {replace: true})
    }


  return (
    <div className="flex flex-col w-full gap-8 py-5">
        <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumbItems={[
            {label: "Mock Interviews", link: "/generate"},
            {
                label: interview?.position || "",
                link: `/generate/interview/${interview?.id}`,
            },
        ]}
      />
      
      <div className="w-full">
      <Alert className="bg-sky-100 border border-emerald-300 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-violet-900 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-blue-800 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview?.questions && interview?.questions.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
            <QuestionForm questions={interview?.questions.map(q => ({ question: q.questions, answer: q.answer }))} />
            </div>
      )}
    </div>
  )
}
