"use client";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import {
  FaBriefcase,
  FaGraduationCap,
  FaLanguage,
  FaPhoneAlt,
  FaSuitcaseRolling,
  FaWhatsappSquare,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdLocationPin, MdSwapHoriz, MdWork } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import type { OutputTrpcType } from "@/trpc/type";

type HireDetailCardType =
  | OutputTrpcType["hirerouter"]["singleHire"]
  | null
  | undefined;
export default function HireDetailCard({ data }: { data: HireDetailCardType }) {
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  };

  const fullAddress = [
    data?.data?.buildingName,
    data?.data?.address,
    data?.data?.city,
    data?.data?.state,
    data?.data?.pincode,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative h-[320px] w-[240px] overflow-hidden rounded-xl border">
              <CldImage
                fill
                src={data?.data?.photo ?? ""}
                alt="Profile image"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {data?.data?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {data?.data?.gender}, Age {calculateAge(data?.data?.dob ?? "")}
              </p>
            </div>

            {data?.data?.category && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{data?.data?.category}</Badge>
                {data?.data?.subcategories?.map((item, i) => (
                  <Badge key={i.toString()} variant="destructive">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <MdLocationPin className="mt-1 text-primary" />
                <p className="text-muted-foreground">{fullAddress}</p>
              </div>

              <Link href={`tel:${data?.data?.mobileNo}`}>
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-primary" />
                  <p>{data?.data?.mobileNo}</p>
                </div>
              </Link>

              {data?.data?.wtspNumber && (
                <Link href={`https://wa.me/${data?.data?.wtspNumber}`}>
                  <div className="flex items-center gap-2">
                    <FaWhatsappSquare className="text-green-500" />
                    <p>{data?.data?.wtspNumber}</p>
                  </div>
                </Link>
              )}

              {data?.data?.email && (
                <Link href={`mailto:${data?.data?.email}`}>
                  <div className="flex items-center gap-2">
                    <IoMail className="text-primary" />
                    <p className="break-all">{data?.data?.email}</p>
                  </div>
                </Link>
              )}
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {data?.data?.qualification && (
                <div className="flex items-center gap-2">
                  <FaGraduationCap className="text-primary" />
                  <span className="font-semibold">Qualification:</span>
                  <span>{data?.data?.qualification}</span>
                </div>
              )}

              {(data?.data?.yearOfExp || data?.data?.monthOfExp) && (
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-primary" />
                  <span className="font-semibold">Experience:</span>
                  <span>
                    {data?.data?.yearOfExp ?? 0} Year{" "}
                    {data?.data?.monthOfExp ?? 0} Month
                  </span>
                </div>
              )}

              {!!data?.data?.jobType?.length && (
                <div className="flex items-center gap-2">
                  <MdWork className="text-primary" />
                  <span className="font-semibold">Job Type:</span>
                  <span>
                    {data?.data?.jobType.map((item) => item).join(", ")}
                  </span>
                </div>
              )}

              {data?.data?.expertise && (
                <div className="flex items-center gap-2">
                  <FaSuitcaseRolling className="text-primary" />
                  <span className="font-semibold">Expertise:</span>
                  <span>{data?.data?.expertise}</span>
                </div>
              )}

              {!!data?.data?.languages?.length && (
                <div className="flex items-start gap-2 sm:col-span-2">
                  <FaLanguage className="text-primary mt-1" />
                  <span className="font-semibold">Languages:</span>
                  <span>
                    {data?.data?.languages.map((item) => item).join(", ")}
                  </span>
                </div>
              )}

              {!!data?.data?.workingShift?.length && (
                <div className="flex items-center gap-2">
                  <MdSwapHoriz className="text-primary" />
                  <span className="font-semibold">Work Shift:</span>
                  <span>
                    {data?.data?.workingShift.map((item) => item).join(", ")}{" "}
                    Shift
                  </span>
                </div>
              )}

              {typeof data?.data?.relocate === "number" && (
                <div className="flex items-center gap-2">
                  <MdLocationPin className="text-primary" />
                  <span className="font-semibold">Relocate:</span>
                  <span>{data?.data?.relocate === 1 ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
