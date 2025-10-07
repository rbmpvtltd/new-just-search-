// import { FormField } from "@/components/form-component";

import { TRPCClientError } from "@trpc/client";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { trpcServer } from "@/trpc/trpc-server";
export default async function Login() {
  let session = null;

  try {
    session = await trpcServer.auth.verifyauth.query();
  } catch (error) {
    // handle TRPC error specifically
    if (error instanceof TRPCClientError) {
      return <LoadLoginForm />;
    }

    // let unexpected errors bubble (Next.js will show error page)
    throw error;
  }

  // only redirect after successful TRPC call
  if (session?.success) {
    redirect("/"); // never wrap this in try/catch
  }

  // fallback UI (optional, if session is null or false)
  return <LoadLoginForm />;
}

const LoadLoginForm = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};
