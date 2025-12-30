import CreateBusinessListing from "@/features/business/create/add-business";
import MyBusiness from "@/features/business/show/MyBusiness";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getRole } from "@/utils/session";

export default async function page() {
  const role = await getRole();
  console.log("");

  return (
    <div>
      {role === "business" ? <MyBusinessList /> : <CreateBusinessListing />}
    </div>
  );
}

async function MyBusinessList() {
  const { data: myBusiness, error } = await asyncHandler(
    trpcServer.businessrouter.show.query(),
  );
  console.log("Error", error);

  if (!myBusiness) return <CreateBusinessListing />;

  return <MyBusiness data={myBusiness} />;
}
