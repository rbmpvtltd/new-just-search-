"use client";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import Image from "next/image";


export default function Cloudinary() {
  const [resource, setResource] = useState<any>();


  const trpc = useTRPC();
  const { mutate, isSuccess, isError } = useMutation(
    trpc.cloudinarySign.uploadImage.mutationOptions(),
  );


  const handleUpload = async () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dra2pandx",
        apiKey: "322325555249722",
        uploadSignature: (
          callback: (result: { signature: string }) => void,
          paramsToSign: any,
        ) => {


          mutate(
            { paramsToSign },
            {
              onSuccess: (data) => {
                callback({ signature: data.signature });
              },
              onError: (err) => {
                console.error("signature miliyoy koni", err);
              },
            },
          );
        },
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          setResource(result.info); // { public_id, secure_url, etc }
        }
      },
    );

    widget.open();
  };

  console.log(resource);
  return (
    <div className="w-full">
      <div>
        <button type="button" onClick={handleUpload}>
          Upload with Cloudinary
        </button>
        {resource && (
          <>
            <div className="w-full">
              <p className="w-[50%] break-words">Uploaded {resource?.url}</p>
            </div>
            <Image
              src={resource?.url}
              alt="uploaded image"
              width={400}
              height={400}
            />
          </>
        )}
      </div>
    </div>
  );
}
