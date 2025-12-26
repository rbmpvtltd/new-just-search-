"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { setRole, setToken } from "@/utils/session";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppleLoginBtn() {
  const trpc = useTRPC();
  const router = useRouter();

  // TRPC query for Apple login URL
  const appleLogin = useQuery({
    ...trpc.auth.appleLogin.queryOptions(),
    enabled: false, // initially disabled, trigger manually
  });

  useEffect(() => {
    // Listen for messages from the popup window
    const handleMessage = async (event: MessageEvent) => {
      console.log(event);
      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        // Handle success just like your regular login
        await setToken(event.data.session);
        setRole(event.data.role);
        router.push("/");
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        console.error("Google auth error:", event.data.error);
        // Handle error
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const handleAppleLogin = async () => {
    console.log("clicked on apple login button");
    const res = await appleLogin.refetch();
    if (res.data?.url) {
      // Open Google OAuth in a popup window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        res.data.url,
        "Apple Login",
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    }
  };

  return <Button onClick={handleAppleLogin}>Login with Apple</Button>;
}
