/** @type {import('next').NextConfig} */

import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: "../../.env" });
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
