"use client";

import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

type User = {
  id: number;
  name: string;
  email: string;
};

const data: User[] = [
  { id: 1, name: "Ranjeet", email: "ranjeet@example.com" },
  { id: 2, name: "Alex", email: "alex@example.com" },
  { id: 3, name: "Sam", email: "sam@example.com" },
  { id: 4, name: "Tina", email: "tina@example.com" },
  { id: 5, name: "Amit", email: "amit@example.com" },
  { id: 6, name: "Priya", email: "priya@example.com" },
  { id: 7, name: "Rahul", email: "rahul@example.com" },
  { id: 8, name: "Neha", email: "neha@example.com" },
  { id: 9, name: "Karan", email: "karan@example.com" },
  { id: 10, name: "Meera", email: "meera@example.com" },
  { id: 11, name: "Vikram", email: "vikram@example.com" },
  { id: 12, name: "Sanya", email: "sanya@example.com" },
  { id: 13, name: "Kabir", email: "kabir@example.com" },
  { id: 14, name: "Ananya", email: "ananya@example.com" },
  { id: 15, name: "Ravi", email: "ravi@example.com" },
  { id: 16, name: "Sneha", email: "sneha@example.com" },
  { id: 17, name: "Arjun", email: "arjun@example.com" },
  { id: 18, name: "Isha", email: "isha@example.com" },
  { id: 19, name: "Dev", email: "dev@example.com" },
  { id: 20, name: "Shreya", email: "shreya@example.com" },
  { id: 21, name: "Varun", email: "varun@example.com" },
  { id: 22, name: "Nisha", email: "nisha@example.com" },
  { id: 23, name: "Rohit", email: "rohit@example.com" },
  { id: 24, name: "Kriti", email: "kriti@example.com" },
  { id: 25, name: "Manish", email: "manish@example.com" },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => <span>{getValue<number>()}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <DataTable columns={columns} data={data} />
      
    </div>
  );
}
