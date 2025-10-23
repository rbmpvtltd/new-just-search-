"use client"
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function LoginWithApple() {
  const trpc = useTRPC();

  // TRPC query for Apple login URL
  const appleLogin = useQuery({
    ...trpc.auth.appleLogin.queryOptions(),
    enabled: false, // initially disabled, trigger manually
  });

  const handleAppleLogin = async () => {
    console.log("clicked on apple login button")
    const res = await appleLogin.refetch();
    if (res.data?.url) {
      window.location.href = res.data.url; // redirect to Apple OAuth
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleAppleLogin}>Login with Apple</Button>
    </div>
  );
}
