import AllHireList from "@/features/hire/show/AllHireListing";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

async function page({searchParams}:{searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const getsearchParams = await searchParams;
  const page = Number(getsearchParams.page ?? 1);
  const { data,error } = await asyncHandler(
    trpcServer.hirerouter.allHireLising.query({
      limit: 10,
      page: page,
    }),
  );
  if(error){
      return <ErrorComponent error={error} />
    }
  return <AllHireList hire={data?.data} page={data?.page} totalPages={data?.totalPages} />
}

export default page;
