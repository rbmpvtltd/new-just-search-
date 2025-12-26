// "use client";
// import { Button } from "@/components/ui/button";
// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

// export default function Login() {
//   const trpc = useTRPC();
//   const googleLogin = useQuery({
//     ...trpc.auth.googleLogin.queryOptions(),
//     enabled: false,
//   });

//   const handleGoogleLogin = async () => {
//     const res = await googleLogin.refetch();
//     if (res.data?.url) {
//       window.location.href = res.data.url; // redirect to Google OAuth
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Button onClick={handleGoogleLogin}>Login with Google</Button>
//     </div>
//   );
// }
"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { setRole, setToken } from "@/utils/session";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleLoginBtn() {
  const trpc = useTRPC();
  const router = useRouter();

  const googleLogin = useQuery({
    ...trpc.auth.googleLogin.queryOptions(),
    enabled: false,
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

  const handleGoogleLogin = async () => {
    const res = await googleLogin.refetch();
    if (res.data?.url) {
      // Open Google OAuth in a popup window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        res.data.url,
        "Google Login",
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    }
  };

  return <Button onClick={handleGoogleLogin}>Login with Google</Button>;
}
