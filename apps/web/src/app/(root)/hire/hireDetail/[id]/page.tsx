"use client"
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { FaPhoneAlt, FaWhatsappSquare } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";

function page() {
  const trpc = useTRPC()
 const {id} = useParams<{ id:string }>()
  const { data } = useQuery(
    trpc.hirerouter.singleHire.queryOptions({ hireId: Number(id) }),
  );
  console.log("paramss",id)

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

  // console.log(data);
  return (
    <div className="px-4 w-[90%] mx-auto">
      <div className="flex gap-6 flex-col md:flex-row items-center">
        <div className="md:mx-0 mx-auto">
          {/* <Image
            src="https://www.justsearch.net.in/assets/images/215013691738759602.jpg"
            alt="hire img"
          /> */}
          <CldImage
            width="400"
            height="600"
            className="w-full h-full object-cover"
            src={data?.data?.photo ?? ""}
            alt="Business image"
          />
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex gap-8 font-semibold">
            <h1 className="line-clamp-1">{data?.data?.name}</h1>
            <h3 className="line-clamp-1">
              {data?.data?.gender}, AGE {calculateAge(data?.data?.dob ?? "")}
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default">{data?.data?.category}</Badge>
            {data?.data?.subcategories?.map((item, i) => (
              <Badge key={i.toString()} variant="destructive">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex items-center">
            <MdLocationPin />
            <p className="line-clamp-1">
              {data?.data?.address} {data?.data?.streetName},{" "}
              {data?.data?.buildingName} {data?.data?.city}, {data?.data?.state}
              , {data?.data?.pincode}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center-safe gap-2">
              <FaPhoneAlt />
              <p>{data?.data?.mobileNo}</p>
            </div>
            {data?.data?.wtspNumber && (
              <div className="flex items-center-safe gap-2">
                <FaWhatsappSquare />
                {data?.data?.wtspNumber}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <IoMail />
            <p>{data?.data?.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold line-clamp-1">
              Highest Qualification :
            </span>
            <p className="line-clamp-1">
              {Number(data?.data?.qualification) === 2
                ? "Graduation"
                : data?.data?.qualification}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold">Experience :</span>
            <p>
              {data?.data?.yearOfExp} Year {data?.data?.monthOfExp} Month
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold">Job Type :</span>
            <p>{data?.data?.jobType?.[0] ?? "Unknown"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold">Expertice :</span>
            <p>{data?.data?.expertise}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold line-clamp-1">Languages Know :</span>
            {data?.data?.languages && (
              <div className="flex gap-2 items-center line-clamp-1">
                {data?.data?.languages?.map((item, i) => (
                  <p key={i.toString()}>{item},</p>
                ))}
              </div>
            )}
            {!data?.data?.languages?.length && <p>N/A</p>}
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold">Work Shift :</span>
            <p>{data?.data?.workingShift?.[0] ?? "Morning"} Shift</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold">Relocate :</span>
            <p>{Number(data?.data?.relocate) === 1 ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
