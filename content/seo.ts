import type { Seo } from "../lib/seo";

/**
 * Vyhledávače a sdílení: titulek a popis, které ukáže Google, adresa webu a obrázek při sdílení
 * na sociálních sítích. Metadata, robots.txt, mapa webu i strukturovaná data je čtou odsud.
 * Popis polí je v lib/seo.ts. Adresu webu (siteUrl) uveďte až ve chvíli, kdy ji majitel zná;
 * do té doby web odkaz pro vyhledávače, mapu webu ani obrázek pro sdílení neuvádí.
 * Editor Webik tento soubor čte jako data: pište jen texty, pole a objekty, bez výrazů a importů hodnot.
 */
export const seo: Seo = {
  title: "Nerd Pottery",
  description: "Nerd Pottery — keramická dílna a hrnečky inspirované Pánem prstenů. Ukázková prezentace pro Webik.",
};
