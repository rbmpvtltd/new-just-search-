import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import { SectionCards2 } from "@/components/dashboard/section-cards_2";
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
        <div>project {process.env.TEST_DASHBOARD}</div>
        <div>repo root {process.env.TEST}</div>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <VersionBtnComponent initialValue={lastVesion} />
          <SectionCards2 />
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
}
