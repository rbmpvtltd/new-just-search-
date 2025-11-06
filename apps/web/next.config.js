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
