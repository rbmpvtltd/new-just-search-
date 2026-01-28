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
      {
        protocol: "http",
        hostname: "192.168.1.64",
        port: "5000",
        pathname: "/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
