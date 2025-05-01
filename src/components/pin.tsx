import { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip";
import { Eye, Newspaper, Sparkles } from "lucide-react";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();

  const isHighlighted = true;

  return (
    <div
      className={cn(
        "rounded-2xl p-[2px] transition-all",
        isHighlighted
          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_30px_rgba(168,85,247,0.6)]"
          : "bg-transparent"
      )}
    >
      <Card className="p-4 rounded-2xl bg-white shadow-md hover:shadow-xl space-y-4 transition-all">
        <CardTitle className="text-lg font-semibold">
          {interview?.position}
        </CardTitle>

        <CardDescription className="text-sm text-gray-500">
          {interview?.description}
        </CardDescription>

        <div className="w-full flex items-center gap-2 flex-wrap">
          {interview?.techStack.split(",").map((word, index) => (
            <Badge
              key={index}
              variant={"outline"}
              className="text-xs text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900 transition"
            >
              {word.trim()}
            </Badge>
          ))}
        </div>

        <CardFooter
          className={cn(
            "w-full flex items-center p-0 text-xs text-muted-foreground",
            onMockPage ? "justify-end" : "justify-between"
          )}
        >
          <p className="truncate whitespace-nowrap">
            {`${new Date(interview?.createdAt.toDate()).toLocaleDateString(
              "en-US",
              { dateStyle: "medium" }
            )} • ${new Date(interview?.createdAt.toDate()).toLocaleTimeString(
              "en-US",
              { timeStyle: "short" }
            )}`}
          </p>

          {!onMockPage && (
            <div className="flex items-center justify-center gap-1">
              <TooltipButton
                content="View"
                buttonVariant={"ghost"}
                onClick={() => navigate(`/generate/${interview?.id}`, { replace: true })}
                disbaled={false}
                buttonClassName="hover:text-sky-500"
                icon={<Eye size={16} />}
                loading={false}
              />

              <TooltipButton
                content="Feedback"
                buttonVariant={"ghost"}
                onClick={() =>
                  navigate(`/generate/feedback/${interview?.id}`, { replace: true })
                }
                disbaled={false}
                buttonClassName="hover:text-yellow-500"
                icon={<Newspaper size={16} />}
                loading={false}
              />

              <TooltipButton
                content="Start"
                buttonVariant={"ghost"}
                onClick={() =>
                  navigate(`/generate/interview/${interview?.id}`, { replace: true })
                }
                disbaled={false}
                buttonClassName="hover:text-violet-500"
                icon={<Sparkles size={16} />}
                loading={false}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

