import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "English Lab — AI Tutor & Studio Voice",
    short_name: "English Lab",
    description: "Tutor particular de inglês de alto padrão com conversação imersiva por voz e repetição espaçada.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#09090e",
    theme_color: "#f59e0b",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
