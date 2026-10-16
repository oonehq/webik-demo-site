/**
 * Shape of the business facts in content/business.ts and helpers that turn them into text.
 * The facts themselves live only in content/business.ts; this file holds no values.
 *
 * Optional fields that are missing are simply not shown on the website. Add one only with
 * a value the website owner gave; never fill it with a placeholder or an example.
 */
export type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
/** 24-hour time "HH:MM", e.g. a range { from: "09:00", to: "17:30" }. */
export type TimeRange = { from: string; to: string };
export type OpeningHours = {
  /** Every day must be listed. An empty list means closed that day; two ranges mean a lunch break. */
  weekly: Record<Day, TimeRange[]>;
  /** Holidays and one-off changes. `date` and optional `until` are "YYYY-MM-DD"; empty `hours` means closed. */
  exceptions?: { date: string; until?: string; hours: TimeRange[]; note?: string }[];
  /** Short note shown under the hours, in Czech. */
  note?: string;
};
export type Address = { street: string; city: string; postalCode: string; country?: string };
export type Branch = { name: string; address: Address; phone?: string; email?: string; openingHours?: OpeningHours };
export type TeamMember = { name: string; role?: string };
export type SocialLink = { label: string; url: string };
export type Business = {
  /** Brand name as written in text. Labels in capitals are derived from it. */
  name: string;
  /** What the business is, lower case, e.g. "keramická dílna". */
  kind: string;
  /** Short description of what the business does, without the name, e.g. "keramická dílna a …". Used in structured data; the text for search results is in content/seo.ts. */
  description: string;
  /** International format with spaces, as it should be displayed. */
  phone?: string;
  email?: string;
  address?: Address;
  openingHours?: OpeningHours;
  branches?: Branch[];
  team: TeamMember[];
  social?: SocialLink[];
};

export const days: Day[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const shortDay: Record<Day, string> = { monday: "Po", tuesday: "Út", wednesday: "St", thursday: "Čt", friday: "Pá", saturday: "So", sunday: "Ne" };
const schemaDay: Record<Day, string> = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };

/** Labels in capitals ("KERAMICKÁ DÍLNA") come from the same fact as the normal text. */
export const upper = (text: string) => text.toLocaleUpperCase("cs-CZ");
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const formatAddress = (address: Address) => [address.street, `${address.postalCode} ${address.city}`, address.country].filter(Boolean).join(", ");

const time = (value: string) => value.replace(/^0(\d)/, "$1");
export const formatRanges = (ranges: TimeRange[]) => ranges.length ? ranges.map(range => `${time(range.from)}–${time(range.to)}`).join(", ") : "zavřeno";

/** Consecutive days with the same hours are grouped: "Po–Pá 9:00–17:00", "So 9:00–12:00", "Ne zavřeno". */
export function openingHoursRows(hours: OpeningHours) {
  const rows: { days: string; hours: string }[] = [];
  let start = 0;
  for (let index = 1; index <= days.length; index++) {
    const same = index < days.length && formatRanges(hours.weekly[days[index]]) === formatRanges(hours.weekly[days[start]]);
    if (same) continue;
    const first = shortDay[days[start]], last = shortDay[days[index - 1]];
    rows.push({ days: start === index - 1 ? first : `${first}–${last}`, hours: formatRanges(hours.weekly[days[start]]) });
    start = index;
  }
  return rows;
}

const formatDate = (value: string) => { const [year, month, day] = value.split("-").map(Number); return `${day}. ${month}. ${year}`; };
export function exceptionRows(hours: OpeningHours) {
  return (hours.exceptions || []).map(item => ({ date: item.until ? `${formatDate(item.date)} – ${formatDate(item.until)}` : formatDate(item.date), note: item.note, hours: formatRanges(item.hours) }));
}

const schemaHours = (hours: OpeningHours) => days.flatMap(day => hours.weekly[day].map(range => ({ "@type": "OpeningHoursSpecification", dayOfWeek: schemaDay[day], opens: range.from, closes: range.to })));
const schemaAddress = (address: Address) => ({ "@type": "PostalAddress", streetAddress: address.street, addressLocality: address.city, postalCode: address.postalCode, ...(address.country ? { addressCountry: address.country } : {}) });

/**
 * schema.org structured data from the same facts; fields that are missing stay out.
 * `links` are absolute addresses from content/seo.ts (see lib/seo.ts), present only when the website address is known.
 */
export function businessJsonLd(business: Business, links: { url?: string; image?: string } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: `${business.name} — ${business.description}.`,
    ...(links.url ? { url: links.url } : {}),
    ...(links.image ? { image: links.image } : {}),
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.email ? { email: business.email } : {}),
    ...(business.address ? { address: schemaAddress(business.address) } : {}),
    ...(business.openingHours ? { openingHoursSpecification: schemaHours(business.openingHours) } : {}),
    ...(business.social?.length ? { sameAs: business.social.map(link => link.url) } : {}),
    ...(business.team.length ? { employee: business.team.map(member => ({ "@type": "Person", name: member.name, ...(member.role ? { jobTitle: member.role } : {}) })) } : {}),
    ...(business.branches?.length ? { department: business.branches.map(branch => ({ "@type": "LocalBusiness", name: branch.name, address: schemaAddress(branch.address), ...(branch.phone ? { telephone: branch.phone } : {}), ...(branch.email ? { email: branch.email } : {}) })) } : {}),
  };
}

/** For a <script type="application/ld+json">: "<" is escaped so a value cannot close the tag. */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
