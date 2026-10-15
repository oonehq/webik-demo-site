"use client";
import { useEffect } from "react";
export function Inspector() {
  useEffect(() => {
    // Contain touch scrolling only in the embedded editor preview.
    const embedded = window.parent !== window;
    if (embedded) document.documentElement.classList.add("webik-embedded");
    const origins = new Set(["http://127.0.0.1:3100", "http://localhost:3100", ...(process.env.NEXT_PUBLIC_WEBIK_EDITOR_ORIGIN ? [new URL(process.env.NEXT_PUBLIC_WEBIK_EDITOR_ORIGIN).origin] : [])]);
    let enabled = false, highlighted: HTMLElement | null = null;
    let editorOrigin = "http://127.0.0.1:3100";
    function clear() { highlighted?.removeAttribute("data-webik-highlight"); highlighted = null; }
    function message(event: MessageEvent) {
      if (!origins.has(event.origin) || event.source !== window.parent) return;
      if (event.data?.type === "webik:select") { editorOrigin = event.origin; enabled = !!event.data.enabled; document.body.classList.toggle("webik-selecting", enabled); if (!enabled) clear(); }
    }
    function move(event: MouseEvent) {
      if (!enabled) return;
      const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-webik-id]");
      if (highlighted !== target) { clear(); highlighted = target; highlighted?.setAttribute("data-webik-highlight", "true"); }
    }
    function click(event: MouseEvent) {
      if (!enabled) return;
      event.preventDefault(); event.stopPropagation();
      const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-webik-id]");
      if (target) window.parent.postMessage({ type: "webik:selected", selection: `${target.tagName.toLowerCase()} [data-webik-id="${target.dataset.webikId}"]: ${target.innerText.slice(0, 500)}` }, editorOrigin);
      enabled = false; clear(); document.body.classList.remove("webik-selecting");
    }
    window.addEventListener("message", message); document.addEventListener("mousemove", move); document.addEventListener("click", click, true);
    for (const origin of origins) window.parent.postMessage({ type: "webik:ready" }, origin);
    return () => { if (embedded) document.documentElement.classList.remove("webik-embedded"); clear(); window.removeEventListener("message", message); document.removeEventListener("mousemove", move); document.removeEventListener("click", click, true); };
  }, []);
  return null;
}
