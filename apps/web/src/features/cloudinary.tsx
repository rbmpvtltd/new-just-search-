"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
export default function Cloudinary() {
  const [resource, setResource] = useState();
  console.log(resource);
  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="http://localhost:4000/v1/api/sign-image"
        // uploadPreset="test01"
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
