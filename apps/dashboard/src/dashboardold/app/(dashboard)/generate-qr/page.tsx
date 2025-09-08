"use client";
import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import qrBackground from "@/assets/pizzle-qr-background.jpg";
import companyLogo from "@/assets/logo.webp";
import { Rock_Salt } from "next/font/google";
import { cn } from "@/lib/utils";

const rock_salt = Rock_Salt({ weight: "400" });

export default function Page() {
  const [url, setUrl] = useState("http://localhost:1000");
  const newUrl = new URL(url);
  const parts = newUrl.pathname.split("/");
  if (parts[parts.length - 1] === "generate-qr") {
    parts.pop();
    parts.push("menu-card");
  }
  newUrl.pathname = parts.join("/") || "/";

  useEffect(() => {
    setUrl(window.location.href); // full URL
  }, []);
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({ contentRef: qrRef });
  return (
    <div className="flex justify-center items-center flex-1 p-2 sm:p-4 flex-col">
      <div className="border-2 z-20 w-[210mm] relative ">
        <QrUI newUrl={newUrl.toString()} />
      </div>

      <div className="hidden">
        <div ref={qrRef}>
          <div className="border-2 z-20 w-[210mm] h-[297mm] relative ">
            <QrUI newUrl={newUrl.toString()} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePrint}
        className="px-4 py-2 mt-10 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Print QR Code
      </button>
    </div>
  );
}

const QrUI = ({ newUrl }: { newUrl: string }) => {
  return (
    <div className="h-[200mm] relative">
      <Image
        src={qrBackground}
        className="-z-10"
        alt="Hero"
        fill // fills the parent container
        style={{ objectFit: "cover" }}
      />
      <div className="w-[100mm] bg-[#0005] flex flex-col h-full relative">
        <div className="flex justify-center w-full mt-14">
          <Image
            src={companyLogo}
            alt="Hero"
            style={{ height: "50mm", objectFit: "contain" }}
          />
        </div>

        <div className="flex justify-center text-2xl w-full mt-10 text-white">
          Pizzas's & More
        </div>
        <div className="mt-auto relative">
          <div className="absolute bg-white p-4 left-1/2 translate-[-50%]">
            <QRCode value={newUrl.toString()} level="Q" size={170} />
          </div>
        </div>
        <div className="bg-red-600 text-white flex flex-col justify-end items-center w-full h-[70mm]">
          <div className="">{newUrl.toString()}</div>
          <div className={cn("text-2xl my-2 ", rock_salt.className)}>
            Scan, order
          </div>
          <div className={cn("text-5xl mb-10", rock_salt.className)}>enjoy</div>
        </div>
      </div>
    </div>
  );
};
