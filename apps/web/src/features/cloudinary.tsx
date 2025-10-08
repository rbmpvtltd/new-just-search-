"use client";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    cloudinary: any; // You can use a more specific type if you know it
  }
}


export default function Cloudinary() {
  const [resource, setResource] = useState<any>();


  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.cloudinarySign.uploadImage.mutationOptions(),
  );


  const handleUpload = async () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dra2pandx",
        apiKey: "322325555249722",
        uploadSignature: (
          callback: (result: { signature: string }) => void,
          paramsToSign: {timestamp: number, source: string},
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
          setResource(result.info); 
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

/*
      <CldUploadWidget
        signatureEndpoint="http://localhost:4000/v1/api/sign-image"
        options={{
          prepareUploadParams: (cb, params) => {
            // Add your token to the signature request
            const token = getToken();

            // Make a custom fetch request to your signature endpoint with headers
            fetch("http://localhost:4000/v1/api/sign-image", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                // Add any other headers you need
              },
              body: JSON.stringify(params),
            })
              .then((res) => res.json())
              .then((data) => {
                cb(data);
              })
              .catch((err) => {
                console.error("Error fetching signature:", err);
              });
          },
        }}
        onSuccess={(result, { widget }) => {
          setResource(result?.info);
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return (
            <button type="button" onClick={handleOnClick}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
*/
