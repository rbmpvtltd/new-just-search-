import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
    cloud: {
        cloudName: 'dra2pandx'
    }
});

// TODO: get this from env

export {cld}
