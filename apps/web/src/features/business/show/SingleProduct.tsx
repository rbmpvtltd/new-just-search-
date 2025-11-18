"use client";
import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import parse from "html-react-parser";
import Image from "next/image";
import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
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
import { Label } from "@/components/ui/label";
import Rating from "@/components/ui/Rating";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

type SingleProductType =
  | OutputTrpcType["businessrouter"]["singleProduct"]
  | null;

function SingleProductComp({
  productPhotos,
  product,
}: {
  productPhotos: string[];
  product: SingleProductType;
}) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const content = parse(product?.description ?? "");
  const trpc = useTRPC();
  const { mutateAsync: createConversation } = useMutation(
    trpc.chat.createConversation.mutationOptions(),
  );

  async function handleChat() {
    const conv = await createConversation({
      receiverId: Number(product?.businessId),
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

  console.log("Product", product);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <Carousel opts={{ loop: true }} className="w-[90%] sm:w-[40%] ">
          <CarouselContent className="ml-5">
            {productPhotos?.map((item, index: number) => (
              <CarouselItem key={index.toString()} className="pl-1 basis-1/1">
                <div className="py-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <Image
                        width={500}
                        height={400}
                        alt="banner image"
                        src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg" // TODO : change photo url when upload on cloudinary
                        className="rounded-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="w-[90%] sm:w-[50%] flex flex-col gap-2">
          <h2 className="font-medium">{product?.shopName}</h2>
          <h1 className="text-2xl line-clamp-1 text-secondary font-semibold">
            {product?.name}
          </h1>
          <div>{content}</div>

          <h1 className="text-xl text-primary">
            ₹ <span className="text-secondary">{product?.rate}</span>
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() =>
                console.log(
                  `clicked on view Shop Button Shop will be open with id no ${product?.businessId}`,
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
                        image: product?.photos[0],
                        route: `http://localhost:9000/business/singleProduct/${product?.id}`,
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
      <div className="w-[80%] mx-auto mt-5">
        {product?.rating?.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className=" p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center w-full ">
                <h1 className="text-xl font-medium text-secondary">
                  {item?.user}
                </h1>
                <p className="flex items-center gap-2 text-sm">
                  <FaRegCalendarAlt className="text-primary" />{" "}
                  {new Date(item?.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Rating rating={item?.rating} />
              <p>{item?.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SingleProductComp;
