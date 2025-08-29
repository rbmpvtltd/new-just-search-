"use client";
import Link from "next/link";
import { trpc } from "utils/trpc";

export default function Home() {
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const token = (await trpc.auth.login.query({
            email: "otherritik000@gmail.com",
            password: "12345678",
          })) as string;

          localStorage.setItem("token", token);
        }}
      >
        login
      </button>
      <Link href={"/user"}>hi go to use</Link>
    </div>
  );
}
