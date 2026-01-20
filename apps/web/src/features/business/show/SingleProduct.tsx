"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBusinessReviewSchema } from "@repo/db/dist/schema/business.schema";
import { insertProductReviewSchema } from "@repo/db/dist/schema/product.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import Autoplay from "embla-carousel-autoplay";
import parse from "html-react-parser";
import { CheckCircle2, MessageCircleIcon, Star } from "lucide-react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
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
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

type SingleProductType =
  | OutputTrpcType["businessrouter"]["singleProduct"]
  | null;
type ReviewFormValues = z.infer<typeof insertProductReviewSchema>;

function SingleProductComp({
  productPhotos,
  product,
}: {
  productPhotos: string[];
  product: SingleProductType;
}) {
  const [expanded, setExpanded] = useState(false);

  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const content = parse(product?.description ?? "");
  const trpc = useTRPC();
  const { mutateAsync: createConversation } = useMutation(
    trpc.chat.createConversation.mutationOptions(),
  );
  const { data: authenticated } = useQuery(trpc.auth.verifyauth.queryOptions());
  const { data: submitted } = useQuery(
    trpc.productrouter.productReviewSubmitted.queryOptions({
      productId: product?.id ?? 0,
    }),
  );

  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    }),
  );

  async function handleChat() {
    const conv = await createConversation({
      receiverId: Number(product?.userId),
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
    <div className="w-[95%] mx-auto mt-6 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row lg:flex-row gap-6 items-stretch border rounded-2xl shadow-lg p-6 bg-white">
        <Carousel
          plugins={[autoplay.current]}
          opts={{ loop: true }}
          className="w-full lg:w-1/2 h-full rounded-xl overflow-hidden shadow-md"
        >
          <CarouselContent className="ml-0">
            {productPhotos?.map((item, index) => (
              <CarouselItem key={index.toString()} className="pl-1">
                <Card className="shadow-sm border rounded-xl overflow-hidden">
                  <CardContent className="p-0 flex items-center justify-center bg-gray-50 h-full">
                    <CldImage
                      width="500"
                      height="400"
                      className="object-cover w-full h-[280px] sm:h-[320px] lg:h-full"
                      src={item ?? ""}
                      alt="Product Image"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="w-full lg:w-1/2 h-full flex flex-col gap-3 p-4 sm:p-6 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
          <h2 className="font-semibold text-lg text-gray-700">
            {product?.shopName}
          </h2>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary ">
            {product?.name}
          </h1>
          <p
            className={`text-gray-600 transition-all duration-300 ${
              expanded ? "line-clamp-none" : "line-clamp-3"
            }`}
          >
            {content ? content : "No description provided for this product."}
          </p>

          {content && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-primary text-sm mt-1 hover:underline self-start"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
          <div className="mt-auto">
            <h1 className="text-2xl font-semibold text-secondary mt-4">
              ₹ <span className="text-primary">{product?.rate}</span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                className="bg-primary text-white hover:bg-primary-dark transition-all"
                onClick={() =>
                  console.log(
                    `clicked on view Shop Button Shop will be open with id no ${product?.businessId}`,
                  )
                }
              >
                View Shop Detail
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-white hover:bg-secondary-dark transition-all"
                    onClick={handleChat}
                  >
                    <IoChatbubbleEllipses />
                    Chat Now
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Send a message to the shop owner
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-3 grid gap-4">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      name="message"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none border rounded-md p-2"
                    />
                  </div>
                  <DialogFooter className="mt-4 flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={() => {
                        mutate({
                          message: message,
                          conversationId: conversation?.id,
                          image: product?.photos[0],
                          route: `http://localhost:9000/business/singleproduct/${product?.id}`,
                        });
                        setMessage("");
                      }}
                    >
                      {isPending ? "Sending..." : "Send"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto flex flex-col gap-6">
        {authenticated?.success ? (
          submitted?.submitted ? (
            <Card className="border-green-200 bg-green-50/50 shadow-sm p-4 rounded-xl">
              <CardHeader className="flex gap-4 items-center">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-900 font-semibold">
                    Review Already Submitted
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Thank you for sharing your feedback! You've already
                    submitted a review for this product.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <ReviewForm
              productId={product?.id ?? 0}
              businessId={product?.businessId ?? 0}
            />
          )
        ) : (
          <LoginRedirect />
        )}

        {product?.rating.length === 0 && (
          <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg text-center text-secondary font-medium">
            No Reviews Found On This Product
          </div>
        )}

        {product?.rating?.map((item, index) => (
          <div
            key={index.toString()}
            className="p-4 m-2 shadow-md w-full rounded-xl flex flex-col gap-2 bg-white"
          >
            <div className="flex justify-between items-center w-full">
              <h1 className="text-lg font-semibold text-secondary">
                {item?.user}
              </h1>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <FaRegCalendarAlt />{" "}
                {new Date(item?.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Rating rating={item?.rating} />
            <p className="text-gray-700">{item?.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({
  productId,
  businessId,
}: {
  productId: number;
  businessId: number;
}) {
  const trpc = useTRPC();
  const [submittedData, setSubmittedData] = useState<any>(null);
  const { mutate, isPending } = useMutation(
    trpc.productrouter.createProductReview.mutationOptions(),
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(insertProductReviewSchema),
    defaultValues: {
      businessId: businessId,
      productId: productId,
      message: "",
      rate: 5,
      email: "",
      name: "Guest",
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

export default SingleProductComp;
