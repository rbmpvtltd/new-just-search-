/** @type {import('next').NextConfig} */

import { config as dotenvConfig } from "dotenv";

// TODO: try to add valid env or not use in production;
if (process.env.NODE_ENV !== "production") {
  dotenvConfig({
    path: "../../.env",
  });
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.justsearch.net.in",
        port: "",
        pathname: "/assets/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dra2pandx/image/**",
      },
    ],
  },
};

export default nextConfig;
