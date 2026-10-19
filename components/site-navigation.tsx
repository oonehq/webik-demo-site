"use client";

import { useState } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const links = <>
    <a href="#projekty" data-webik-id="navigation-cups" onClick={() => setOpen(false)}>Naše hrnky</a>
    <a href="#majitelka" data-webik-id="navigation-about" onClick={() => setOpen(false)}>O dílně</a>
    <a className="contact-link" href="#kontakt" data-webik-id="navigation-contact" onClick={() => setOpen(false)}>Pro milovníky příběhů <ArrowUpRight size={18} aria-hidden="true" /></a>
  </>;

  return <>
    <nav className="desktop-navigation" aria-label="Hlavní navigace" data-webik-id="desktop-navigation">{links}</nav>
    <Collapsible.Root className="mobile-navigation" open={open} onOpenChange={setOpen} data-webik-id="mobile-navigation">
      <Collapsible.Trigger className="navigation-toggle" data-webik-id="navigation-toggle">
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />} Menu
      </Collapsible.Trigger>
      <Collapsible.Panel className="navigation-panel" data-webik-id="navigation-panel">
        <nav aria-label="Mobilní navigace" data-webik-id="mobile-navigation-links">
          <a href="#projekty" data-webik-id="mobile-navigation-cups" onClick={() => setOpen(false)}>Naše hrnky</a>
          <a href="#majitelka" data-webik-id="mobile-navigation-about" onClick={() => setOpen(false)}>O dílně</a>
          <a className="contact-link" href="#kontakt" data-webik-id="mobile-navigation-contact" onClick={() => setOpen(false)}>Pro milovníky příběhů <ArrowUpRight size={18} aria-hidden="true" /></a>
        </nav>
      </Collapsible.Panel>
    </Collapsible.Root>
  </>;
}
