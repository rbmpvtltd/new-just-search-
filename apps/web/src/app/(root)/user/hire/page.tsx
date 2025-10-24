import AddHirePage from "@/features/hire/create/add-hire";
import MyHire from "@/features/hire/show/MyHire";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getRole } from "@/utils/session";

export default async function page() {
  const role = await getRole();
  return <div>{role?.value === "hire" ? <MyHireList /> : <AddHire />}</div>;
}

async function AddHire() {
  const { data, error } = await asyncHandler(trpcServer.hirerouter.add.query());
  console.log("data", data);

  // if (error) return <ErrorComponent error={error} />;
  return <AddHirePage data={data} />;
}
async function MyHireList() {
  const { data: myHire, error: myHireError } = await asyncHandler(
    trpcServer.hirerouter.show.query(),
  );
  console.log("myHire", myHire);

  if (!myHire) return <div>no data</div>;
  // if (myHireError) return <ErrorComponent error={myHireError} />;
  return <MyHire data={myHire} />;
}
