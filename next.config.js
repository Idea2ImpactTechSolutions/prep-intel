/** @type {import('next').NextConfig} */

// next.config.js
module.exports = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["sequelize", "sequelize-typescript"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prep-bucket-upload.s3.us-east-1.amazonaws.com",
        port: "",
        // pathname: "/account123/**",
      },
    ],
  },
};
