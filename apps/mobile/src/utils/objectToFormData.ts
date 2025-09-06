export const objectToFormData = (finalData: object) => {
  const formData = new FormData();

  Object.entries(finalData).forEach(([key, value]) => {
    // Valid file from device (ImagePicker)
    if (
      typeof value === "string" &&
      value.startsWith("file://") &&
      (value.endsWith(".jpeg") ||
        value.endsWith(".jpg") ||
        value.endsWith(".png") ||
        value.endsWith(".pdf"))
    ) {
      const fileName = value.split("/").pop() ?? `${key}.jpg`;
      const ext = fileName.split(".").pop() ?? "jpg";

      let type = "image/jpeg";
      if (ext === "png") type = "image/png";
      else if (ext === "pdf") type = "application/pdf";

      formData.append(key, {
        uri: value,
        name: fileName,
        type,
      } as unknown as Blob);
    }

    //Skip remote or invalid image URLs
    else if (
      typeof value === "string" &&
      (value.startsWith("http://") || value.startsWith("https://"))
    ) {
      // console.log(`Skipping remote URL: ${key} => ${value}`);
      return;
    }

    // Arrays (e.g., subcategory_id[][])
    else if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    }

    // Normal fields
    else {
      formData.append(key, value ?? "");
      // console.log('Appending key:', key, 'Value:', value);
    }
  });

  return formData;
};
