import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sanremo Russia",
    short_name: "Sanremo",
    description: "Профессиональные кофемашины Sanremo в России",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2d483f",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
