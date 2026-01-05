import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { VersionBtnComponent } from "./versionBtn.component";

export default async function Page() {
  const { data, error } = await asyncHandler(
    trpcServer.versionRouter.checkLatestVesion.query(),
  );

  let lastVesion = "1.0.0";
  if (!error && data) {
    lastVesion = data;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <VersionBtnComponent initialValue={lastVesion} />
        </div>
      </div>
    </div>
  );
}
