"use client";
import Link from "next/link";
import { useTransition } from "react";
import { serverFunction,banners } from "./action";


export default function Home() {
  
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            await serverFunction();
            const data = await banners()
            console.log("data in client side",data)
          });
        }}
      >
        login
      </button>
      <p>
        {isPending ? "Loading..." : <Link href={"/user"}>hi go to use</Link>}
      </p>
    </div>
  );
}
