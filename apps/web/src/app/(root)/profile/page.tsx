import UpdateDisplayNameForm from "@/features/auth/login/display-update";
import UserProfile from "@/features/profile/UserProfile";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getToken } from "@/utils/session";
import { redirect } from "next/navigation";

export default async function page() {
  const data = await getToken();
  if (!data) {
    redirect("/login");
  }
  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserDetail.query(),
  );
  const { data: userProfile } = await asyncHandler(
    trpcServer.userRouter.edit.query(),
  );
  if (userData?.displayName === null || userData?.displayName === "null") {
    return (
      <div className="w-full">
        <UpdateDisplayNameForm userId={Number(userData?.id)} />
      </div>
    );
  }

  if (!userData) return <div className="">no data</div>;
  return <UserProfile user={userProfile} />;
}
