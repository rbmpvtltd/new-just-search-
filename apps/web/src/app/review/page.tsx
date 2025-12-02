"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"

const reviewSchema = z.object({
  businessId: z.number().positive("Business ID is required"),
  message: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must not exceed 500 characters"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

function ReviewForm() {
  const trpc = useTRPC()
  const [submittedData, setSubmittedData] = useState<any>(null)
  
  const { mutate, isPending } = useMutation(
    trpc.businessrouter.businessReview.mutationOptions()
  )

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      businessId: 36,
      message: "",
      rating: 5,
    },
  })

  function onSubmit(data: ReviewFormValues) {
    mutate(data, {
      onSuccess: (responseData) => {
        console.log("Review submitted successfully:", responseData)
        setSubmittedData(responseData)
        form.reset()
      },
      onError: (err) => {
        console.error("Error submitting review:", err)
      },
    })
  }

  const watchRating = form.watch("rating")

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-muted-foreground">Share your experience with this business</p>
      </div>

      {submittedData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">✓ Review submitted successfully!</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field?.value?.toString()}
                    className="flex gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} className="sr-only" />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              rating <= watchRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Click on the stars to rate (1-5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write at least 10 characters (max 500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending || submittedData} className="w-full">
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ReviewForm