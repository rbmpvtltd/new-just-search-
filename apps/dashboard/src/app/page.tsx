import { redirect } from "next/navigation";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { redirectRole } from "@/utils/redirect";

export default async function Login() {
  const dashboardverify = await asyncHandler(
    trpcServer.auth.dashboardverify.query(),
  );

  if (dashboardverify?.data?.success) {
    redirect(redirectRole(dashboardverify?.data?.role ?? ""));
  }
  redirect("/login");
}
