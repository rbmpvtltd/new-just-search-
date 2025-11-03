/** @type {import('next').NextConfig} */

import dotenv from "dotenv";


if (process.env.NODE_ENV !== "production") {
  dotenv.config({
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
    ],
  },
};

export default nextConfig;
