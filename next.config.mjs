/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Cada página carga solo su CSS; en modo suelto se juntaba el de todo el sitio en un archivo que bloquea el pintado
    cssChunking: "strict",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 75],
    // 520 = tarjeta de la cinta en móvil (260px a 2x); sin él, Next servía 640
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 520],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
