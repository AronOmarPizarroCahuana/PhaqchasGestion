import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['127.0.0.1'], // Permite imágenes desde el servidor local
  },
};

export default nextConfig;
