import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dldbua947",
  },
});

// TODO: get this from env

export { cld };
