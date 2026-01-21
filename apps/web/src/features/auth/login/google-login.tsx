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
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { setRole, setToken } from "@/utils/session";

export default function GoogleLoginBtn({ className }: { className?: string }) {
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

  return (
    <Button className={`${className}`} onClick={handleGoogleLogin}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
        className="h-5 w-5"
      >
        <title>Google</title>
        <path
          fill="currentColor"
          d="M488 261.8c0-17.8-1.6-35.2-4.7-52H249v98.6h134.1c-5.8 31.4-23.2 57.9-49.5 75.8v62.7h79.8c46.7-43 74-106.4 74-185.1zM249 492c67 0 123.1-22.1 164.1-60.1l-79.8-62.7c-22.1 14.9-50.4 23.6-84.3 23.6-64.9 0-119.9-43.8-139.6-102.7H27.2v64.5C68.7 429.3 152.1 492 249 492zM109.4 289.1c-4.7-14.1-7.3-29.1-7.3-44.6s2.6-30.5 7.3-44.6v-64.5H27.2C9.8 169.5 0 207.2 0 244.5s9.8 75 27.2 108.9l82.2-64.3zM249 97.9c36.4 0 69.1 12.6 94.9 37.4l71.1-71.1C372.1 24.8 316 2 249 2 152.1 2 68.7 64.7 27.2 161.5l82.2 64.5C129.1 141.7 184.1 97.9 249 97.9z"
        />
      </svg>
      Google
    </Button>
  );
}
