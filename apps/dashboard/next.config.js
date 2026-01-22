/** @type {import('next').NextConfig} */

const nextConfig = {
    turbopack: {
    root: "../../",
  },
  output: "standalone",
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
  crossOrigin: "anonymous",
};

export default nextConfig;
