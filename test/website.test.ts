import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { jsonLdLinks, shareImagePath, siteMetadata, siteOrigin } from "../lib/seo";
import { businessJsonLd } from "../lib/business";
import { imageInfo } from "../lib/share-image-size";

/**
 * Golden data shared with the Webik harness (tests/share-previews.test.ts in oonehq/webik). The harness
 * builds its fallback share preview from content/seo.ts by the same rules; when lib/seo.ts changes
 * these values, update both copies.
 */
const golden = {
  seo: { siteUrl: "https://nerdpottery.cz", title: "Nerd Pottery", description: "Popis", shareImage: { url: "/uploads/a.jpg", alt: "Hrnek" } },
  imageInfo: { width: 1600, height: 900, type: "image/jpeg" },
  ogImage: { url: "/uploads/a.jpg", alt: "Hrnek", width: 1600, height: 900, type: "image/jpeg" },
  twitterCard: "summary_large_image",
  bareTwitterCard: "summary",
};

const business = { name: "Nerd Pottery" } as Parameters<typeof siteMetadata>[0];

test("siteMetadata sends what the Webik harness expects (golden data)", () => {
  const website = siteMetadata(business, golden.seo, golden.imageInfo);
  assert.deepEqual((website.openGraph!.images as Record<string, unknown>[])[0], golden.ogImage);
  assert.equal((website.twitter as { card: string }).card, golden.twitterCard);
  assert.equal((siteMetadata(business, { title: "A", description: "B" }).twitter as { card: string }).card, golden.bareTwitterCard);
});

test("the website states the real size and type of a custom share image, and nothing when unknown", () => {
  const seo = { siteUrl: "https://nerdpottery.cz", title: "A", description: "B", shareImage: { url: "/uploads/a.png", alt: "Hrnek" } };
  const image = (info?: { width: number; height: number; type: string }) => (siteMetadata(business, seo, info).openGraph!.images as Record<string, unknown>[])[0];
  assert.deepEqual(image({ width: 800, height: 600, type: "image/png" }), { url: "/uploads/a.png", alt: "Hrnek", width: 800, height: 600, type: "image/png" });
  assert.deepEqual(image(), { url: "/uploads/a.png", alt: "Hrnek" });
  const generated = (siteMetadata(business, { ...seo, shareImage: undefined }, { width: 1, height: 1, type: "x" }).openGraph!.images as Record<string, unknown>[])[0];
  assert.deepEqual(generated, { url: "/share-image.png", alt: "Nerd Pottery", width: 1200, height: 630, type: "image/png" });
});

test("imageInfo reads the size of PNG, JPEG and WebP headers", () => {
  const png = new Uint8Array(24); png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); new DataView(png.buffer).setUint32(16, 1200); new DataView(png.buffer).setUint32(20, 630);
  assert.deepEqual(imageInfo(png), { type: "image/png", width: 1200, height: 630 });
  const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x02, 0x76, 0x04, 0xb0, 0x03, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(imageInfo(jpeg), { type: "image/jpeg", width: 1200, height: 630 });
  const webp = new Uint8Array(30); webp.set([..."RIFF"].map(c => c.charCodeAt(0)), 0); webp.set([..."WEBPVP8X"].map(c => c.charCodeAt(0)), 8); webp.set([0xaf, 0x04, 0x00, 0x75, 0x02, 0x00], 24);
  assert.deepEqual(imageInfo(webp), { type: "image/webp", width: 1200, height: 630 });
  assert.equal(imageInfo(Uint8Array.from([1, 2, 3])), undefined);
});

const goodTitle = "Nerd Pottery – keramické hrnečky inspirované Pánem prstenů";
const goodDescription = "Keramická dílna Nerd Pottery tvoří hrnečky inspirované Pánem prstenů. Malý kousek Středozemě pro ranní čaj, knihu i filmový večer u vás doma.";

test("the website address is used only as a plain origin, never guessed (same rule as the Webik editor)", () => {
  const origin = (url: string | undefined) => siteOrigin({ title: "", description: "", siteUrl: url })?.origin;
  assert.equal(origin("https://nerdpottery.cz"), "https://nerdpottery.cz");
  assert.equal(origin("https://www.nerdpottery.cz/"), "https://www.nerdpottery.cz");
  for (const bad of [undefined, "", "nerdpottery.cz", "ftp://nerdpottery.cz", "https://nerdpottery.cz/eshop", "https://a:b@nerdpottery.cz", "https://nerdpottery.cz/?a=1", "javascript:alert(1)"]) assert.equal(origin(bad), undefined, String(bad));
});

test("the website builds metadata from content/seo.ts and sets absolute links only with a known address", () => {
  const business = { name: "Nerd Pottery", kind: "keramická dílna", description: "keramická dílna", team: [] };
  const without = siteMetadata(business, { title: goodTitle, description: goodDescription });
  assert.equal(without.metadataBase, undefined); assert.equal(without.alternates, undefined);
  assert.deepEqual(without.title, { default: goodTitle, template: "%s | Nerd Pottery" });
  assert.equal(without.description, goodDescription);
  assert.equal((without.openGraph as { images?: unknown }).images, undefined);
  assert.equal((without.twitter as { card?: string }).card, "summary");
  assert.deepEqual(jsonLdLinks({ title: "", description: "" }), {});
  const withAddress = siteMetadata(business, { siteUrl: "https://nerdpottery.cz", title: goodTitle, description: goodDescription });
  assert.equal(String(withAddress.metadataBase), "https://nerdpottery.cz/");
  assert.deepEqual(withAddress.alternates, { canonical: "/" });
  assert.deepEqual((withAddress.openGraph as { images?: unknown }).images, [{ url: "/share-image.png", alt: "Nerd Pottery", width: 1200, height: 630, type: "image/png" }]);
  assert.equal((withAddress.twitter as { card?: string }).card, "summary_large_image");
  const custom = { siteUrl: "https://nerdpottery.cz", title: goodTitle, description: goodDescription, shareImage: { url: "/uploads/a.jpg", alt: "Hrnek" } };
  assert.deepEqual((siteMetadata(business, custom).openGraph as { images?: unknown }).images, [{ url: "/uploads/a.jpg", alt: "Hrnek" }]);
  assert.equal(shareImagePath({ ...custom, shareImage: { url: "https://cdn.example/a.jpg", alt: "" } }), "/share-image.png");
  // JSON-LD gets the same address and image, and nothing without the address.
  assert.deepEqual(businessJsonLd(business, jsonLdLinks(custom)), { ...businessJsonLd(business), url: "https://nerdpottery.cz/", image: "https://nerdpottery.cz/uploads/a.jpg" });
  assert.equal("url" in businessJsonLd(business), false);
});

test("content files stay plain data without an invented domain, and AGENTS.md keeps the search rules", () => {
  const seo = readFileSync(new URL("../content/seo.ts", import.meta.url), "utf8");
  assert.doesNotMatch(seo, /siteUrl:/, "the demo must not invent a domain");
  const agents = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8");
  assert.match(agents, /content\/seo\.ts/); assert.match(agents, /Never invent or guess a domain/);
});
