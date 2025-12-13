import EditBusinessPage from "@/features/business/update/edit-business";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page({
  params,
}: {
  params: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const { id } = await params;

  const { data: userBusinessListing, error: myBusinessError } =
    await asyncHandler(
      trpcServer.businessrouter.edit.query({
        id: Number(id),
      }),
    );

  if (myBusinessError) {
    return <h1>Something Went Wrong</h1>;
  }

  return <EditBusinessPage businessListing={userBusinessListing} />;
}
