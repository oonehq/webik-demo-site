import type { Metadata } from "next";
import type { Business } from "./business";

/**
 * Shape of content/seo.ts and the helpers that turn it into Next.js metadata, robots.txt and the
 * sitemap. The values themselves live only in content/seo.ts; this file holds none.
 */
export type ShareImage = {
  /** A file of this website, e.g. "/uploads/hrnek.jpg" (public/uploads/hrnek.jpg). PNG, JPEG or WebP, ideally 1200×630 px. */
  url: string;
  /** What the image shows, in Czech. */
  alt: string;
};
export type Seo = {
  /** Public address of the website, only scheme and host, e.g. "https://www.example.cz". Leave it out until the owner gives it. */
  siteUrl?: string;
  /** Page title in search results and the browser tab, about 50–60 characters. */
  title: string;
  /** Description in search results and when the page is shared, about 120–160 characters. */
  description: string;
  /** Image shown when the website is shared on social networks. Without it a generated image with the business name is used. */
  shareImage?: ShareImage;
};

/** The generated share image (app/share-image.png/route.tsx), used when content/seo.ts has none. */
export const generatedShareImage = { url: "/share-image.png", width: 1200, height: 630, type: "image/png" };

/** Real size and type of a share image file, read by lib/share-image-size.ts. */
export type ImageInfo = { width: number; height: number; type: string };

/** A plain path of a file in public/ ("/uploads/a.jpg"), or null for anything else. */
export function publicPath(url: string) {
  if (!url.startsWith("/") || url.startsWith("//") || url.includes("\\") || /[?#]/.test(url)) return null;
  return url.slice(1).split("/").some(segment => !segment || segment === "." || segment === "..") ? null : url;
}

/** The website's public origin, or undefined when it is missing or not a plain http(s) address. Never guessed. */
export function siteOrigin(seo: Seo): URL | undefined {
  if (!seo.siteUrl) return undefined;
  try {
    const url = new URL(seo.siteUrl);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") return undefined;
    return new URL(url.origin);
  } catch { return undefined; }
}

/** Path of the share image on this website: the chosen file, or the generated one. */
export function shareImagePath(seo: Seo) {
  const url = seo.shareImage?.url;
  return url && url.startsWith("/") && !url.startsWith("//") ? url : generatedShareImage.url;
}

/**
 * Metadata for the root layout. Links that need an absolute URL (canonical, og:url, og:image) are
 * set only when the website address is known; without it Next.js would have to invent one.
 * `imageInfo` is the real size and type of a custom share image (lib/share-image-size.ts); it gives
 * og:image:width, og:image:height and og:image:type, and is left out when unknown.
 */
export function siteMetadata(business: Business, seo: Seo, imageInfo?: ImageInfo): Metadata {
  const origin = siteOrigin(seo);
  const custom = shareImagePath(seo) !== generatedShareImage.url;
  const info = custom ? imageInfo : generatedShareImage;
  const image = origin ? { url: shareImagePath(seo), alt: custom ? seo.shareImage!.alt : business.name, ...(info ? { width: info.width, height: info.height, type: info.type } : {}) } : undefined;
  return {
    ...(origin ? { metadataBase: origin, alternates: { canonical: "/" } } : {}),
    title: { default: seo.title, template: `%s | ${business.name}` },
    description: seo.description,
    applicationName: business.name,
    openGraph: { type: "website", locale: "cs_CZ", siteName: business.name, title: seo.title, description: seo.description, ...(origin ? { url: "/", images: [image!] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title: seo.title, description: seo.description, ...(image ? { images: [image] } : {}) },
  };
}

/** Absolute website and share image addresses for the LocalBusiness JSON-LD; empty without the website address. */
export function jsonLdLinks(seo: Seo): { url?: string; image?: string } {
  const origin = siteOrigin(seo);
  if (!origin) return {};
  const image = shareImagePath(seo);
  return { url: new URL("/", origin).href, ...(image !== generatedShareImage.url ? { image: new URL(image, origin).href } : {}) };
}

/** Pages listed in the sitemap, as paths. Add a path here when the website gets a new page. */
export const sitemapPaths = ["/"];
