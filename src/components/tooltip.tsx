import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Button } from "@/components/ui/button";
  import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
  
  // assuming the button variants types are something like following
  type ButtonVariant =
    | "ghost"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | null
    | undefined;
  
  interface TooltipButtonProps {
    content: string;
    icon: React.ReactNode;
    onClick: () => void;
    buttonVariant?: ButtonVariant;
    buttonClassName?: string;
    delay?: number;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  }
  
  export const TooltipButton = ({ 
    content,
    icon,
    onClick,
    buttonVariant = "ghost",
    buttonClassName = "",
    delay = 0, 
    disabled = false,
    loading = false,
  }: TooltipButtonProps) => {
    return (
      <TooltipProvider delayDuration={delay}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              disabled={disabled}
              variant={buttonVariant}
              className={cn(buttonClassName, disabled && "cursor-not-allowed")}
              onClick={onClick}
            >
              {loading ? (
                <Loader className="min-w-4 min-h-4 animate-spin text-emerald-400" />
              ) : (
                icon
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{loading ? "Loading..." : content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  