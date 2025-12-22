// import { redirect } from "next/navigation";
// export const dynamic = "force-dynamic";

import UpdateDisplayNameForm from "@/features/auth/login/display-update";
import { LoginForm } from "@/features/auth/login/login-form";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
export default async function Login() {
  const { data: userData, error } = await asyncHandler(
    trpcServer.userRouter.getUserDetail.query(),
  );

  // try {
  const session = await asyncHandler(trpcServer.auth.verifyauth.query());
  console.log("Hii dasdasda", userData);
  // } catch (error) {
  // console.log("Error", error);

  // if (error && typeof error === "object" && "code" in error) {
  //   return (
  //     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
  //       <div className="w-full max-w-sm md:max-w-3xl">
  //         <LoginForm />
  //       </div>
  //     </div>
  //   );
  // }

  if (!session?.data?.success) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    );
  }
  // if (session?.data?.success) {
  //   if (userData?.displayName === null || userData?.displayName === "null") {
  //     console.log("SESSION Find ", session);

  //     return (
  //       <div className="w-full">
  //         <UpdateDisplayNameForm userId={Number(userData?.id)} />
  //       </div>
  //     );
  //   } else {
  //     // redirect("/"); // never wrap this in try/catch
  //     console.log("NOT find");

  //     console.log("User already logged in, redirecting...");
  //   }
  // }
  if (!userData?.displayName || userData.displayName === "null") {
    return (
      <div className="w-full">
        <UpdateDisplayNameForm userId={Number(userData?.id)} />
      </div>
    );
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
// }
