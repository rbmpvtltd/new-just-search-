import UpdateDisplayNameForm from "@/features/auth/login/display-update";
import UserProfile from "@/features/user/profile/UserProfile";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserDetail.query(),
  );

  const { data: referenceData } = await asyncHandler(
    trpcServer.userRouter.add.query(),
  );
  console.log(userData)
  if(userData?.displayName === null || userData?.displayName === "null"){
    return <div className="w-full">
      <UpdateDisplayNameForm userId={Number(userData?.id)}/>
    </div>
  }

  if (!userData) return <div className="">no data</div>;
  return <UserProfile user={userData} formReferenceData={referenceData} />;
}
