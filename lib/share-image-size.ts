import { openSync, readSync, closeSync } from "node:fs";
import path from "node:path";
import { publicPath, type ImageInfo } from "./seo";

/**
 * Size and type of a share image in public/, read from the file header when the layout is
 * rendered, so og:image:width, og:image:height and og:image:type match the real file. Facebook
 * uses the size to show the image on the first share. Unknown or unreadable files give undefined
 * and the tags are left out; nothing is guessed.
 */
export function readImageInfo(url: string, root = path.join(process.cwd(), "public")): ImageInfo | undefined {
  const relative = publicPath(url);
  if (!relative) return undefined;
  const file = path.join(/*turbopackIgnore: true*/ root, ...relative.slice(1).split("/"));
  if (!file.startsWith(root + path.sep)) return undefined;
  let handle: number | undefined;
  try {
    handle = openSync(/*turbopackIgnore: true*/ file, "r");
    const bytes = new Uint8Array(70_000);
    const read = readSync(handle, bytes, 0, bytes.length, 0);
    return imageInfo(bytes.subarray(0, read));
  } catch { return undefined; }
  finally { if (handle !== undefined) closeSync(handle); }
}

const ascii = (bytes: Uint8Array, start: number, size: number) => String.fromCharCode(...bytes.subarray(start, start + size));

/** PNG, JPEG or WebP size from the first bytes of the file. */
export function imageInfo(bytes: Uint8Array): ImageInfo | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const result = (type: string, width: number, height: number) => width > 0 && height > 0 ? { type, width, height } : undefined;
  try {
    if (bytes.length >= 24 && bytes[0] === 0x89 && ascii(bytes, 1, 3) === "PNG") return result("image/png", view.getUint32(16), view.getUint32(20));
    if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < bytes.length) {
        if (bytes[offset] !== 0xff) { offset++; continue; }
        const marker = bytes[offset + 1];
        if (marker === 0xff) { offset++; continue; }
        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) { offset += 2; continue; }
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return result("image/jpeg", view.getUint16(offset + 7), view.getUint16(offset + 5));
        offset += 2 + view.getUint16(offset + 2);
      }
      return undefined;
    }
    if (bytes.length >= 30 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") {
      const chunk = ascii(bytes, 12, 4);
      if (chunk === "VP8X") return result("image/webp", 1 + (bytes[24] | bytes[25] << 8 | bytes[26] << 16), 1 + (bytes[27] | bytes[28] << 8 | bytes[29] << 16));
      if (chunk === "VP8 ") return result("image/webp", view.getUint16(26, true) & 0x3fff, view.getUint16(28, true) & 0x3fff);
      if (chunk === "VP8L") { const bits = view.getUint32(21, true); return result("image/webp", (bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1); }
    }
  } catch { /* truncated header */ }
  return undefined;
}
