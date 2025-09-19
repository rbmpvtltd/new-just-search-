"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { getToken } from "@/utils/session";
export default function Cloudinary() {
  const [resource, setResource] = useState();
  console.log(resource);
  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="http://localhost:4000/v1/api/sign-image"
        onSuccess={(result, { widget }) => {
          setResource(result?.info); // { public_id, secure_url, etc }
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
