import { redirect } from "next/navigation";
import UpdateDisplayNameForm from "@/features/auth/login/display-update";
import UserProfile from "@/features/profile/UserProfile";
import GetUserProfile from "@/features/profile/UserProfile";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getToken } from "@/utils/session";

export default async function page() {
  const data = await getToken();
  if (!data) {
    redirect("/login");
  }
  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserDetail.query(),
  );

  if (userData?.displayName === null || userData?.displayName === "null") {
    return (
      <div className="w-full">
        <UpdateDisplayNameForm userId={Number(userData?.id)} />
      </div>
    );
  }

  return <GetUserProfile />;
}
