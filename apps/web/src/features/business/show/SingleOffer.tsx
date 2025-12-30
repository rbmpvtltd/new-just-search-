"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOfferReviewSchema } from "@repo/db/dist/schema/offer.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import parse from "html-react-parser";
import { CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import type z from "zod";
import LoginRedirect from "@/components/LoginRedirect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Rating from "@/components/ui/Rating";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

type SingleOfferType = OutputTrpcType["businessrouter"]["singleOffer"] | null;
type ReviewFormValues = z.infer<typeof insertOfferReviewSchema>;

function SingleOfferComp({
  offerPhotos,
  offer,
}: {
  offerPhotos: string[];
  offer: SingleOfferType;
}) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);

  const content = parse(offer?.description ?? "");
  const trpc = useTRPC();

  const { mutateAsync: createConversation } = useMutation(
    trpc.chat.createConversation.mutationOptions(),
  );
  const { data: authenticated } = useQuery(trpc.auth.verifyauth.queryOptions());
  const { data: submitted } = useQuery(
    trpc.offerrouter.offerReviewSubmitted.queryOptions({
      offerId: offer?.id ?? 0,
    }),
  );

  async function handleChat() {
    const conv = await createConversation({
      receiverId: Number(offer?.userId),
    });
    setConversation(conv);
  }
  const { data, error } = useSubscription(
    trpc.chat.onMessage.subscriptionOptions({
      conversationId: conversation?.id,
      // messageId: String(allMessages[allMessages.length -1]?.id),
    }),
  );

  const { mutate, isPending } = useMutation(
    trpc.chat.sendMessage.mutationOptions(),
  );
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <Carousel opts={{ loop: true }} className="w-[90%] sm:w-[40%]">
          <CarouselContent className="ml-5">
            {offerPhotos?.map((item, index: number) => (
              <CarouselItem key={index.toString()} className="pl-1 basis-1/1">
                <div className="py-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <div className="relative">
                        {/* <Image
                          width={500}
                          height={400}
                          alt="offer image"
                          src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg" 
                        /> */}
                        <CldImage
                          width="500"
                          height="400"
                          className="border rounded"
                          src={item}
                          alt={item}
                        />
                        <span className="absolute z-1 top-5 w-[90px] bg-error text-end px-4 text-white rounded-r-md">
                          -{offer?.discountPercent}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="w-[90%] sm:w-[50%] flex flex-col gap-2">
          <h2 className="font-medium">{offer?.shopName}</h2>
          <h1 className="text-2xl line-clamp-1 text-secondary font-semibold">
            {offer?.name}
          </h1>
          <div>{content}</div>

          <h1 className="text-xl text-primary">
            <span className="text-secondary">
              <span className="line-through">₹ {offer?.rate}</span>
            </span>{" "}
            ₹ {offer?.finalPrice}
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() =>
                console.log(
                  `clicked on view Shop Button Shop will be open with id no ${offer?.businessId}`,
                )
              }
            >
              View Shop Detail
            </Button>
            <Dialog>
              {/* <form> */}
              <DialogTrigger asChild>
                <Button onClick={handleChat}>Chat Now</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Write your message below and click Send. The shop owner will
                    receive it instantly.
                  </DialogTitle>
                  {/* <DialogDescription>
                      Write your message and send it to the shop.
                    </DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Your Message</Label>
                    <Textarea
                      name="name"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      mutate({
                        message: message,
                        conversationId: conversation?.id,
                        image: offer?.photos[0],
                        route: `http://localhost:9000/business/singleProduct/${offer?.id}`,
                      });
                      setMessage("");
                    }}
                  >
                    {isPending ? "Sending..." : "Send"}
                  </Button>
                </DialogFooter>
              </DialogContent>
              {/* </form> */}
            </Dialog>
          </div>
        </div>
      </div>
      <div className="w-[80%] mx-auto mt-10">
        {authenticated?.success && (
          <div>
            {submitted?.submitted && (
              <Card className="border-green-200 py-4 bg-green-50/50">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-green-900">
                        Review Already Submitted
                      </CardTitle>
                      <CardDescription className="text-green-700 mt-1">
                        Thank you for sharing your feedback! You've already
                        submitted a review for this offer.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
            {!submitted?.submitted && <ReviewForm offerId={offer?.id ?? 0} />}
          </div>
        )}
        {!authenticated?.success && <LoginRedirect />}
        <h1 className="text-2xl font-semibold text-secondary mb-4">
          Recommended Reviews
        </h1>
      </div>
      {/* TODO : uncommen when offer review seeding complete correctly */}
      <div className="w-[80%] mx-auto mt-5">
        {offer?.rating?.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className=" p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center w-full ">
                <h1 className="text-xl font-medium text-secondary">
                  {item.user}
                </h1>
                <p className="flex items-center gap-2 text-sm">
                  <FaRegCalendarAlt className="text-primary" />{" "}
                  {new Date(item.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Rating rating={item.rating} />
              <p>{item.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewForm({ offerId }: { offerId: number }) {
  const trpc = useTRPC();
  const [submittedData, setSubmittedData] = useState<any>(null);
  const { mutate, isPending } = useMutation(
    trpc.offerrouter.createOfferReview.mutationOptions(),
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(insertOfferReviewSchema),
    defaultValues: {
      offerId: offerId,
      message: "",
      rate: 5,
      email: "",
      name: "Guest",
      view: false,
      status: true,
    },
  });

  function onSubmit(data: ReviewFormValues) {
    mutate(data, {
      onSuccess: (responseData) => {
        console.log("Review submitted successfully:", responseData);
        setSubmittedData(responseData);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Review Submitted Successfully`,
        });
        form.reset();
      },
      onError: (err) => {
        console.error("Error submitting review:", err);
      },
    });
  }

  const watchRating = form.watch("rate");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-muted-foreground">
          Share your experience with this offer
        </p>
      </div>

      {submittedData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">
            ✓ Review submitted successfully!
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rate"
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
                      <FormItem
                        key={rating}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={rating.toString()}
                            className="sr-only"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              rating <= (watchRating ?? 0)
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
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tell us about your experience..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Write at least 10 characters (max 500)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tell us about your experience..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Write at least 10 characters (max 500)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Write at least 10 characters (max 500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || submittedData}
            className="w-full"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SingleOfferComp;
