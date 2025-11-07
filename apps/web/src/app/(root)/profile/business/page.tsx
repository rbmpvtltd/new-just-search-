import AddBusinessPage from "@/features/business/create/add-business";
import MyBusiness from "@/features/business/show/MyBusiness";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getRole } from "@/utils/session";

export default async function page() {
  const role = await getRole();
  return (
    <div className="">
      {role?.value === "business" ? <MyBusinessList /> : <AddBusiness />}
    </div>
  );
}

async function AddBusiness() {
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  return <AddBusinessPage data={data} />;
}

async function MyBusinessList() {
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.show.query(),
  );

  if (!data) return <div className="">no data</div>;

  return <MyBusiness data={data} />;
}
