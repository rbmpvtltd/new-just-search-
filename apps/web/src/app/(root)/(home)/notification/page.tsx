"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Notification() {
  const trpc = useTRPC();
  const authenticated = Cookies.get("authenticated");
  const router = useRouter();
  console.log("Is Authenticated", authenticated);
  if (!authenticated) {
    router.push("/");
  }
  const { data } = useQuery(
    trpc.notificationRouter.getNotifications.queryOptions(),
  );


  console.log("Notification Data", data);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  return (
    <div
      style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <Dialog>
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-10">
          {data?.data && data?.data?.length > 0 ? (
            data?.data?.map((notification) => (
              <DialogTrigger onClick={()=>{
                setSelectedNotification(notification)
              }} key={notification.id.toString()} >
                <div>
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 m-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium text-lg ">
                        <Image
                          src="/images/app-icon.png"
                          width="40"
                          height="40"
                          alt="image"
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-semibold">
                          {String(notification?.title)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {notification.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-400">
                        {String(notification.createdAt)
                          .split(" ")
                          .slice(0, 3)
                          .join(" ")}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
            ))
          ) : (
            <p>No Notifications To Show</p>
          )}

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification?.title}</DialogTitle>
              <DialogDescription>
                {selectedNotification?.description}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
