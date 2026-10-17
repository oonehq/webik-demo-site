# Nerd Pottery: ukázkový web pro Webik

Ukázkový web (fiktivní keramická dílna), který upravuje lokální editor [Webik](https://github.com/oonehq/webik).
Slouží jako výchozí web Webiku a jako šablona pro nové weby. Obsah jsou smyšlená ukázková data, ne údaje
o skutečné firmě.

Co musí web splnit, aby s ním Webik pracoval (manifest `webik.json`, `<WebikInspector />`, `withWebik()`,
`AGENTS.md`, `data-webik-id`), popisuje `docs/SITE-CONTRACT.md` v repozitáři `oonehq/webik`.

## Požadavky

- Node.js 22 nebo novější
- pnpm 10 (`corepack enable`, verzi určuje `packageManager` v `package.json`)

## Dočasně: site-kit z lokální cesty

Balíček `@oonehq/webik-site-kit` zatím není na npmjs.com. Do první publikace ho web bere z pracovní kopie
repozitáře Webik, která musí ležet vedle adresáře webů:

```
code/
├── webik/                 # oonehq/webik, kit v packages/site-kit
└── webik-sites/
    └── demo/              # tento repozitář
```

```json
"@oonehq/webik-site-kit": "file:../../webik/packages/site-kit"
```

- Kit musí být sestavený, než se web nainstaluje: v `webik` spusťte `pnpm install` a `pnpm build:kit`
  (`pnpm dev` Webiku ho sestaví sám).
- pnpm kit do webu zkopíruje (hard linky v `node_modules/.pnpm`), ne symlinkem. Po změně kitu ho ve webu
  obnovte: `pnpm install --force`.
- Proč ne `link:`: Turbopack odmítá soubory mimo kořen projektu a symlinkovaný kit by pro typy bral vlastní
  kopii `next` (ověřeno, build i typecheck s `link:` selžou).
- Na čistém klonu bez sousední složky `webik` instalace selže. Proto zatím nejde nasadit na Vercel.

Po první publikaci kitu na npmjs.com: v `package.json` nastavit `"@oonehq/webik-site-kit": "^0.1.0"`,
spustit `pnpm install`, commitnout `package.json` s `pnpm-lock.yaml` a tuto kapitolu smazat.

## Spuštění

```sh
pnpm install
pnpm run dev:local      # http://127.0.0.1:3101
pnpm run typecheck
pnpm run test           # metadata, JSON-LD a shoda se záložním náhledem v editoru Webik
pnpm run build
```

S Webikem web nespouštějte ručně: editor si dev server webu spouští sám (`pnpm run dev` s `--hostname 127.0.0.1
--port 3101`). Webik tento web čeká v `../webik-sites/demo` vedle repozitáře `webik`; když adresář chybí,
naklonuje ho z `git@github.com:oonehq/webik-demo-site.git`. Jinou cestu nastaví `WEBIK_SITE_PATH`.

## Nasazení na Vercel

Až bude kit na npmjs.com (viz výše). Do té doby build na Vercelu selže na chybějící závislosti.

1. Vercel → Add New → Project → import `oonehq/webik-demo-site`. Framework Preset: Next.js.
2. Root Directory: `.` (kořen repozitáře, stejně jako `root` ve `webik.json`).
3. Install Command a Build Command nechte výchozí. Vercel pozná pnpm podle `pnpm-lock.yaml` a `packageManager`;
   token ani proměnné prostředí nejsou potřeba (kit je veřejný balíček).
4. Settings → Build and Deployment → Node.js Version 22 nebo novější.
5. Settings → Environments → Production → Branch Tracking: `main`.
6. Ve `webik.json` pak nastavit `"deploy": "vercel"` (případně objekt s `productionUrl`). Webik potom push větve
   `main` označí jako zveřejnění a bude chtít potvrzení.

## Nový web z této šablony

Postup je v `docs/SITE-CONTRACT.md` (kapitola 10) v repozitáři `oonehq/webik`: repozitář jako GitHub template,
změnit `id`, `name` a `kind` ve `webik.json`, `name` v `package.json`, nahradit fiktivní obsah a v `AGENTS.md`
smazat řádek o demo datech.

## Licence

MIT, viz [LICENSE](./LICENSE).
