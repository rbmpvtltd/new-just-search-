import { redirect } from "next/navigation";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { RegisterForm } from "../../../features/auth/register/register-form";

export default async function Register() {
  const session = await asyncHandler(trpcServer.auth.verifyauth.query());

  if (!session?.data?.success) {
    return <RegisterForm />;
  }
  redirect("/");
}
