import { db } from "@/config/firebase.config";
import { Interview, UserAnswer } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./Loader";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  CircleCheck,
  Star,
  Share2,
  Download,
  Trophy,
} from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { usePDF } from "react-to-pdf";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { toPDF, targetRef } = usePDF({ filename: "interview-feedback.pdf" });

  useEffect(() => {
    if (!interviewId) {
      navigate("/generate", { replace: true });
    }

    const fetchInterview = async () => {
      try {
        const docSnap = await getDoc(doc(db, "interviews", interviewId!));
        if (docSnap.exists()) {
          setInterview({ id: docSnap.id, ...docSnap.data() } as Interview);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId),
          where("mockIdRef", "==", interviewId)
        );
        const querySnap = await getDocs(q);
        const userAnswers = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as UserAnswer));
        setFeedbacks(userAnswers);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load feedbacks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
    fetchFeedbacks();
  }, [interviewId, navigate, userId]);

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";
    const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Feedback link copied to clipboard!");
  };

  if (isLoading) return <LoaderPage className="w-full h-[70vh]" />;

  return (
    <div className="flex flex-col gap-8 py-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <CustomBreadCrumb
          breadCrumbPage="Feedback"
          breadCrumbItems={[
            { label: "Mock Interviews", link: "/generate" },
            { label: interview?.position || "", link: `/generate/interview/${interview?.id}` },
          ]}
        />

        <div className="flex gap-3">
          <button
            onClick={() => toPDF()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-700 text-white text-sm font-medium rounded-md"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-orange-200 dark:bg-orange-800 hover:bg-orange-400 dark:hover:bg-gray-700 text-sm font-medium rounded-md"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </div>

      <div className="rounded-xl p-6 bg-gradient-to-tr from-emerald-400 via-purple-400 to-emerald-400 text-white shadow-xl">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8" />
          Congratulations!
        </h1>
        <p className="mt-4">
          Your personalized interview feedback is ready. Get insights to improve and grow.
        </p>
        <p className="text-lg mt-4">
          Overall Rating: <span className="font-bold text-yellow-300">{overAllRating} / 10</span>
        </p>
      </div>

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Headings title="Interview Feedback" isSubHeading />

      <div ref={targetRef}>
        <Accordion type="single" collapsible className="space-y-5">
          {feedbacks.map((feed) => (
            <AccordionItem
              key={feed.id}
              value={feed.id}
              className="border rounded-lg shadow dark:border-gray-700"
            >
              <AccordionTrigger
                onClick={() => setActiveFeed(feed.id)}
                className={cn(
                  "px-5 py-3 text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feed.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <span>{feed.question}</span>
              </AccordionTrigger>

              <AccordionContent asChild>
                <AnimatePresence>
                  {activeFeed === feed.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 py-6 bg-white dark:bg-gray-900 rounded-b-lg space-y-5 shadow-inner"
                    >
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                        <Star className="inline mr-2 text-yellow-400" />
                        Rating: {feed.rating}/10
                      </div>

                      <Card className="border-none p-4 bg-green-50 dark:bg-green-900/30 rounded-lg shadow-md">
                        <CardTitle className="flex items-center text-lg text-green-600 dark:text-green-400">
                          <CircleCheck className="mr-2" />
                          Expected Answer
                        </CardTitle>
                        <CardDescription className="text-gray-700 dark:text-gray-200 mt-1">
                          {feed.correct_ans}
                        </CardDescription>
                      </Card>

                      <Card className="border-none p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg shadow-md">
                        <CardTitle className="flex items-center text-lg text-yellow-700 dark:text-yellow-400">
                          <CircleCheck className="mr-2" />
                          Your Answer
                        </CardTitle>
                        <CardDescription className="text-gray-700 dark:text-gray-200 mt-1">
                          {feed.user_ans}
                        </CardDescription>
                      </Card>

                      <Card className="border-none p-4 bg-red-50 dark:bg-red-900/30 rounded-lg shadow-md">
                        <CardTitle className="flex items-center text-lg text-red-600 dark:text-red-400">
                          <CircleCheck className="mr-2" />
                          AI Feedback
                        </CardTitle>
                        <CardDescription className="text-gray-700 dark:text-gray-200 mt-1">
                          {feed.feedback}
                        </CardDescription>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};




