import { ImageResponse } from "next/og";
import { business } from "../../content/business";
import { upper } from "../../lib/business";
import { generatedShareImage } from "../../lib/seo";

// Generated share image with the business name only: no photo, nothing that is not in content/business.ts.
// content/seo.ts can point to a real image instead (shareImage).
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#344d3e", color: "#f7f7f0" }}>
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#c4cbb6" }}>{upper(business.kind)}</div>
      <div style={{ display: "flex", fontSize: 120, lineHeight: 1.05, letterSpacing: -3 }}>{business.name}</div>
      <div style={{ display: "flex", width: 120, height: 6, background: "#d6c69d" }} />
    </div>,
    { width: generatedShareImage.width, height: generatedShareImage.height },
  );
}
