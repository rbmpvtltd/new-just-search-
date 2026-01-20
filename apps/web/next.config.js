/** @type {import('next').NextConfig} */

const nextConfig = {
  turbopack: {
    root: "../../",
  },
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
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
