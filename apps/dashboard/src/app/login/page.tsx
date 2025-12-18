import { redirect } from "next/navigation";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { redirectRole } from "@/utils/redirect";
import { LoginForm } from "./login-form";

export default async function Login() {
  console.log("login page");
  const dashboardverify = await asyncHandler(
    trpcServer.auth.dashboardverify.query(),
  );

  if (dashboardverify?.data?.success) {
    return redirect(redirectRole(dashboardverify.data.role ?? ""));
  }
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
