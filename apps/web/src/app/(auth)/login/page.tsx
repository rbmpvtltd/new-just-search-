export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import UpdateDisplayNameForm from "@/features/auth/login/display-update";
import { LoginForm } from "@/features/auth/login/login-form";

import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getToken } from "@/utils/session";

export default async function Login() {
  const data = await getToken();

  // try {
  const session = await asyncHandler(trpcServer.auth.verifyauth.query());
  if (data) {
    redirect("/");
  }

  // Not logged in → show login
  if (!session?.data?.success) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    );
  }

  // User is logged in fetch user data
}
