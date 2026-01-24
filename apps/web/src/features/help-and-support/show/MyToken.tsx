"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "timeago.js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

export default function MyToken() {
  const trpc = useTRPC();
  const { data: myTokens, isLoading } = useQuery(
    trpc.helpAndSupportRouter.show.queryOptions(),
  );
  if (isLoading) {
    return <Spinner />;
  }
  const parseDate = (dateString: any) => {
    return new Date(dateString);
  };

  return (
    <div className="p-6 ">
      <div className="w-full border overflow-x-auto rounded-lg">
        <div className="min-w-[800px]">
          <div className="flex p-2 justify-end">
            <Link href="/profile/help-and-support/add">
              <Button>Create Token</Button>
            </Link>
          </div>
          <div className="grid grid-cols-6 bg-gray-100 px-4 py-3 font-semibold rounded-t-lg text-sm">
            <div>#</div>
            <div className="">Token Number</div>
            <div>Subject</div>
            <div>Created At</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {myTokens ? (
            myTokens?.map((token, index) => (
              <div key={token.id} className="">
                <div className="grid grid-cols-6 items-center px-4 py-3 border-b text-sm hover:bg-gray-50 transition">
                  <div>{index + 1}</div>
                  <div className="font-medium line-clamp-1">
                    {token.tokenNumber}
                  </div>
                  <div className="font-medium line-clamp-1">
                    {token.subject}
                  </div>
                  <div className="line-clamp-1">
                    {format(parseDate(token.createdAt), "en_US")}
                  </div>
                  <div className="font-medium line-clamp-1">
                    {token.status ? "Active" : "Expired"}
                  </div>

                  <div className="flex items-center -ml-5">
                    <Link href={`/profile/help-and-support/chat/${token.id}`}>
                      <Button
                        size="icon"
                        className="cursor-pointer w-[70px] bg-blue-500"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tokens found</p>
          )}
        </div>
      </div>
    </div>
  );
}
