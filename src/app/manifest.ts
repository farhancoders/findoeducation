import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Faith Edu",
    description: "Trusted education and migration agent in Sydney.",
    start_url: "/",
    display: "standalone",
    background_color: "#8b3822",
    theme_color: "#8b3822",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
