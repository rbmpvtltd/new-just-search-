import { statuses } from "dummy/data";
import { title } from "process";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";

async function getData(): Promise<any> {
  return [
    {
      id: "1",
      title: "Hello",
      status: statuses.map((status) => status.value)[0],
      priority: "high",
      hello: "hi",
    },
    {
      id: "2",
      title: "World",
      status: statuses.map((status) => status.value)[1],
      priority: "high",
    },
    {
      id: "3",
      title: "Goodbye",
      status: statuses.map((status) => status.value)[2],
      priority: "high",
    },
    {
      id: "4",
      title: "World",
      status: statuses.map((status) => status.value)[3],
      priority: "medium",
    },
    {
      id: "5",
      title: "Goodbye",
      status: statuses.map((status) => status.value)[2],
      priority: "medium",
    },
    {
      id: "6",
      title: "Goodbye",
      status: statuses.map((status) => status.value)[2],
      priority: "medium",
    },
    {
      id: "7",
      title: "Hello",
      status: statuses.map((status) => status.value)[1],
      priority: "low",
    },
    {
      id: "8",
      title: "Mera",
      status: statuses.map((status) => status.value)[1],
      priority: "high",
    },
    {
      id: "9",
      title: "Naam",
      status: statuses.map((status) => status.value)[1],
      priority: "high",
    },
    {
      id: "10",
      title: "Ranjeet",
      status: statuses.map((status) => status.value)[1],
      priority: "high",
    },
    {
      id: "11",
      title: "Goodbye",
      status: statuses.map((status) => status.value)[1],
      priority: "low",
    },
  ];
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
