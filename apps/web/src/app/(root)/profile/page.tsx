import UserProfile from "@/features/user/profile/UserProfile";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserProfile.query(),
  );

  const { data: referenceData } = await asyncHandler(
    trpcServer.userRouter.add.query(),
  );

  if (!userData) return <div className="">no data</div>;
  return <UserProfile user={userData} formReferenceData={referenceData} />;
}
