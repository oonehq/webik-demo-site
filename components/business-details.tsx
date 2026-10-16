import { exceptionRows, formatAddress, openingHoursRows, phoneHref, upper, type Branch, type Business, type OpeningHours } from "../lib/business";

function Hours({ hours, label }: { hours: OpeningHours; label: string }) {
  const exceptions = exceptionRows(hours);
  return <div className="business-hours">
    <span className="section-label">{label}</span>
    <dl>{openingHoursRows(hours).map(row => <div key={row.days}><dt>{row.days}</dt><dd>{row.hours}</dd></div>)}</dl>
    {exceptions.length > 0 && <dl className="business-exceptions" aria-label="Změny otevírací doby">{exceptions.map(row => <div key={row.date}><dt>{row.date}{row.note ? ` (${row.note})` : ""}</dt><dd>{row.hours}</dd></div>)}</dl>}
    {hours.note && <p>{hours.note}</p>}
  </div>;
}

function BranchCard({ branch }: { branch: Branch }) {
  return <div className="business-branch">
    <span className="section-label">{upper(branch.name)}</span>
    <address>{formatAddress(branch.address)}{branch.phone && <><br /><a href={phoneHref(branch.phone)}>{branch.phone}</a></>}{branch.email && <><br /><a href={`mailto:${branch.email}`}>{branch.email}</a></>}</address>
    {branch.openingHours && <Hours hours={branch.openingHours} label="OTEVÍRACÍ DOBA" />}
  </div>;
}

/** Contact facts in the contact section. Renders nothing while the business file has none. */
export function ContactDetails({ business }: { business: Business }) {
  const { phone, email, address, openingHours, branches = [], social = [] } = business;
  if (!phone && !email && !address && !openingHours && !branches.length && !social.length) return null;
  return <div className="business-details" data-webik-id="contact-details">
    {(phone || email || address) && <address className="business-contact">
      {address && <span>{formatAddress(address)}</span>}
      {phone && <a href={phoneHref(phone)}>{phone}</a>}
      {email && <a href={`mailto:${email}`}>{email}</a>}
    </address>}
    {openingHours && <Hours hours={openingHours} label="OTEVÍRACÍ DOBA" />}
    {branches.map(branch => <BranchCard key={branch.name} branch={branch} />)}
    {social.length > 0 && <ul className="business-social" aria-label="Sociální sítě">{social.map(link => <li key={link.url}><a href={link.url} rel="noopener noreferrer" target="_blank">{link.label}</a></li>)}</ul>}
  </div>;
}

/** Phone and e-mail in the footer, when the business file has them. */
export function FooterContact({ business }: { business: Business }) {
  if (!business.phone && !business.email) return null;
  return <address className="footer-contact" data-webik-id="footer-contact">
    {business.phone && <a href={phoneHref(business.phone)}>{business.phone}</a>}
    {business.email && <a href={`mailto:${business.email}`}>{business.email}</a>}
  </address>;
}
