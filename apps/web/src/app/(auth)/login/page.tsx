// import { redirect } from "next/navigation";
// export const dynamic = "force-dynamic";
import { LoginForm } from "@/features/auth/login/login-form";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import UpdateDisplayNameForm from "@/features/auth/login/display-update";
export default async function Login() {
  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserDetail.query(),
  );

  let session = null;

  try {
    session = await asyncHandler(trpcServer.auth.verifyauth.query());
  } catch (error) {
    // handle TRPC error specifically
    if (error && typeof error === "object" && "code" in error) {
      return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm />
          </div>
        </div>
      );
    }

    //   // let unexpected errors bubble (Next.js will show error page)
    //   throw error;
    // }

    // only redirect after successful TRPC call
    if (session?.data?.success) {
      if (userData?.displayName === null || userData?.displayName === "null") {
        return (
          <div className="w-full">
            <UpdateDisplayNameForm userId={Number(userData?.id)} />
          </div>
        );
      } else {
        // redirect("/"); // never wrap this in try/catch
        console.log("User already logged in, redirecting...");
      }
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
}
