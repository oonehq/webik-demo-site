import type { Metadata } from "next";
import { WebikInspector } from "@oonehq/webik-site-kit";
import { business } from "../content/business";
import { seo } from "../content/seo";
import { siteMetadata } from "../lib/seo";
import { readImageInfo } from "../lib/share-image-size";
import "./globals.css";
// Title, description, share image and the website address come from content/seo.ts; the size of a
// custom share image is read from its file so og:image:width/height match it.
export const metadata: Metadata = siteMetadata(business, seo, seo.shareImage ? readImageInfo(seo.shareImage.url) : undefined);
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="cs"><body>{children}<WebikInspector /></body></html>; }
