import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Interview } from "@/types";
import { CustomBreadCrumb } from "./custom-breadcrumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2, Info } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData
    ? initialData.position
    : "Create a New Mock Interview";
  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated!", description: "Changes saved successfully." }
    : { title: "Created!", description: "New Mock Interview created." };

  const cleanAiResponse = (responseText: string) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();
   // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");
    
    // Step 3: Extract a JSON array by capturing text between square brackets
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0];
    } else {
      throw new Error("No JSON array found in response");
    }

    // Step 4: Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `
      As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "id" (a unique string identifier, e.g., "q1", "q2"), "question", and "answer", formatted as follows:

      [
        { "id": "q1", "question": "<Question text>", "answer": "<Answer text>" },
        ...
      ]

      Job Information:
      - Job Position: ${data?.position}
      - Job Description: ${data?.description}
      - Years of Experience Required: ${data?.experience}
      - Tech Stacks: ${data?.techStack}

      The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Ensure each question has a unique "id" field. Return only the JSON array with questions and answers.
    `;

    const aiResult = await chatSession.sendMessage(prompt);
    return cleanAiResponse(aiResult.response.text());
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (initialData) {
        if (isValid) {
          const aiResult = await generateAiResponse(data);
          await updateDoc(doc(db, "interviews", initialData?.id), {
            questions: aiResult,
            ...data,
            updatedAt: serverTimestamp(),
          });
          toast(toastMessage.title, { description: toastMessage.description });
        }
      } else {
        if (isValid) {
          const aiResult = await generateAiResponse(data);
          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
          });
          toast(toastMessage.title, { description: toastMessage.description });
        }
      }
      navigate("/generate", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Error!", {
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false)
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    const confirmDelete = confirm(
      "Are you sure you want to delete this interview?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "interviews", initialData.id));
      toast.success("Deleted interview successfully.");
      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete interview.");
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex flex-col space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <CustomBreadCrumb
          breadCrumbPage={breadCrumpPage}
          breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
        />
        {initialData && (
          <Button
          onClick={handleDelete}
            size="icon"
            variant="ghost"
            className="mt-2 md:mt-0 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        )}
      </div>

      <Headings title={title} isSubHeading />

      <Separator className="my-4 bg-gray-200" />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-6 md:p-8 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Job Role / Position
                    <Info className="w-4 h-4 text-gray-400">
                      <title>Enter the job title, e.g., Full Stack Developer</title>
                    </Info>
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Input
                    className="h-12 mt-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                    disabled={loading}
                    placeholder="e.g., Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Job Description
                    <Info className="w-4 h-4 text-gray-400">
                      <title>Describe the job role in detail</title>
                    </Info>
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-32 mt-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400 resize-none"
                    disabled={loading}
                    placeholder="e.g., Build and maintain web applications using React and Node.js..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Years of Experience
                    <Info className="w-4 h-4 text-gray-400">
                      <title>Enter the required years of experience</title>
                    </Info>
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12 mt-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                    disabled={loading}
                    placeholder="e.g., 5"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Tech Stack
                    <span title="List the technologies, e.g., React, TypeScript">
                      <Info className="w-4 h-4 text-gray-400" />
                    </span>
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-20 mt-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400 resize-none"
                    disabled={loading}
                    placeholder="e.g., React, TypeScript, Firebase..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-4 mt-8">
            <Button
              type="reset"
              size="sm"
              variant="outline"
              disabled={isSubmitting || loading}
              className="h-10 px-6 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-300 transition-all"
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !isValid || loading}
              className="h-10 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-purple-400 text-white hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 text-white animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
