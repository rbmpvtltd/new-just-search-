import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import { SectionCards2 } from "@/components/dashboard/section-cards_2";
// import { DataTable } from "@/components/data-table-1";

// import data from "./data.json";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div>project {process.env.TEST_DASHBOARD}</div>
        <div>repo root {process.env.TEST}</div>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
