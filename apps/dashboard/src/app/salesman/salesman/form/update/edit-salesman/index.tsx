"use client";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import type { SetOpen } from "../../edit.form";
import { useSalesmanFormStore } from "../../shared/store/useCreateSalesmanStore";
import ProfileForm from "./forms/ProfileForm";
import SalesmanForm from "./forms/SalesmanForm";
import UserForm from "./forms/UserForm";

export type EditAdminSalesmanType =
  OutputTrpcType["adminSalemanRouter"]["edit"];

export function EditSalesmanPage({
  id,
  data,
  setOpen,
}: {
  id: number;
  data: EditAdminSalesmanType;
  setOpen: SetOpen;
}) {
  console.log("Data Salesman", data);
  console.log("Data Salesman id---------", id);

  const trpc = useTRPC();
  const page = useSalesmanFormStore((state) => state.page);
  const steps = ["User Form", "Profile Form", "Salesman Form"];

  const renderForm = () => {
    switch (page) {
      case 0:
        return <UserForm data={data} />;
      case 1:
        return <ProfileForm data={data} />;
      case 2:
        return <SalesmanForm data={data} setOpen={setOpen} />;
      default:
        return <UserForm data={data} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <div className="mb-6">
        <div className="flex justify-around mb-2">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`text-sm font-medium ${index <= page ? "text-blue-600" : "text-gray-400"}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((page + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="border p-4 rounded-lg">{renderForm()}</div>
    </div>
  );
}
