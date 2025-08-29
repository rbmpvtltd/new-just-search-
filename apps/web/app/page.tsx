"use client";
import Link from "next/link";
import { useTransition } from "react";
import { serverFunction } from "./action";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            await serverFunction();
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
