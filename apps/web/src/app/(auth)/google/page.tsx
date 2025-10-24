"use client"
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";




export default function Login() {
    const trpc = useTRPC()
  const googleLogin = useQuery({...trpc.auth.googleLogin.queryOptions(),enabled : false})

  const handleGoogleLogin = async () => {
    const res = await googleLogin.refetch();
    if (res.data?.url) {
      window.location.href = res.data.url; // redirect to Google OAuth
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </div>
  );
}
