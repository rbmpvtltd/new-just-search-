import { BecomeVisitorForm } from "@/features/auth/login/VerifyNumber";
import CreateHireListing from "@/features/hire/create/add-hire";
import MyHire from "@/features/hire/show/MyHire";
import { trpcServer } from "@/trpc/trpc-server";
import BoundaryWrapper from "@/utils/BoundaryWrapper";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { getRole } from "@/utils/session";

export default async function page() {
  const role = await getRole();
    if (role === "guest") {
      return (
        <BecomeVisitorForm />
      )
    }
  return <div>{role === "hire" ? <MyHireList /> : <CreateHireListing />}</div>;
}

async function MyHireList() {
  const { data: myHire, error: myHireError } = await asyncHandler(
    trpcServer.hirerouter.show.query(),
  );

  if (!myHire) {
    return <CreateHireListing />;
  }
  return <MyHire data={myHire} />;
}
