import { SectionCards } from "./salesman/components/section-cards";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div>project {process.env.TEST_DASHBOARD}</div>
        <div>repo root {process.env.TEST}</div>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={0} />
        </div>
      </div>
    </div>
  );
}
