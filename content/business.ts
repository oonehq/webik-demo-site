import type { Business } from "../lib/business";

/**
 * Údaje o firmě: jediné místo, kde web uvádí název, kontakty, adresu, otevírací dobu,
 * pobočky, tým a sociální sítě. Stránky je odsud čtou, takže změna tady se projeví všude.
 * Popis polí je v lib/business.ts. Chybějící pole web nezobrazuje; nedoplňujte vymyšlené hodnoty.
 * Editor Webik tento soubor čte jako data: pište jen texty, čísla, pole a objekty, bez výrazů a importů hodnot.
 */
export const business: Business = {
  name: "Nerd Pottery",
  kind: "keramická dílna",
  description: "keramická dílna a hrnečky inspirované Pánem prstenů",
  team: [
    { name: "Marta Hlinková" },
  ],
};
