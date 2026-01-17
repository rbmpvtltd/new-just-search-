"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBusinessReviewSchema } from "@repo/db/dist/schema/business.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPhoneAlt, FaRegCalendarAlt, FaWhatsappSquare } from "react-icons/fa";
import { IoChatbubbleEllipses, IoMail } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import Swal from "sweetalert2";
import type z from "zod";
import LoginRedirect from "@/components/LoginRedirect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GoMap from "@/components/ui/Map";
import Rating from "@/components/ui/Rating";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import Favourite from "../../shared/Favourite";

type SingleShopType = OutputTrpcType["businessrouter"]["singleShop"] | null;

export function ShopTabBar({ singleShop }: { singleShop: SingleShopType }) {
  const trpc = useTRPC();
  const latitude = singleShop?.latitude;
  const longitude = singleShop?.longitude;
  const { data } = useQuery(trpc.auth.verifyauth.queryOptions());
  const { data: submmited } = useQuery(
    trpc.businessrouter.ReviewSubmitted.queryOptions({
      businessId: singleShop?.id ?? 0,
    }),
  );

  const handleClick = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank"); // opens in new tab
  };

  const router = useRouter();
  const { mutateAsync: createConversation, isPending } = useMutation(
    trpc.chat.createConversation.mutationOptions(),
  );

  const handleChat = async () => {
    const conv = await createConversation({
      receiverId: Number(singleShop?.userId),
    });
    // setTimeout(() => {
    router.push(`/chat/${conv?.id}`);
    // }, 5000);
  };

  return (
    <div className="flex  w-full  flex-col gap-16 mb-12">
      <Tabs defaultValue="about" className=" mx-auto">
        <TabsList className="flex-wrap">
          <TabsTrigger value="about">About Business</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="about" className="mt-10 sm:mt-0">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-baseline gap-4">
              <h1 className="text-2xl font-semibold line-clamp-1">
                {singleShop?.name}
              </h1>
              <Favourite
                initialFav={singleShop?.isFavourite ?? false}
                businessId={singleShop?.id ?? 0}
              />
            </div>

            <div className="flex items-center gap-2 ">
              <MdLocationPin />
              <p className="text-sm">
                {singleShop?.address} {singleShop?.streetName}{" "}
                {singleShop?.buildingName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex gap-2 items-center">
                <FaPhoneAlt />
                <Badge variant="destructive">{singleShop?.phoneNumber}</Badge>
              </div>

              {singleShop?.whatsappNo && (
                <div className="flex items-center gap-2">
                  ,
                  <FaWhatsappSquare />
                  <Badge variant="default">{singleShop?.whatsappNo}</Badge>
                </div>
              )}
              {singleShop?.email && (
                <div className="flex items-center gap-2">
                  ,
                  <IoMail />
                  <Badge variant="default">{singleShop?.email}</Badge>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">
                <b>Home Delivery</b> : {singleShop?.homeDelivery ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="font-medium">
                <b> Specialist in</b> : {singleShop?.specialities}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap w-full">
              <p className="font-medium">
                <b>Categories</b>:
              </p>
              <Badge variant="default">{singleShop?.category}</Badge>

              {singleShop?.subcategories.map(
                (subcategory: string, index: number) => (
                  <Badge variant="destructive" key={index.toString()}>
                    {subcategory}
                  </Badge>
                ),
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-[70%] justify-between mx-auto sm:mx-0">
              <Button
                onClick={handleClick}
                type="button"
                className=" whitespace-nowrap flex items-center text-white font-semibold w-full sm:w-[30%] gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <MdLocationPin />
                Get Direction
              </Button>
              <Button
                disabled={isPending}
                onClick={handleChat}
                className="whitespace-nowrap flex items-center text-white font-semibold w-full sm:w-[30%] gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <IoChatbubbleEllipses />
                {isPending ? <Spinner /> : "Chat Now"}
              </Button>

              {/* </div> */}
              <Button
                onClick={() => {
                  console.log("calling on", singleShop?.phoneNumber);
                }}
                type="button"
                className="flex whitespace-nowrap items-center text-white font-semibold w-full sm:w-[30%] gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <FaPhoneAlt />
                Contact Now
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="products" className="mt-10 sm:mt-0">
          <ShopProducts
            shopId={Number(singleShop?.id)}
            shopName={singleShop?.name ?? ""}
          />
        </TabsContent>
        <TabsContent value="offers" className="mt-10 sm:mt-0">
          <ShopOffers
            shopId={Number(singleShop?.id)}
            shopName={singleShop?.name ?? ""}
          />
        </TabsContent>
        <TabsContent value="location" className="mt-10 sm:mt-0">
          <div className="p-4 flex flex-wrap justify-between gap-4">
            <GoMap
              latitude={String(singleShop?.latitude)}
              longitude={String(singleShop?.longitude)}
              title={singleShop?.name}
            />
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-10 sm:mt-0">
          <div className="p-4 flex flex-col gap-4 w-full">
            {data?.success && (
              <div>
                {submmited?.submitted && (
                  <Card className="border-green-200 pt-4 bg-green-50/50">
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
                            submitted a review for this business.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )}
                {!submmited?.submitted && (
                  <ReviewForm businessId={singleShop?.id ?? 0} />
                )}
              </div>
            )}
            {!data?.success && <LoginRedirect />}
            <div className="w-full">
              <h1 className="text-2xl font-semibold text-secondary">
                Recommended Reviews
              </h1>
              {singleShop?.rating.length === 0 && (
                <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
                  <h1 className="text-secondary text-center">
                    No Reviews Founds On {singleShop.name} Shop
                  </h1>
                </div>
              )}
              {singleShop?.rating?.map(
                (
                  item: {
                    id: number;
                    created_at: string;
                    rating: number;
                    message: string;
                    user: string;
                  },
                  index: number,
                ) => {
                  return (
                    <div
                      key={index.toString()}
                      className="p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center w-full ">
                        <h1 className="text-xl font-medium text-secondary">
                          {item.user ?? "Unknown"}
                        </h1>
                        <p className="flex items-center gap-2 text-sm">
                          <FaRegCalendarAlt className="text-primary" />{" "}
                          {new Date(item.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <Rating rating={item.rating} />
                      <p>{item.message}</p>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ShopOffers({
  shopId,
  shopName,
}: {
  shopId: number;
  shopName: string;
}) {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.businessrouter.shopOffers.queryOptions({ businessId: shopId }),
  );

  console.log("Shop ---------------->", data);

  return (
    <div className="p-4 flex flex-wrap justify-between gap-4">
      {data?.length === 0 && (
        <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
          <h1 className="text-secondary">
            No Offers Founds On {shopName} Shop
          </h1>
        </div>
      )}
      {data?.map((item, index) => (
        <div
          key={index.toString()}
          className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-101 transform transition-all duration-300 flex flex-col justify-between items-center lg:w-[30%] md:w-[45%] w-[95%]"
        >
          <Link
            href={{
              pathname: `/subcategory/aboutBusiness/offers/singleOffers/${item.id}`,
            }}
          >
            <div className="relative">
              {/* <Image
                width={200}
                height={400}
                alt="offer image"
                src="https://www.justsearch.net.in/assets/images/6194461891759217396.png"
              /> */}
              <CldImage
                width="300"
                height="300"
                className="rounded-md"
                src={item?.photos[0] ?? ""}
                alt="Shop Image"
              />
              <span className="absolute z-1 top-3  w-[70px] bg-error text-end px-4 text-white rounded-r-md">
                -{item.discountPercent}%
              </span>
            </div>
          </Link>
          <h2 className="text-center font-medium line-clamp-2 px-4">
            {item.name}
          </h2>
          <h2>
            ₹ <span className="line-through">{item.price}</span>
          </h2>
          <h2 className="font-semibold text-primary">₹ {item.price}</h2>
        </div>
      ))}
    </div>
  );
}

function ShopProducts({
  shopId,
  shopName,
}: {
  shopId: number;
  shopName: string;
}) {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.businessrouter.shopProducts.queryOptions({ businessId: shopId }),
  );

  return (
    <div className="p-4 flex flex-wrap justify-between gap-4">
      {data?.length === 0 && (
        <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
          <h1 className="text-secondary">
            No Product Founds On {shopName} Shop
          </h1>
        </div>
      )}
      {data?.map((item, index) => (
        <div
          key={index.toString()}
          className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-101 transform transition-all duration-300 flex flex-col justify-between items-center lg:w-[30%] md:w-[45%] w-[95%]"
        >
          <Link
            href={{
              pathname: `/subcategory/aboutBusiness/products/singleProduct/${item.id}`,
            }}
          >
            <Image
              width={200}
              height={400}
              className="rounded-md"
              src="https://www.justsearch.net.in/assets/images/10922718251737465572.JPEG" // TODO : change image when upload on cloudinary
              alt="product image"
            />
          </Link>
          <h2 className="text-center font-medium p-2">{item.name}</h2>
          <h2 className="font-medium">
            ₹ <span className="text-primary">{item.price}</span>
          </h2>
        </div>
      ))}
    </div>
  );
}

type ReviewFormValues = z.infer<typeof insertBusinessReviewSchema>;

function ReviewForm({ businessId }: { businessId: number }) {
  const trpc = useTRPC();
  const [submittedData, setSubmittedData] = useState<any>(null);

  const { mutate, isPending } = useMutation(
    trpc.businessrouter.businessReview.mutationOptions(),
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(insertBusinessReviewSchema),
    defaultValues: {
      businessId: businessId,
      message: "",
      rate: 5,
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
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-muted-foreground">
          Share your experience with this business
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
