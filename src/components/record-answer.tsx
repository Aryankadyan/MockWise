import React from "react";

interface RecordAnswerProps {
  question: {question: string; answer: string};
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void
}

export const RecordAnswer = ({ question, isWebCam, setIsWebCam }: RecordAnswerProps) => {
  return (
    <div>
    
    </div>
  );
};
