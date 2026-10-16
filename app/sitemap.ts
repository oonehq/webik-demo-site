import type { MetadataRoute } from "next";
import { seo } from "../content/seo";
import { siteOrigin, sitemapPaths } from "../lib/seo";

/**
 * Sitemap with absolute page addresses. Without the website address in content/seo.ts it stays empty,
 * because the addresses would have to be invented; robots.txt then does not link it either.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin(seo);
  return origin ? sitemapPaths.map(path => ({ url: new URL(path, origin).href })) : [];
}
