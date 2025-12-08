import CreateBusinessListing from "@/features/business/create/add-business";
import AddBusinessPage from "@/features/business/create/add-business";
import MyBusiness from "@/features/business/show/MyBusiness";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getRole } from "@/utils/session";

export default async function page() {
  const role = await getRole();
  return (
    <div>
      {role?.value === "business" ? (
        <MyBusinessList />
      ) : (
        <CreateBusinessListing />
      )}
    </div>
  );
}

// async function AddBusiness() {
//   const { data, error } = await asyncHandler(
//     trpcServer.businessrouter.add.query(),
//   );

//   return <CreateBusinessListing data={data} />;
// }

async function MyBusinessList() {
  const { data: myBusiness, error } = await asyncHandler(
    trpcServer.businessrouter.show.query(),
  );

  if (!myBusiness) return <CreateBusinessListing />;

  return <MyBusiness data={myBusiness} />;
}
