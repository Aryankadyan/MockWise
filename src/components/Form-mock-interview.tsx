import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { Interview } from "@/types"

import { CustomBreadCrumb } from "./custom-breadcrumb"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { toast } from "sonner"
import { Headings } from "./headings"
import { Button } from "./ui/button"
import { Loader, Trash2 } from "lucide-react"
import { Separator } from "./ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { chatSession } from "@/scripts"

interface FormMockInterviewProps {
  initialData: Interview | null
}

const formSchema = z.object({
  position: z.string().min(1, "Position is required").max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce.number().min(0, "Experience is required"),
  techStack: z.string().min(1, "Tech stack is required"),
})

type FormData = z.infer<typeof formSchema>

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  })

  const { isValid, isSubmitting } = form.formState
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { userId } = useAuth()

  const title = initialData
    ? initialData.position
    : "Create a new Mock interview"

  const breadCrumbPage = initialData?.position || "Create"
  const actions = initialData ? "Save Changes" : "Create"
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created.." }


  const cleanAiResponse = (responseText: string) => {
    // 1. Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // 2. Remove any occurances of "json" or code block symbols(``` or`)
    cleanText = cleanText.replace(/(json|```|`)/g, "")

    // 3. Extract a JSON array by capturing text between square brackets
    const jsonArrayMatch = cleanText.match(/\[.*\]/s)
    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0]
    } else {
      throw new Error("No JSON array found in response")
    }

    // 4. Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText)
    } catch (error) {
      throw new Error("Invalid JSON format:" + (error as Error)?.message)
    }
  }

  const generateAiResponse = async (data: FormData) => {
    const prompt =
      `As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
       `

    const aiResult = await chatSession.sendMessage(prompt)
    console.log(aiResult.response.text().trim())
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (initialData) {
        // update existing interview
      }
      else {

        // create a new mock interview
        if (isValid) {
          const aiResult = await generateAiResponse(data)
        }
      }

    } catch (error) {
      console.error(error)
      toast.error("Error..", {
        description: `Something went wrong. Please try again later`,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData?.position || "",
        description: initialData?.description || "",
        experience: initialData?.experience ?? 0,
        techStack: initialData?.techStack || "",
      })
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{ label: "Mock Interview", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-400" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex flex-col items-start justify-start gap-6 shadow-md"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    disabled={loading}
                    className="h-11"
                    placeholder="eg:- Full stack developer"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loading}
                    className="h-24"
                    placeholder="eg:- describe your job role or position..."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={loading}
                    className="h-11"
                    placeholder="eg:- 4 years"
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
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loading}
                    className="h-24"
                    placeholder="eg:- React, TypeScript, Node, Express, MongoDB... (Separated by comma)"
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-5">
            <Button type="reset" size="sm" variant="outline" disabled={isSubmitting || loading}>
              Reset
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting || loading || !isValid}>
              {loading ? <Loader className="text-gray-100 animate-spin" /> : actions}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}


