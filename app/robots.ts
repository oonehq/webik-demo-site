import type { MetadataRoute } from "next";
import { seo } from "../content/seo";
import { siteOrigin } from "../lib/seo";

/** robots.txt: everything may be indexed. The sitemap is linked only when the website address is known. */
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin(seo);
  return { rules: { userAgent: "*", allow: "/" }, ...(origin ? { sitemap: new URL("/sitemap.xml", origin).href } : {}) };
}
