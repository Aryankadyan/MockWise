import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => { 
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    ); 

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "Something went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Headings
          title="Dashboard"
          description="Create and start your AI Mock interview"
        />
        <Link to="/generate/create">
          <Button size="sm">
            <Plus /> Add New
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-lg bg-teal-100 text-blue-500 dark:bg-teal-800 dark:text-orange-100 shadow">
          <h4 className="text-sm">Total Interviews</h4>
          <p className="text-xl font-bold">{interviews.length}</p>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="md:grid md:grid-cols-3 gap-4 py-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-24 md:h-32 rounded-md animate-pulse bg-muted-foreground/10"
            />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border p-4 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-muted"
            >
              <InterviewPin interview={interview} />
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col bg-gradient-to-r from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-lg">
            <img
              src="/assets/svg/not-found.svg"
              className="w-44 h-44 object-contain animate-bounce"
              alt="No data"
            />

            <h2 className="text-lg font-semibold text-muted-foreground mt-4">
              No Data Found
            </h2>

            <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-2">
              There is no available data to show. Please add some new mock interviews.
            </p>

            <Link to="/generate/create" className="mt-4">
              <Button size="sm">
                <Plus className="min-w-5 min-h-5 mr-1" />
                Add New
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link to="/generate/create" className="fixed bottom-6 right-6 md:hidden">
        <Button size="icon" className="rounded-full shadow-lg">
          <Plus />
        </Button>
      </Link>
    </>
  );
};
