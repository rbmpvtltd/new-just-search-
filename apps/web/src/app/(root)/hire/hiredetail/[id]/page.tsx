import HireDetailCard from "@/features/hire/show/component/HireDetailCard";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

async function page({
  params,
}: {
  params: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const { id } = await params;
  const { data } = await asyncHandler(
    trpcServer.hirerouter.singleHire.query({ hireId: Number(id) }),
  );

  return <HireDetailCard data={data} />;
}

export default page;