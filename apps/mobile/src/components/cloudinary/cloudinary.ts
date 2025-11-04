import { trpcClient } from "@/lib/trpc";
import { asyncHandler } from "@/utils/asyncHandler";

export const uploadToCloudinary = async (
  files: (string | null | undefined)[],
  folder: string = "unknown",
  tags: string = "",
  eager: string = "c_pad,h_300,w_400|c_crop,h_200,w_260",
): Promise<(string | null)[]> => {
  const signResponse = await asyncHandler(
    trpcClient.cloudinarySignature.signUploadForm.query({
      eager,
      folder,
      tags,
    }),
  );

  const uploadPromises: Promise<string | null>[] = [];

  for (let i = 0; i < files.length; i++) {
    const fileUrl = files[i];
    if (!fileUrl) {
      uploadPromises.push(Promise.resolve(null));
      continue;
    }

    if (signResponse.error || !signResponse.data) {
      uploadPromises.push(Promise.resolve(fileUrl));
      continue;
    }
    const url = `https://api.cloudinary.com/v1_1/${signResponse.data.cloudname}/auto/upload`;

    const fileName = fileUrl.split("/").pop();
    const ext = fileName?.split(".").pop() ?? "jpg";
    let type = "image/jpeg";
    if (ext === "png") type = "image/png";
    else if (ext === "pdf") type = "application/pdf";

    const formData = new FormData();

    formData.append("file", {
      uri: fileUrl,
      type: type,
      name: fileName,
      filename: fileName,
    } as any);
    formData.append("api_key", signResponse.data.apikey);
    formData.append("timestamp", signResponse.data.timestamp.toString());
    formData.append("signature", signResponse.data.signature);
    formData.append("eager", eager);
    formData.append("folder", folder);
    formData.append("tags", signResponse.data.tags);

    const uploadPromise = fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data on cloudinary", data);
        if (data.public_id) {
          return data.public_id;
        } else {
          throw new Error(`Upload failed: ${JSON.stringify(data)}`);
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);
        throw error;
      });

    uploadPromises.push(uploadPromise);
  }

  try {
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error("One or more uploads failed:", error);
    return []; // Return empty array or handle as needed
  }
};
