import { columns, type Payment } from "@/components/columns";
import { DataTable } from "@/components/data-table";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "1",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // add diff value
    {
      id: "2",
      amount: 300,
      status: "processing",
      email: "test@examplecom",
    },
    {
      id: "3",
      amount: 400,
      status: "failed",
      email: "test@examplecom",
    },
    {
      id: "4",
      amount: 500,
      status: "success",
      email: "test@examplecom",
    },
    {
      id: "5",
      amount: 600,
      status: "pending",
      email: "test@examplecom",
    },
    {
      id: "6",
      amount: 700,
      status: "processing",
      email: "test@examplecom",
    },
    {
      id: "7",
      amount: 800,
      status: "failed",
      email: "test@examplecom",
    },
    {
      id: "8",
      amount: 900,
      status: "success",
      email: "test@examplecom",
    },
    {
      id: "9",
      amount: 1000,
      status: "pending",
      email: "test@examplecom",
    },
    {
      id: "10",
      amount: 1100,
      status: "processing",
      email: "test@examplecom",
    },
    {
      id: "11",
      amount: 1200,
      status: "failed",
      email: "test@examplecom",
    },
    {
      id: "12",
      amount: 1300,
      status: "success",
      email: "test@examplecom",
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
