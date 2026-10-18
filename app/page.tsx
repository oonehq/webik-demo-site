import { ArrowDown, ArrowUpRight } from "lucide-react";
import { business } from "../content/business";
import { businessJsonLd, jsonLdScript, upper } from "../lib/business";
import { ContactDetails, FooterContact } from "../components/business-details";
import { seo } from "../content/seo";
import { jsonLdLinks } from "../lib/seo";

export default function Home() {
  const [owner] = business.team;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(businessJsonLd(business, jsonLdLinks(seo))) }} />
    <header className="site-header" data-webik-id="navigation">
      <a className="logo" href="#">{business.name}<span>{upper(business.kind)}</span></a>
      <nav aria-label="Hlavní navigace"><a href="#projekty">Naše hrnky</a><a href="#studio">O dílně</a><a className="contact-link" href="#kontakt">Pro milovníky příběhů <ArrowUpRight size={13} /></a></nav>
    </header>
    <main>
      <section className="hero">
        <div className="hero-background" aria-hidden="true" data-webik-id="hero-background" />
        <div className="hero-copy">
          <span className="kicker" data-webik-id="hero-eyebrow"><i /> KERAMIKA S KUSKEM FANTAZIE</span>
          <h1 data-webik-id="hero-title">Velké příběhy.<br />Váš oblíbený <em>hrnek.</em></h1>
          <p data-webik-id="hero-description">Jsme {business.name}, {business.kind} pro milovníky fantasy.<br />Prodáváme hrnečky inspirované Pánem prstenů.<br />Pro chvíle, kdy dobrodružství začíná douškem čaje.</p>
          <a className="primary-button" href="#projekty" data-webik-id="hero-button">Objevte naše zaměření <ArrowUpRight size={17} /></a>
          <div className="hero-footnote"><span>HLÍNA · FANTAZIE · KAŽDODENNÍ RITUÁLY</span><ArrowDown size={17} /></div>
        </div>
        <div className="hero-image pottery-manifesto" data-webik-id="hero-image">
          <span className="image-index">{upper(business.name)} / KERAMIKA</span>
          <div className="manifesto-text"><span>PRO MALÉ CHVÍLE</span><p>Kousek<br /><em>Středozemě</em><br />u vás doma.</p><span>A VELKOU FANTAZII</span></div>
          <div className="image-caption"><span>NAŠE SOUČASNÉ ZAMĚŘENÍ</span><strong>Hrnečky pro fanoušky</strong><small>Inspirováno světem Pána prstenů</small></div>
        </div>
      </section>
      <section className="intro" id="studio" data-webik-id="studio-intro">
        <span className="section-label">VÍTEJTE V {upper(business.name)}</span>
        <div><h2>Když se potká hlína<br /><em>s láskou k příběhům.</em></h2><p>Keramika a fantasy k sobě mají blíž, než se zdá. Obojí proměňuje obyčejné chvíle v něco osobního. V naší dílně je spojuje hrnek — malý společník ke čtení, snění i dalšímu filmovému večeru.</p></div>
        <div className="studio-note"><span className="section-label">NAŠE SRDEČNÍ ZÁLEŽITOST</span><p>Svět Pána prstenů.<br />A místo pro váš oblíbený nápoj.</p></div>
      </section>
      <section className="intro" id="majitelka" aria-labelledby="owner-title" data-webik-id="owner-section">
        <span className="section-label">{upper(owner.name)}</span>
        <div><h2 id="owner-title" data-webik-id="owner-title">Z hrnčířského kruhu<br /><em>až k vám domů.</em></h2><p data-webik-id="owner-description">{owner.name} točí hrnky na kruhu a každý glazuje ručně. Ve volných chvílích čte fantasy a z knih si odnáší nápady na nové tvary i barvy. V {business.name} z toho vznikají keramické hrnečky inspirované Pánem prstenů.</p></div>
      </section>
      <section className="projects" id="projekty">
        <div className="section-heading"><span className="section-label">HRNEČKY INSPIROVANÉ PÁNEM PRSTENŮ</span><h2>Pro dobrodružství mezi doušky.</h2></div>
        <div className="project-grid story-grid">
          <article data-webik-id="project-house"><span className="section-label">01 / NAŠE TVORBA</span><h3>Fantasy, kterou vezmete do ruky.</h3><p>Naším současným zaměřením jsou keramické hrnky inspirované Pánem prstenů. Kousek oblíbeného světa pro každodenní chvíle.</p></article>
          <article data-webik-id="project-interior"><span className="section-label">02 / VÁŠ MALÝ RITUÁL</span><h3>Čaj. Kniha. Ještě jedna kapitola.</h3><p>Ráno před cestou i večer po dlouhém dni. Hrneček pro ty, kteří se rádi vracejí do příběhů Středozemě.</p></article>
        </div>
      </section>
      <section id="kontakt" className="contact" data-webik-id="contact"><span className="section-label">{upper(business.name)} · {upper(business.kind)}</span><h2>Každý den může mít<br /><em>trochu fantazie.</em></h2><p className="closing-copy">Tady začíná příběh našich hrnků. Zatím si prohlížíte prezentaci dílny; objednávky přes tento web nepřijímáme.</p><ContactDetails business={business} /><p>Ukázková prezentace pro Webik. Obsah slouží jako demo.</p></section>
    </main>
    <footer>{business.name}<span>Keramika pro milovníky příběhů.</span><FooterContact business={business} /><small>© 2026 {business.name} · Demo</small></footer>
  </>;
}
