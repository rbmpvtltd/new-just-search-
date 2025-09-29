// import { FormField } from "@/components/form-component";

import { TRPCClientError } from "@trpc/client";
import { redirect } from "next/navigation";
import { trpcServer } from "@/trpc/trpc-server";
import { LoginForm } from "@/features/auth/login/login-form";
export default async function Login() {
  let session = null;

  try {
    session = await trpcServer.auth.verifyauth.query();
  } catch (error) {
    // handle TRPC error specifically
    if (error instanceof TRPCClientError) {
      return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm />
          </div>
        </div>
      );
    }

    // let unexpected errors bubble (Next.js will show error page)
    throw error;
  }

  // only redirect after successful TRPC call
  if (session?.success) {
    redirect("/banner"); // never wrap this in try/catch
  }

  // fallback UI (optional, if session is null or false)
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
