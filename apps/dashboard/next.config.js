/** @type {import('next').NextConfig} */

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
