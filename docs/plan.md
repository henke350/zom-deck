# Sidste tur ud – udviklingsplan

**Status:** Planen er godkendt (forslag 1–10 besluttet). **M0, M1 og M2 er færdige** (opsætning, dæk og ture, bykort og første skærm). Næste milepæl: M3 – søgning, fund og pakker.
**Besluttet:** stjerner for ekstra pakker (★/★★/★★★) og al tekst i spillet på engelsk. Version 2 bliver en kampagne med base, mad og vand (afsnit 12).
**Visuelt overblik:** https://claude.ai/artifact/XnjVimEtZRq8AUFBc4VR9Z
Repoet var tomt ved start; teknologien er valgt i afsnit 2.

**Sådan læses planen**

- **Besluttet** – står i oplægget, og jeg anbefaler at beholde det.
- **Startværdi** – et tal, vi forventer at justere efter playtest. Alle startværdier samles i én fil.
- **⚑ Ændringsforslag** – noget, jeg foreslår anderledes end oplægget.
- **Åbent** – skal afgøres af dig (se afsnit 9).

---

## 0. Gældende beslutninger (samlet)

Dette afsnit samler alt, der er besluttet. **Hvor afsnit 3 og 10–12 siger noget andet, gælder dette afsnit og `src/data/balance.ts`.**

| Emne                | Besluttet                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rammer              | Solo, turbaseret, kører i browseren uden server. Al spiltekst på engelsk. Arbejdstitel: _One More Building_.                                                                                                                                                                                                                                                    |
| Mission             | Gå ind i Shelter med mindst 2 forsyningspakker. ★ 2 · ★★ 3 · ★★★ 4 pakker. Tab ved 0 liv eller hvis man er ude, når tur 10 slutter.                                                                                                                                                                                                                             |
| Pakker              | 4 pr. spil: Supermarket har altid én, 3 ligger tilfældigt (seed) i 3 af de 5 andre bygninger. Findes ved første søgning i bygningen og tages automatisk. Hver pakke lægger 1 Heavy Load i dækket.                                                                                                                                                               |
| Tur                 | 10 liv · hånd 5 · 3 AP · 1 ubrugt kort må gemmes til næste tur · gratis bevægelse 1 gang pr. tur · Hastesøgning: 2 AP, 2 fund.                                                                                                                                                                                                                                  |
| Startdæk            | Search ×3, Crowbar ×2, Run ×2, Sneak ×1, Nerves ×2 (10 kort).                                                                                                                                                                                                                                                                                                   |
| Søgning             | 2 pr. bygning. 3 fund + bonusser (+1 "søg i fred", når der ingen zombier er). Vælg ét kort, skrot et kort fra hånden, eller afstå.                                                                                                                                                                                                                              |
| Zombier             | 2 liv, 1 skade. Skjult fare: ubesøgte bygninger viser et spænd. Forfølgelse (`chase`): zombier, der har set dig, følger 1 skridt og angriber. Zombiefase: forfølgelse → angreb → skumringsstøj.                                                                                                                                                                 |
| Støj                | Search +1, Pistol +2, Molotov +2, Lockpick 0. Ved 4 ankommer en zombie på dit sted (måleren −4). Skumring fra tur 8: +1 pr. tur.                                                                                                                                                                                                                                |
| Kort                | Tags Quiet, Weapon, Move, Tool, Med. "Follow-up X" kræver, at et kort med tag X er spillet tidligere i turen. "Use up" = stærkere engangseffekt, derefter fjernes kortet. 16 fundkort (afsnit 11).                                                                                                                                                              |
| Skrammel            | Nerves (kan ikke spilles). Heavy Load (kan ikke spilles eller fjernes; gratis bevægelse koster 1 AP, mens kortet er på hånden). Wound er en variant, der som standard er slået fra.                                                                                                                                                                             |
| Udtynding           | Skrot ved søgning · Use up · Toolbox og Painkillers · Workshop: Dismantle (1 AP) · Pharmacy: Patch up (1 AP, kun Nerves/Wound).                                                                                                                                                                                                                                 |
| Datamodel           | Den gældende datamodel står i koden: `src/game/types.ts` (regler) og `src/data/cards.ts` (kort). Follow-up og Use up er felter på kortets tilstande (`followUp`, `useUp`).                                                                                                                                                                                      |
| Afklaringer (M1–M2) | Tags hører til kortet, ikke måden det spilles på (en Crowbar, der bryder op, tæller stadig som Weapon). Flere Heavy Load på hånden gør stadig kun den gratis bevægelse 1 AP dyrere. Når man vinder midt i et kort (fx Running Shoes ind i Shelter), stopper kortets resterende effekter. Toolbox og Painkillers kan kun spilles, hvis der er et kort at fjerne. |
| Teknik              | TypeScript + React + Vite. Vitest til tests. oxlint og Prettier til kodekvalitet (oxlint erstatter ESLint, som Vite-skabelonen nu selv bruger). GitHub Actions kører alle kontroller ved hvert push.                                                                                                                                                            |
| Version 2           | Kampagne med base, mad og vand (afsnit 12). Bygges efter M8.                                                                                                                                                                                                                                                                                                    |

---

## 1. Vurdering

### Styrker

- **En klar fantasi i én sætning:** "Tag ud, find forsyninger, kom hjem før mørket." Let at forstå og forklare.
- **Udforskning fodrer dækket:** Hvert sted giver en bestemt type kort. Ruten bestemmer derfor, hvilket dæk du ender med. Det er spillets stærkeste idé.
- **Lille og afgrænset:** Ét kort, én zombietype og én mission kan blive spilbart hurtigt.
- **Turbaseret med synlige farer:** Passer til målet om tid til at tænke og forståelige konsekvenser.
- **Global støjmåler:** Enkel, synlig og giver søgning og skud en tydelig pris.

### Største designrisici (vigtigste først)

**R1 – Push your luck mangler en gevinst (kritisk).**
Med målet "2 pakker og hjem" er der ingen grund til at tage én bygning mere, når du har to pakker. Før du har to, _skal_ du fortsætte. Den centrale beslutning "hjem nu eller én bygning mere?" opstår derfor aldrig. Kort, du finder, har heller ingen værdi, når sejren er sikret.
→ ⚑ **Stjerner:** ★ = hjem med 2 pakker, ★★ = 3 pakker, ★★★ = 4 pakker. Sejr kræver stadig kun 2. De ekstra pakker er fristelsen.

**R2 – Flugt er gratis, så zombier er ufarlige (høj).**
Zombier står stille og angriber kun på dit eget sted. Med gratis bevægelse hver tur kan du næsten altid bare gå. Så bliver kamp dårlig økonomi: to Koben-kort for at dræbe en zombie, der kun giver 1 skade. Snig dig bliver næsten overflødigt.
→ ⚑ **Forfølgelse:** Zombier, der har set dig, følger ét skridt efter dig. Kommer du to skridt væk, eller sniger du dig, mister de sporet. Det er ikke "pathfinding" (automatisk rutefinding): en zombie flytter kun til et nabosted, hvor du står. Reglen kan slås til og fra i balancefilen.

**R3 – Fast placering af pakker gør spillet løst (høj).**
Ligger pakkerne altid samme sted, findes der efter få spil én bedste rute, og så er der ingen reelle valg.
→ ⚑ Supermarkedet har altid én pakke (det ved spilleren). De øvrige tre placeres tilfældigt i tre af de fem andre bygninger, styret af et seed.

**R4 – Faren er lav og flad (middel).**
10 liv mod zombier med 1 skade og cirka 2–3 støjzombier pr. spil giver få nederlag. Faren stiger heller ikke over tid, så det er lige så sikkert at være ude i tur 11 som i tur 3.
→ ⚑ **Skumring:** Fra tur 10 kommer der +1 støj ved hver turs afslutning. Sammen med forfølgelse bliver vejen hjem farligere, jo længere du bliver ude.

**R5 – Døde hænder og udvanding (middel).**
Uden Søg-kort på hånden kan du ikke søge. Hvert nyt våben- eller helingskort gør det sjældnere at trække Søg ("udvanding": dækket bliver fortyndet). Det er en god spænding, men den må ikke låse spillet.
→ ⚑ Grundhandlingen **Hastesøgning** (2 AP, viser kun 2 fund) er altid mulig. Desuden kan man **skrotte** et kort i stedet for at tage et fund.

**R6 – Sene fund er værdiløse (lav).**
Kort fundet i tur 10 når du næppe at bruge. Det er naturligt i et kort spil; stjernerne giver de sene ture et andet formål (pakker frem for kort).

**R7 – Uklar rækkefølge i reglerne (lav for spilleren, vigtig for koden).**
Se afsnit 6, hvor alle uklarheder er løst.

### Vurdering af basisdækket

- Sandsynligheden for mindst ét Søg i første hånd er cirka 92 %.
- Med 10 kort og 5 på hånden ser du hele dækket hver anden tur i starten. Tur 1 og 2 har tilsammen præcis alle 10 kort. Det er godt for starten.
- **Problem:** Koben (1 skade) mod zombier med 2 liv kræver to kort og 2 af dine 3 AP for én zombie.
- **Problem:** Snig dig er næsten overflødig, når flugt er gratis (løses af forfølgelse).
- **Problem:** Hænderne bliver ensformige: hver tur bliver "søg og gå".

⚑ **Anbefalet basisdæk (stadig 10 kort):**

| Antal | Kort     | AP  | Effekt                                                                                        |
| ----- | -------- | --- | --------------------------------------------------------------------------------------------- |
| 3     | Søg      | 1   | Gennemsøg stedet: se 3 fund, vælg ét. +1 støj.                                                |
| 3     | Koben    | 1   | Vælg: **1 skade** på en zombie her, ELLER **bryd op**: næste søgning denne tur viser +1 fund. |
| 2     | Løb      | 1   | Flyt til et nabosted.                                                                         |
| 2     | Snig dig | 1   | Én zombie her angriber dig ikke denne tur og mister sporet af dig.                            |

Koben får to anvendelser, så det sjældnere er et dødt kort. Snig dig får en klar rolle med forfølgelsesreglen.

---

## 2. Anbefalet teknisk løsning

**TypeScript + Vite + React**, med **Vitest** til test. Spillet er statiske filer, der kører i browseren. Ingen backend, konti eller database.

| Værktøj    | Hvad det er                                            | Hvorfor                                                                            |
| ---------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| TypeScript | JavaScript med typekontrol                             | Fanger fejl i kortdata (fx en ukendt effekt), før spillet kører.                   |
| React      | Bibliotek, der tegner skærmen ud fra spillets tilstand | Tilstand ændres → skærmen opdateres. Passer til adskillelsen af regler og visning. |
| Vite       | Udviklingsværktøj                                      | Starter en lokal server med `npm run dev` og bygger færdige filer.                 |
| Vitest     | Testværktøj                                            | Automatiske regelkontroller.                                                       |
| SVG        | Vektorgrafik i browseren                               | Bykortet med steder, forbindelser og brikker.                                      |

**Begrundelse**

- Et kortspil består mest af tekst, knapper og forklaringer. Det er HTML/CSS stærkt til: læsbar tekst, deaktiverede knapper med forklaring og hjælpetekster.
- Gratis, kører i alle moderne browsere og kan senere lægges gratis på fx GitHub Pages.
- Meget udbredt, så AI-agenter skriver det sikkert og kan teste det automatisk.

**Fravalgt**

- _Phaser_ (2D-spilmotor): god til animation og sprites, men mere arbejde for tekst og menuer. Kan komme på tale senere til effekter.
- _Godot_: stærk motor, men tungere webeksport og sværere at teste automatisk.
- _Ren JavaScript uden React_: færre afhængigheder, men manuel skærmopdatering bliver rodet, når spillet vokser.

### Arkitektur i tre lag

1. **Regelmotor** (`src/game/`): ren TypeScript uden skærmkode. Hovedfunktionen er
   `applyAction(state, action) → { state, events }`. Den ændrer aldrig den gamle tilstand, men laver en ny. Det gør test, gentagelse og senere "fortryd" enkelt.
2. **Data** (`src/data/`): kort, steder, zombier og alle balancetal.
3. **Visning** (`src/ui/`): React-komponenter, der viser tilstanden og sender handlinger til motoren. Ingen regler her.

**Tilfældighed:** Al tilfældighed går gennem én seedet generator. Et _seed_ er et startnummer: samme seed giver samme blanding, samme pakkeplacering og samme fund. Generatorens tilstand ligger i spillets tilstand. Seed vises på skærmen og kan sættes i adressen, fx `?seed=4711`. En fejl kan genskabes præcist med seed + listen af handlinger.

**Lokal lagring:** Kun indstillinger og bedste resultat i browserens `localStorage`.

**Navngivning:** Kode, id'er og al tekst til spilleren på engelsk (besluttet). Teksten samles i én fil (`texts.en.ts`), så en dansk version kan tilføjes senere uden at røre reglerne. Se navneoversigten i afsnit 10.

---

## 3. Den første spilbare prototype

### 3.1 Mission, sejr og nederlag

- **Mål:** Find mindst 2 forsyningspakker, og gå ind i tilflugtsstedet inden udgangen af tur 12.
- **Sejr** sker i det øjeblik, du træder ind i tilflugtsstedet med mindst 2 pakker. Spillet spørger først: "Afslut ekspeditionen nu? Du får ★★."
- **Stjerner (besluttet):** ★ 2 pakker · ★★ 3 pakker · ★★★ 4 pakker.
- **Tab:** liv når 0 (straks), eller du er ikke hjemme, når tur 12 slutter.
- **Slutskærm:** resultat, årsag, statistik (skade fordelt på kilder, støj, ankomne zombier, fundne kort, brugte ture) og seed.
  Knapper: "Ny ekspedition" og "Prøv samme by igen".
- Pakker er missionsgenstande og ligger ikke i dækket (besluttet).

### 3.2 Bykortet

```
[Værksted]──────────────[Politistation]
    │                          │
[Bolig A]──────[Gade]──────[Supermarked]
    │         ╱  │  ╲
[Tilflugtssted]  │    ╲
            [Apotek]──[Bolig B]
```

| Sted          | Søgninger | Zombier ved start | Fundtyper                                         |
| ------------- | --------- | ----------------- | ------------------------------------------------- |
| Tilflugtssted | 0         | 0 (sikkert sted)  | –                                                 |
| Gade          | 0         | 0                 | – (knudepunkt)                                    |
| Bolig A       | 2         | 0                 | blandet hverdag                                   |
| Bolig B       | 2         | 1                 | blandet hverdag                                   |
| Supermarked   | 2         | 1                 | proviant, rygsæk, distraktion – **altid 1 pakke** |
| Apotek        | 2         | 1                 | heling                                            |
| Værksted      | 2         | 1                 | værktøj, nærkamp                                  |
| Politistation | 2         | 2                 | skydevåben, beskyttelse                           |

Afstand fra tilflugtsstedet: Gade og Bolig A = 1 skridt. Supermarked, Apotek, Bolig B og Værksted = 2. Politistation = 3 (to forskellige veje).

Hvert sted viser: type, zombier (med liv og et øje-ikon, hvis de har set dig), tilbageværende søgninger og om en pakke er fundet. Støj er global og vises i toplinjen. Bykortets struktur og alle zombier er synlige fra start; kun fundene er skjulte.

### 3.3 Turen

**Startværdier:** 10 liv · 10 kort i dækket · 5 på hånden · 3 AP (handlingspoint) pr. tur · 12 ture.

1. **Start:** Træk op til 5 kort. AP sættes til 3. Den gratis bevægelse bliver tilgængelig.
2. **Handlinger** i valgfri rækkefølge:
   - **Gå:** gratis bevægelse til et nabosted, én gang pr. tur.
   - **Spil et kort:** koster som regel 1 AP.
   - ⚑ **Hastesøgning:** 2 AP, kræver intet kort, viser kun 2 fund.
   - Hver handling afvikles helt (inkl. støj og zombieankomst), før den næste kan vælges.
3. **Afslut tur:** altid mulig (undtagen mens et fundvalg er åbent).
4. **Zombiefase:** (a) forfølgelse, (b) angreb, (c) skumringsstøj fra tur 10.
5. **Oprydning:** hånd og spillede kort → afkastbunken. Midlertidige effekter nulstilles.
6. **Tid:** Var det tur 12, og er du ikke hjemme → tab. Ellers næste tur.

**Kortbunker:** trækbunke, hånd, "i spil" (kort spillet denne tur), afkastbunke og "fjernet" (engangskort og skrottede kort). Spillede kort ligger "i spil" til turens slutning, så de ikke blandes ind midt i turen. Når trækbunken er tom, blandes afkastbunken til en ny trækbunke.

### 3.4 Kort

Basisdæk: se afsnit 1 (Søg, Koben, Løb, Snig dig).

**Fundkort (10 + 2 i reserve):**

| Kort                  | AP  | Effekt                                                              | Støj | Engangs | Findes i               |
| --------------------- | --- | ------------------------------------------------------------------- | ---- | ------- | ---------------------- |
| Økse                  | 1   | 2 skade på én zombie                                                | 0    | –       | Værksted, boliger      |
| Pistol                | 1   | 3 skade på én zombie                                                | +2   | –       | Politistation          |
| Løbesko               | 1   | Flyt op til 2 forbindelser                                          | 0    | –       | Boliger, supermarked   |
| Førstehjælp           | 1   | +3 liv                                                              | 0    | ja      | Apotek                 |
| Bandage               | 1   | +1 liv                                                              | 0    | –       | Apotek, boliger        |
| Lommelygte            | 0   | Næste søgning denne tur viser +1 fund                               | 0    | –       | Værksted, boliger      |
| Vækkeur               | 1   | Distraktion: zombierne her angriber ikke denne tur og mister sporet | 0    | ja      | Supermarked, boliger   |
| Energidrik            | 0   | +2 AP                                                               | 0    | ja      | Supermarked, apotek    |
| Rygsæk                | 0   | Træk 1 kort                                                         | 0    | –       | Supermarked, boliger   |
| Kampvest              | 1   | Forhindr op til 2 skade denne tur                                   | 0    | –       | Politistation          |
| _Haglgevær (reserve)_ | 2   | 2 skade på hver zombie her                                          | +3   | –       | Politistation          |
| _Kikkert (reserve)_   | 0   | Se, om et nabosted har en pakke                                     | 0    | –       | Politistation, boliger |

Ingen ammunition og intet udstyrsinventar (besluttet). Tallene er startværdier.

**Hvorfor flere kort ikke automatisk er bedre:** Du kan kun bruge 3 AP pr. tur, hvert nyt kort fortynder dine Søg-kort, og du kan afvise fund eller skrotte svage kort.

### 3.5 Søgning og forsyningspakker

- En søgning kræver, at bygningen har søgninger tilbage (højst 2 pr. bygning).
- Den viser 3 forskellige fund fra stedets fundpulje (en vægtet liste) plus eventuelle bonusser fra Koben og Lommelygte.
- **Valg:** (a) tag ét kort → afkastbunken, (b) ⚑ skrot ét kort fra hånden (fjernes for resten af ekspeditionen), eller (c) afstå.
- En søgning tæller også, hvis du afstår.
- **Pakker:** 4 pakker pr. ekspedition. Supermarkedet har altid én. Tre placeres tilfældigt (seed) i tre af de fem andre bygninger, aldrig i Gade eller tilflugtsstedet.
  En pakke findes ved **første** søgning i bygningen og tages automatisk – oven i kortvalget. Anden søgning i en bygning giver kun kort.

### 3.6 Zombier, støj og skumring

- **Zombie:** 2 liv, 1 skade. Skade på zombier bliver siddende mellem ture.
- **"Har set dig":** En zombie ser dig, når I er på samme sted på et tidspunkt i din tur. Vises med et øje-ikon.
- **Zombiefasen:**
  1. _Forfølgelse:_ Zombier, der har set dig og står præcis ét skridt fra dig, flytter til dit sted. Zombier længere væk mister sporet.
  2. _Angreb:_ Hver zombie på dit sted giver 1 skade, medmindre den er neutraliseret (Snig dig, Vækkeur), eller skaden blokeres (Kampvest).
  3. _Skumring_ (tur 10–12): +1 støj. Zombier, der ankommer her, angriber først næste tur.
- **Støj:** Søg og Hastesøgning +1, Pistol +2, Haglgevær +3. For hver hele 4 støj ankommer én zombie til dit sted, og måleren reduceres med 4 (overskud bevares). Ankomne zombier angriber først i zombiefasen.
- **Tilflugtsstedet er sikkert:** Zombier kan ikke komme ind og mister sporet. Skulle en zombie ankomme, mens du er der, kommer den til Gade i stedet.
- **Forhåndsvisning:** Knapper viser konsekvensen, før du bekræfter, fx "Søg: støj 3 → 4 – en zombie ankommer her". "Afslut tur" viser fx "2 zombier angriber dig: −2 liv".
- **Indstilling for forfølgelse** (`zombieFollow`):
  - `chase` (anbefalet start): zombier følger efter og angriber i samme zombiefase.
  - `gentle`: zombier følger efter, men angriber først næste tur (mildere).
  - `off`: oplæggets oprindelige regel – zombier står stille.

### 3.7 Skærmen

```
┌───────────────────────────────────────────────────────────────────┐
│ ❤ 8/10   ⚡ 2/3   🔊 ▮▮▮▯ 3/4   🕒 Tur 7/12   📦 1/2  (★2 ★★3 ★★★4) │
├───────────────────────────────────────────────┬───────────────────┤
│                                               │ APOTEK            │
│                BYKORT (SVG)                   │ Søgninger: 1/2    │
│   steder, forbindelser, spillerbrik, zombier  │ Zombier: 🧟 2/2 👁 │
│                                               │ Pakke: ukendt     │
│                                               ├───────────────────┤
│                                               │ LOG               │
│                                               │ Tur 7: Søg, +1 🔊 │
├───────────────────────────────────────────────┴───────────────────┤
│ [Søg] [Koben] [Løb] [Økse] [Bandage]      Grundhandling: Hastesøg  │
│ Træk: 4 · Afkast: 6 · Fjernet: 1                     [AFSLUT TUR ▶] │
└───────────────────────────────────────────────────────────────────┘
```

- Klik på et nabosted = gratis bevægelse. Klik på et kort = spil det; kræver kortet et valg (mål, anvendelse eller destination), vises valgene.
- Ugyldige handlinger er grå og forklarer hvorfor, fx "Ingen zombier her", "Ingen handlingspoint tilbage", "Bygningen er gennemsøgt".
- Farer vises med både farve og symbol.
- Kort regelskærm (én side) og en kort "Sådan spiller du" ved første start.
- Simple former og ikoner. Ingen færdig grafik, animation eller lyd i prototypen.

### 3.8 Ikke med i prototypen (besluttet)

Multiplayer, flere figurer, basebygning, crafting, kampagne, proceduregenererede byer, flere zombietyper, avanceret fjende-AI, 3D, stemmer, detaljerede animationer og AI i selve spillet.

---

## 4. Milepæle

Hver milepæl ender med noget, du kan se eller afprøve.

| #      | Milepæl                           | Indhold                                                                                                                                                                                                                                                             | Færdig når                                                                                                     |
| ------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| M0     | Opsætning                         | ✅ **Færdig.** Vite + React + TypeScript, Vitest, oxlint/Prettier (værktøjer til kodekvalitet), README, `CLAUDE.md` med projektregler for AI-agenter, automatisk test ved hvert push (GitHub Actions).                                                              | `npm run dev` viser en side, `npm test` kører, og den automatiske kontrol er grøn.                             |
| M1     | Regelkerne: dæk og ture           | ✅ **Færdig.** Seedet tilfældighed, blanding, træk, "i spil", afkast, engangskort, AP, turtæller, afslut tur. Ingen grafik.                                                                                                                                         | Test af træk/blanding/engangskort/AP består. Samme seed giver samme træk. Antallet af kort er altid bevaret.   |
| M2     | Bykort, bevægelse og første skærm | ✅ **Færdig.** Stedsdata og forbindelser, gratis bevægelse, Løb. Simpel skærm: kort, brik, hånd, toplinje, log og afslut tur.                                                                                                                                       | Du kan klikke dig gennem ture i browseren, og ugyldige handlinger er grå med forklaring.                       |
| M3     | Søgning, fund og pakker           | Fundpuljer, fundvalg (tag/skrot/afstå), søgegrænser, Hastesøgning, søgebonusser, pakkeplacering, missionsvisning.                                                                                                                                                   | Test bekræfter grænserne og at der ligger 4 pakker i 1.000 forskellige seeds. Du kan finde pakker i browseren. |
| M4     | Zombier, kamp og støj             | Startzombier, angreb, støjmåler og ankomst, forfølgelse (3 indstillinger), Snig dig, Vækkeur, Kampvest, forhåndsvisning.                                                                                                                                            | Test af zombiefasens rækkefølge og støjgrænser består. Forhåndsvisningen stemmer med det, der sker.            |
| **M5** | **Første spilbare version**       | Sejr, nederlag, stjerner, slutskærm med forklaring, genstart (ny/samme by), skumring, regelskærm. Motoren afleverer et `ExpeditionResult` (forberedelse til version 2).                                                                                             | En hel ekspedition kan spilles fra start til slut uden fejl. Du har spillet tre ekspeditioner selv.            |
| M6     | Alt indhold + balanceværktøj      | Resten af fundkortene. Et simuleringsscript, hvor tre simple bot-spillere (tilfældig, grådig, "skynd dig hjem") spiller 1.000 spil hver og laver en rapport. "Fuzz-test": tusindvis af tilfældige, gyldige handlinger for at finde nedbrud eller umulige tilstande. | Rapporten kan køres med én kommando. Fuzz-testen finder ingen fejl.                                            |
| M7     | Playtest 1 og justering           | 5–10 spil (dig + 2–3 andre), kort spørgeskema, justering af balancetal.                                                                                                                                                                                             | Playtestspørgsmålene i afsnit 7 er besvaret, og 1–3 justeringer er afprøvet.                                   |
| M8     | Finpudsning og udgivelse          | Ikoner, farver, læsbarhed, hjælpetekster, udgivelse som statisk side.                                                                                                                                                                                               | Spillet kan åbnes via et link.                                                                                 |

---

## 5. Filstruktur og datastrukturer

### Filstruktur

```
zom-deck/
├─ README.md
├─ CLAUDE.md                 # projektregler for AI-agenter
├─ docs/
│  ├─ plan.md                # denne plan
│  └─ rules.md               # spillerens regler (kilde til regelskærmen)
├─ index.html
├─ package.json · tsconfig.json · vite.config.ts
└─ src/
   ├─ main.tsx
   ├─ game/                  # REGELMOTOR – ren TypeScript, ingen React
   │  ├─ types.ts            # GameState, Action, GameEvent …
   │  ├─ rng.ts              # seedet tilfældighed
   │  ├─ setup.ts            # newGame(seed, balance)
   │  ├─ engine.ts           # applyAction(state, action)
   │  ├─ deck.ts             # træk, bland, kassér, fjern
   │  ├─ effects.ts          # kortenes effekter
   │  ├─ search.ts           # søgning, fund, pakker
   │  ├─ zombies.ts          # zombiefase, støj, ankomst, forfølgelse
   │  ├─ validate.ts         # er handlingen lovlig? ellers: forklaring
   │  ├─ preview.ts          # hvad sker der, hvis …
   │  ├─ outcome.ts          # sejr, nederlag, stjerner
   │  └─ *.test.ts           # test ved siden af koden
   ├─ data/                  # INDHOLD OG BALANCE – let at ændre
   │  ├─ balance.ts          # alle startværdier
   │  ├─ cards.ts
   │  ├─ locations.ts        # steder, forbindelser, fundpuljer, startzombier
   │  ├─ zombies.ts
   │  └─ texts.en.ts         # tekster til spilleren (engelsk)
   ├─ ui/                    # VISNING OG INPUT
   │  ├─ App.tsx
   │  ├─ useGame.ts          # forbinder regelmotor og skærm
   │  ├─ components/         # TopBar, CityMap, LocationPanel, Hand, Card,
   │  │                      # FindDialog, EventLog, EndScreen, RulesDialog
   │  └─ styles/
   └─ sim/
      └─ simulate.ts         # bot-spillere og balancerapport (kører uden skærm)
```

### Vigtigste datastrukturer (skitse)

```ts
// src/data/balance.ts – alle startværdier ét sted
export const balance = {
  maxHp: 10, handSize: 5, apPerTurn: 3, turnLimit: 12,
  searchesPerBuilding: 2, searchOptions: 3,
  quickSearch: { cost: 2, options: 2 },
  noiseThreshold: 4, searchNoise: 1,
  packsToWin: 2, packsOnMap: 4, starThresholds: [2, 3, 4],
  duskFromTurn: 10, duskNoise: 1,
  zombie: { hp: 2, damage: 1 },
  zombieFollow: 'chase' as 'chase' | 'gentle' | 'off',
  starterDeck: { search: 3, crowbar: 3, run: 2, sneak: 2 },
};

// src/game/types.ts
type LocationId = 'shelter' | 'street' | 'houseA' | 'houseB'
                | 'supermarket' | 'pharmacy' | 'workshop' | 'police';

interface LocationDef {
  id: LocationId;
  kind: 'shelter' | 'street' | 'building';
  neighbors: LocationId[];
  maxSearches: number;
  lootPool: { card: CardId; weight: number }[];
  startZombies: number;
  alwaysHasPack?: boolean;           // supermarkedet
  mapPos: { x: number; y: number };  // placering på bykortet
}

type Effect =
  | { kind: 'search'; options: number }
  | { kind: 'searchBonus'; amount: number }        // Koben (bryd op), Lommelygte
  | { kind: 'move'; maxSteps: number }
  | { kind: 'damage'; amount: number; target: 'one' | 'allHere' }
  | { kind: 'heal'; amount: number }
  | { kind: 'neutralize'; target: 'one' | 'allHere' } // angriber ikke + mister sporet
  | { kind: 'block'; amount: number }
  | { kind: 'gainAp'; amount: number }
  | { kind: 'draw'; amount: number }
  | { kind: 'scout' };

interface CardDef {
  id: CardId;
  cost: number;           // AP
  noise: number;
  oneShot: boolean;
  modes: { effects: Effect[] }[];  // 1 eller 2 anvendelser (Koben har 2)
}

interface CardInstance { uid: string; card: CardId }  // hvert fysisk kort har sit eget id

interface Zombie {
  uid: string; location: LocationId; hp: number;
  hasSeenPlayer: boolean; neutralizedThisTurn: boolean;
}

interface GameState {
  balance: typeof balance;  // kopi, så et spil altid kan genskabes
  seed: number;
  rng: number;              // generatorens tilstand
  turn: number;
  phase: 'action' | 'chooseFind' | 'gameOver';
  player: { location: LocationId; hp: number; ap: number; freeMoveUsed: boolean;
            packs: number; searchBonus: number; block: number };
  piles: { draw: CardInstance[]; hand: CardInstance[]; inPlay: CardInstance[];
           discard: CardInstance[]; removed: CardInstance[] };
  locations: Record<LocationId, { searchesLeft: number; hasPack: boolean; packTaken: boolean }>;
  zombies: Zombie[];
  noise: number;
  pendingFind?: { options: CardId[]; packFound: boolean };
  outcome?: { result: 'won' | 'lost'; cause: 'home' | 'killed' | 'darkness'; stars: number };
  log: LogEntry[];
  stats: Stats;             // til slutskærmens forklaring
}

type Action =
  | { type: 'freeMove'; to: LocationId }
  | { type: 'playCard'; uid: string; mode?: number; target?: string; to?: LocationId }
  | { type: 'quickSearch' }
  | { type: 'takeFind'; card: CardId }
  | { type: 'scrapCard'; uid: string }
  | { type: 'declineFind' }
  | { type: 'endTurn' };

// Forberedelse til version 2 (kampagne): en ekspedition starter fra en
// opsætning og slutter med et samlet resultat.
interface ExpeditionSetup {
  startDeck: CardId[];         // nulstilles hver morgen; Locker kan tilføje ét kort
  startHp: number;             // fx −2 ved tørst, +2 med Infirmary
  revealedBuildings: LocationId[]; // Lookout
  cityState?: CityState;       // plyndrede bygninger og flere zombier over dage
}
interface ExpeditionResult {
  outcome: 'home' | 'killed' | 'darkness';
  food: number; water: number; materials: number;
  hpLeft: number; cardsFound: CardId[];
}

// Regelmotorens offentlige funktioner
newGame(seed, balance, setup?: ExpeditionSetup): GameState
expeditionResult(state): ExpeditionResult   // bruges af kampagnelaget i version 2
validate(state, action): { ok: true } | { ok: false; reason: string } // reason vises i skærmen
applyAction(state, action): { state: GameState; events: GameEvent[] }
preview(state, action): { noiseBefore, noiseAfter, zombiesArriving, apAfter }
previewEndTurn(state): { followers, attackers, damage, losesToDarkness }
```

---

## 6. Regeluklarheder og anbefalede løsninger

| #   | Uklarhed                                         | Anbefalet løsning                                                                                                                   |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Kan man søge uden Søg-kort?                      | Ja, med Hastesøgning: 2 AP, 2 fund, +1 støj.                                                                                        |
| 2   | Hvor og hvornår findes pakker?                   | 4 pakker: supermarked + 3 af 5 andre bygninger (seed). Findes ved første søgning i bygningen og tages automatisk oven i kortvalget. |
| 3   | Hvad er grunden til at blive ude efter 2 pakker? | Stjerner for 3 og 4 pakker.                                                                                                         |
| 4   | Hvornår vinder man præcist?                      | Straks ved indgang i tilflugtsstedet med ≥ 2 pakker (efter bekræftelse). Zombiefasen springes over.                                 |
| 5   | Hvad betyder "inden udgangen af tur 12"?         | Du skal nå hjem i tur 12's handlingsfase. Er du ude efter zombiefasen i tur 12, taber du.                                           |
| 6   | Død og sejr samtidig?                            | Kan ikke ske: sejr sker i handlingsfasen, skade kun i zombiefasen. Liv 0 = tab med det samme.                                       |
| 7   | Rækkefølge i én handling                         | Betal AP → udfør effekt (inkl. fundvalg) → læg støj til → evt. zombieankomst → tjek sejr/tab. Støj kommer altid til sidst.          |
| 8   | Rækkefølge ved turens slutning                   | Forfølgelse → angreb → tjek død → skumringsstøj → oprydning → tidstjek.                                                             |
| 9   | Hvornår går spillede kort i afkastbunken?        | Ved turens slutning. Indtil da ligger de "i spil" og kan ikke blandes ind.                                                          |
| 10  | Træk, når både trække- og afkastbunken er tomme  | Træk så mange som muligt. Ingen fejl.                                                                                               |
| 11  | Støj langt over grænsen                          | Én zombie pr. hele 4 støj; overskuddet bevares (fx 9 støj → 2 zombier, 1 tilbage).                                                  |
| 12  | Hvor ankommer støjzombier?                       | På dit sted, med det samme. Er du i tilflugtsstedet, ankommer de til Gade.                                                          |
| 13  | Angriber en nyankommen zombie straks?            | Nej, først i zombiefasen.                                                                                                           |
| 14  | Blokerer zombier søgning og bevægelse?           | Nej (besluttet). Men de ser dig og følger efter.                                                                                    |
| 15  | Overskydende skade                               | Går tabt. Angreb rammer én valgt zombie; Haglgevær rammer alle på stedet.                                                           |
| 16  | Kampkort uden zombier på stedet                  | Deaktiveret med forklaringen "Ingen zombier her". Koben kan stadig bruges til "bryd op".                                            |
| 17  | Søgekort på et gennemsøgt sted eller i Gade      | Deaktiveret med forklaring.                                                                                                         |
| 18  | Søgebonusser (Koben, Lommelygte)                 | Lægges sammen, gælder næste søgning i denne tur og forsvinder ved turens slutning.                                                  |
| 19  | Heling over max                                  | Liv kan ikke overstige 10.                                                                                                          |
| 20  | Løbesko gennem et sted med zombier               | Kun stedet, hvor du stopper, tæller. Zombier på mellemstedet ser dig ikke.                                                          |
| 21  | Gå hjem med under 2 pakker                       | Tilladt. Sikkert sted, ingen heling, ekspeditionen fortsætter.                                                                      |
| 22  | Afslutte tur med AP tilbage                      | Altid tilladt.                                                                                                                      |
| 23  | Hvad kan skrottes?                               | Ét kort fra hånden (ikke søgekortet selv, som ligger "i spil"). Det fjernes for resten af ekspeditionen.                            |
| 24  | Hvem rammes af Snig dig og Vækkeur?              | Zombier, der er på stedet, når kortet spilles. Zombier, der ankommer senere, påvirkes ikke.                                         |
| 25  | Tilfældighed                                     | Alt tilfældigt går gennem spillets seedede generator. Skærmkoden bruger aldrig tilfældighed selv.                                   |

---

## 7. Kontrol og playtest

### Automatiske test (Vitest)

- **Korttræk og blanding:** Et trukket kort fjernes altid fra trækbunken. Tom trækbunke → afkastbunken blandes. Træk med to tomme bunker stopper uden fejl. Engangskort ender i "fjernet". Det samlede antal kort er altid bevaret.
- **AP og gratis bevægelse:** Kort kan ikke spilles uden AP. Gratis bevægelse kun én gang pr. tur. Begge nulstilles ved ny tur.
- **Forbindelser:** Bevægelse kun til naboer. Løbesko højst 2 skridt. Kortdata kontrolleres: forbindelser går begge veje, og alle steder kan nås.
- **Søgninger:** Højst 2 pr. bygning. Afstå tæller. Ingen søgning i Gade eller tilflugtsstedet. Antal fund = 3 + bonusser.
- **Støj og ankomst:** +1/+2/+3 støj. Ved 4 kommer én zombie, ved 8 to. Overskud bevares. Nyankomne angriber kun i zombiefasen.
- **Skadens rækkefølge:** Forfølgelse før angreb. Snig dig, Vækkeur og Kampvest virker. Død tjekkes med det samme.
- **Mission:** Altid 4 pakker, og supermarkedet har én. Sejr straks ved hjemkomst med 2. Tab efter tur 12. Genstart med samme seed giver samme spil.
- **Gentagelse:** Seed + liste af handlinger giver præcis samme slutresultat.
- **Fuzz-test** (M6): tusindvis af spil med tilfældige, gyldige handlinger må aldrig give nedbrud eller umulige tilstande.

### Playtest

| Spørgsmål                                                 | Hvad vi ser efter                                                                         |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Er det spændende at vælge mellem at fortsætte og gå hjem? | Hvor ofte går spillere efter 3. og 4. pakke? Dør nogle på vejen hjem? Begge dele bør ske. |
| Kan spilleren udvikle forskellige dæk?                    | Hvilke kort tages i forskellige spil? Ligner dækkene hinanden hver gang?                  |
| Er bevægelse, søgning og kamp alle nyttige?               | Statistik over kortbrug. Er der kort, ingen bruger?                                       |
| Kan dårlige hænder håndteres?                             | Antal ture uden meningsfuld handling. Hvor ofte bruges Hastesøgning?                      |
| Kan en fast rute vinde uden valg?                         | Sejrsraten for "skynd dig hjem"-botten. Over cirka 80 % = for let.                        |
| Forstår man, hvorfor man vandt eller tabte?               | Spilleren forklarer resultatet med egne ord; sammenlign med slutskærmen.                  |

### Justeringsknapper efter playtest

| Hvis playtest viser …                  | … så prøv                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| Flugt er stadig for let                | Flere startzombier; skumring fra tur 9.                                        |
| Det er for svært                       | `zombieFollow: 'gentle'`, 12 liv eller støjgrænse 5.                           |
| Ingen tager chancen for 3. og 4. pakke | Placér de tilfældige pakker længere væk; vis tydeligere hvad stjernerne giver. |
| For mange døde hænder                  | 4 Søg i basisdækket eller Hastesøgning til 1 AP.                               |
| Alle dæk bliver ens                    | Skarpere forskel på fundpuljerne.                                              |

---

## 8. Idéer til senere (ikke krav til prototypen)

| Idé                               | Hvad                                                                                                                                                        | Hvorfor                                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Tung rygsæk**                   | Hver pakke lægger et "Last"-kort uden effekt i dækket.                                                                                                      | Binder missionen til deckbuilding: jo mere du bærer, jo dårligere hænder. Ægte push your luck. Bør testes som variant efter M7. |
| **Støj, der breder sig**          | Støj har et sted; zombier går mod larm. Vækkeuret kan kastes til et nabosted for at lokke zombier væk.                                                      | Naturlig version 2 af støjmåleren. Giver taktisk dybde.                                                                         |
| **Sår-kort**                      | Zombiebid lægger et dødt "Sår"-kort i dækket; bandager fjerner dem.                                                                                         | Skade mærkes i dækket. Risiko for en nedadgående spiral.                                                                        |
| **Overlevende at redde**          | En person sidder fast i en bolig. Tag vedkommende med som et kort med en evne, men det larmer.                                                              | Endnu et "tør jeg?"-valg og en ekstra stjerne.                                                                                  |
| **Bygningshændelser**             | Første besøg trækker en lille hændelse: låst dør, alarm, skjult lager, fælde.                                                                               | Variation uden at generere byen.                                                                                                |
| **Dagens ekspedition**            | Samme seed for alle i dag + en resultattekst, der kan deles.                                                                                                | Godt til at dele og sammenligne i et fællesskab.                                                                                |
| **Fortryd**                       | Fortryd sidste handling, indtil noget skjult er afsløret.                                                                                                   | Næsten gratis med arkitekturen. Fjerner frustration over fejlklik.                                                              |
| **Rygsæklomme**                   | Gem ét kort fra hånden til næste tur.                                                                                                                       | Hjælper mod dårlige hænder og giver planlægning. Kan rykkes ind i prototypen, hvis døde hænder er et problem.                   |
| **Forskellige overlevende**       | Figurer med eget startdæk (sygeplejerske, mekaniker, løber).                                                                                                | Genspilsværdi.                                                                                                                  |
| **Mini-kampagne**                 | Fem dage; pakker forbedrer tilflugtsstedet; ét kort må tages med; byen bliver farligere.                                                                    | Langsigtet motivation.                                                                                                          |
| **Natten som blød grænse**        | Efter tur 12 taber man ikke straks, men der kommer en zombie hver tur.                                                                                      | Mindre brat end øjeblikkeligt nederlag.                                                                                         |
| **AI-playtester under udvikling** | Fordi regelmotoren er ren kode med tekstbeskeder, kan en AI-agent spille hundredvis af spil via et lille kommandolinjeværktøj og skrive en playtestrapport. | Hurtig feedback på balance. Spillet selv bruger stadig ingen AI.                                                                |

---

## 9. Spørgsmål fra runde 1 (besvaret)

1. **Stjerner for 3 og 4 pakker:** Ja.
2. **Sprog i spillet:** Engelsk.

---

## 10. Kritisk gennemgang, runde 2

**Spørgsmål:** Er spilmekanikkerne interessante nok?

**Svar:** Skelettet holder. Men i oplæggets form er spillet for let og for forudsigeligt, og den vigtigste beslutning ("hjem eller én bygning mere?") opstår aldrig. Med stjernerne og fem små regelændringer bliver hver tur et reelt valg. Det skal bekræftes med bot-simulering (M6) og playtest (M7).

### Vurdering pr. mekanik (min vurdering, 1–5)

| Mekanik           | Oplæg | Med ændringer | Problem → løsning                                                                                                        |
| ----------------- | ----- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Hjem eller videre | 1     | 4             | Med 2 pakker går man bare hjem. → Stjerner, skumring, skjult fare.                                                       |
| Rutevalg          | 2     | 4             | En enkel rute når alle seks bygninger og er hjemme i tur 8 (10 skridt: 8 gratis + 2 Run). → 10 ture, skumring fra tur 8. |
| Kamp og flugt     | 1     | 4             | Flugt er gratis; at dræbe koster 2 kort for at spare 1 skade. → Forfølgelse + "søg i fred".                              |
| Valg i hver tur   | 2     | 4             | 3 AP til 5 kort: to kort spildes, og stedet afgør oftest valget. → Gem ét kort; Crowbar med to anvendelser.              |
| Deckbuilding      | 2     | 3             | Kortene virker hver for sig. → Tre spillestile; hvert fundkort får en synergi eller en ulempe.                           |
| Søgning, 1 af 3   | 4     | 4             | Allerede godt. → Behold; "skrot et kort" som alternativ.                                                                 |
| Støj              | 3     | 4             | En fast pris, der ikke vokser. → Skumring.                                                                               |

### Tre indsigter

1. **Push your luck kræver usikkerhed, man kan se.** Er alt synligt og fast, og er vejen hjem garanteret af den gratis bevægelse, bliver "én bygning mere" et regnestykke. Skjult fare og tilfældige pakker giver en risiko, man kan vurdere, men ikke beregne.
2. **Knaphed skaber valg.** Kan man nå alle bygninger, er rækkefølgen ligegyldig.
3. **Kamp skal give noget, ikke kun forhindre noget.** Ellers flygter alle.

### Fem nye forslag (besluttet)

| #   | Forslag         | Regel                                                                                            | Ændrede startværdier                                     |
| --- | --------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | Strammere ur    | 10 ture; skumring (+1 støj pr. tur) fra tur 8. Kun en perfekt tur når alle bygninger.            | `turnLimit: 10`, `duskFromTurn: 8`                       |
| 2   | Skjult fare     | Ubesøgte bygninger viser kun et spænd, fx "1–2 zombier". Det præcise antal afsløres ved ankomst. | `startZombies` bliver et spænd pr. sted                  |
| 3   | Søg i fred      | Er der ingen zombier på stedet, viser søgningen +1 fund. Giver kamp og Sneak en gevinst.         | `peacefulSearchBonus: 1`                                 |
| 4   | Gem ét kort     | Ét ubrugt kort må blive på hånden til næste tur. Færre spildte kort, mere planlægning.           | `keepCards: 1`                                           |
| 5   | Tre spillestile | Stille plyndrer, kæmper og løber (+ støttekort). Hvert fundkort får en synergi eller en ulempe.  | Nye kort: Soft Soles, Shopping Cart, Molotov, Adrenaline |

Regelbudget: Selv med alle ændringer skal reglerne kunne stå på én side.

**Eksempel, der tester mekanikken:** Tur 8 af 10, skumring, 5 liv, støj 3/4, 2 pakker (★ sikret). Pharmacy er ét skridt væk med "1–2 zombier" og 2/3 chance for en pakke. Valgene er A) gå hjem (★, ingen risiko), B) søg og løb tilbage (★★ med 67 %, −2 til −3 liv) eller C) søg og ryd op (★★ med 67 %, færre skader, men hjemme først i tur 9–10). Ingen af svarene er oplagte. Med oplæggets regler var svaret altid A.

### Navneoversigt (spiltekst på engelsk)

| Dansk (plan)                                      | Engelsk (spil)                                               |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Tilflugtssted, Gade, Bolig A/B                    | Shelter, Street, House A/B                                   |
| Supermarked, Apotek, Værksted, Politistation      | Supermarket, Pharmacy, Workshop, Police Station              |
| Søg, Koben, Løb, Snig dig                         | Search, Crowbar, Run, Sneak                                  |
| Økse, Pistol, Løbesko, Førstehjælp, Bandage       | Axe, Pistol, Running Shoes, First Aid, Bandage               |
| Lommelygte, Vækkeur, Energidrik, Rygsæk, Kampvest | Flashlight, Alarm Clock, Energy Drink, Backpack, Kevlar Vest |
| Haglgevær, Kikkert                                | Shotgun, Binoculars                                          |
| Forsyningspakke, støj, skumring, handlingspoint   | Supply pack, noise, dusk, AP                                 |

Forslag til engelsk titel: **One More Building** (navngiver spillets kernebeslutning). Ikke besluttet.

---

## 11. Runde 3: godt deckbuilding – research og forslag

**Ønske:** Spillet skal have interessante valg, og deckbuilding skal være interessant med synergi mellem kort og en reel grund til at tynde ud i dækket ("trash").

### Hvad kendetegner et godt deckbuilding-spil (research)

| Princip                                   | Eksempel fra andre spil                                                                                          | Hos os                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Helheden er større end delene             | Slay the Spire bygger løkken på synergier; i Monster Train slår 10 kort med synergi 30 løse kort                 | Tags + "Follow-up"                                                  |
| Dækket er en pose, man trækker blindt fra | Hvert nyt kort fortynder de bedste kort                                                                          | Skip/skrot ved søgning; Travel Light belønner et tyndt dæk          |
| Udtynding skal koste noget                | Dominion: en tur brugt på at fjerne kort er en tur uden fremgang. Uden sen fortynding bliver udtynding for stærk | Hver måde har en pris; Heavy Load kan ikke fjernes                  |
| Der skal være noget at fjerne             | Svage startkort, sår, træthed og forbandelser (Thornwatch, Nightfall, Signs of the Sojourner)                    | Nerves i startdækket, Heavy Load fra pakker, Wound som variant      |
| "Brug op"-valg                            | Star Realms: kort fjerner sig selv for en engangsbonus                                                           | "Use up"                                                            |
| Flere veje til sejr                       | Dominion: engine mod big money; klare spillestile i Slay the Spire og Monster Train                              | Fire spillestile; en enkel "stærke kort"-strategi skal stadig virke |
| Presset skal stige                        | Clank!: dragens vrede vokser gennem spillet                                                                      | Skumring, støj, Heavy Load                                          |
| Interessante valg                         | Sid Meier: ingen mulighed altid bedst; oplyst valg; ligegyldige valg koster tankekraft                           | Tjekliste pr. beslutning                                            |
| Plads til at udtrykke sig                 | Det sjoveste er at finde på sin egen strategi                                                                    | Bots i M6 skal vise, at flere veje virker                           |

Nærmeste slægtning er Clank! (deckbuilding, push your luck, larm, "kom levende hjem"). Vi låner ingen regler, navne eller tekst.

### Egen analyse: hvornår gør skrammel ondt?

Med 5 kort på hånden og 3 AP koster et dødt kort sjældent en handling; det koster valgmuligheder. Udtynding bliver først rigtig vigtig, når to bestemte kort skal mødes på samme hånd:

| Dæk     | Ét bestemt kort (5/N) | To bestemte kort (20/(N·(N−1))) |
| ------- | --------------------- | ------------------------------- |
| 8 kort  | 63 %                  | 36 %                            |
| 12 kort | 42 %                  | 15 %                            |
| 16 kort | 31 %                  | 8 %                             |

Derfor både "Follow-up"-kombinationer og Heavy Load, der gør den gratis bevægelse dyrere, mens den er på hånden.

### Forslag 6–10 (besluttet)

| #   | Forslag                  | Regel                                                                                                                                                                                                                                                                           |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | Tags og Follow-up        | Tags: Quiet, Weapon, Move, Tool, Med. "Follow-up X: …" virker kun, hvis et kort med tag X allerede er spillet i denne tur. Rækkefølgen bliver et valg.                                                                                                                          |
| 7   | Use up                   | Udvalgte kort har en stærkere engangseffekt; derefter fjernes kortet.                                                                                                                                                                                                           |
| 8   | Skrammelkort             | Nerves ×2 i startdækket (unplayable). Hver pakke giver et Heavy Load (unplayable, kan ikke fjernes, gør den gratis bevægelse til 1 AP, mens det er på hånden). **Ændrer oplæggets "pakker fylder ikke i dækket".** Wound testes som variant (fås ved 2+ skade i én zombiefase). |
| 9   | Fem måder at tynde ud på | Skrot ved søgning (koster fundet) · Use up (koster kortets faste værdi) · Toolbox/Painkillers (koster et fundvalg og AP) · Workshop "Dismantle" (1 AP + omvej) · Pharmacy "Patch up" (1 AP + omvej; kun Nerves/Wound).                                                          |
| 10  | Nyt kortsæt              | Startdæk: Search ×3, Crowbar ×2, Run ×2, Sneak ×1, Nerves ×2. 16 fundkort i fire spillestile (se nedenfor).                                                                                                                                                                     |

### Kortsæt (spiltekst på engelsk)

| Kort          | AP  | Tags        | Effekt                                                                                                    | Findes i                      |
| ------------- | --- | ----------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Soft Soles    | 1   | Move, Quiet | Move 1. Zombies where you arrive don't notice you this turn.                                              | Houses                        |
| Lockpick      | 1   | Tool, Quiet | Search here with no noise. Follow-up Quiet: reveal +1 find.                                               | Workshop                      |
| Flashlight    | 0   | Tool, Quiet | Your next search this turn reveals +1 find. Follow-up Tool: draw 1 card.                                  | Workshop, houses              |
| Alarm Clock   | 1   | Quiet       | Use up: zombies here don't attack this turn and lose track of you.                                        | Supermarket, houses           |
| Baseball Bat  | 1   | Weapon      | Deal 1 damage. Draw 1 card.                                                                               | Houses, police                |
| Axe           | 1   | Weapon      | Deal 2 damage. Follow-up Weapon: +1 damage.                                                               | Workshop                      |
| Pistol        | 1   | Weapon      | Deal 3 damage. +2 noise.                                                                                  | Police                        |
| Molotov       | 1   | Weapon      | Use up: deal 2 damage to every zombie here. +2 noise. This building can't be searched again.              | Workshop                      |
| Kevlar Vest   | 1   | –           | Prevent up to 2 damage this turn. Follow-up Weapon: prevent 3 instead.                                    | Police                        |
| Running Shoes | 1   | Move        | Move up to 2. Follow-up Move: draw 1 card.                                                                | Supermarket, houses           |
| Adrenaline    | 0   | Move        | Gain 2 AP. Lose 1 health.                                                                                 | Pharmacy                      |
| Travel Light  | 0   | Move        | If you own 10 or fewer cards: gain 1 AP and draw 1 card.                                                  | Supermarket, houses           |
| Toolbox       | 1   | Tool        | Trash a card from your hand. Follow-up Tool: draw 1 card.                                                 | Workshop                      |
| District Map  | 0   | Tool        | See the exact zombies in a building within 2 steps, and whether it has a pack. Use up: see all buildings. | Police, houses                |
| Bandage       | 1   | Med         | Heal 1. Use up: heal 3 instead.                                                                           | Pharmacy, houses, supermarket |
| Painkillers   | 0   | Med         | Trash a Nerves or Wound from your hand. Draw 1 card.                                                      | Pharmacy, supermarket         |

Erstatter fundkortene i afsnit 3.4 (First Aid, Energy Drink, Backpack, Shotgun og Binoculars udgår), hvis forslagene godkendes.

**Fire spillestile:** Stille (Flashlight → Lockpick, Soft Soles, søg i fred) · Kæmper (Baseball Bat → Axe, Kevlar Vest) · Løber (Travel Light → Running Shoes, Adrenaline) · Let bagage (Toolbox, Workshop, Travel Light).

**Datamodel:** `CardDef` får `tags: Tag[]`, og `Effect` får `{ kind: 'trash'; filter?: 'junk' }`. Follow-up og Use up modelleres som `modes` med betingelse (`requiresTagPlayed`) og flaget `trashAfter`. `GameState` tæller spillede tags pr. tur.

### Kilder

- Game Maker's Toolkit: Why Synergies are the Secret to Slay the Spire's Fun – https://amara.org/v/C3BET
- PC Gamer: Monster Train review – https://www.pcgamer.com/monster-train-review/
- Deck Thinning in Slay the Spire 2 – https://metabot.gg/en/slay-the-spire-2/guides/deck-thinning-and-deck-size
- Deck Building – a Modern Card Mechanism – https://tabletopgamesblog.com/2023/05/23/deck-building-a-modern-card-mechanism-topic-discussion
- Wikipedia: Roguelike deck-building game – https://en.wikipedia.org/wiki/Roguelike_deck-building_game
- Dominion Strategy: The Five Fundamental Deck Types – The Engine – https://dominionstrategy.com/2013/01/23/the-five-fundamental-deck-types-the-engine/
- Star Realms rulebook (ally and scrap abilities) – https://rulespal.com/star-realms/rulebook
- Casual Game Revolution: Clank! review – https://casualgamerevolution.com/node/1898
- Opinionated Gamers: First impressions of Nightfall – https://opinionatedgamers.com/2011/02/12/first-impressions-of-nightfall-aeg/
- Innovating Junk Cards in Signs of the Sojourner – https://saturshot.substack.com/p/innovating-junk-cards-in-signs-of
- Game Developer: Designing interesting decisions in games – https://www.gamedeveloper.com/design/designing-interesting-decisions-in-games-and-when-not-to-
- Bugnet: How to design a deck building game – https://bugnet.io/blog/how-to-design-a-deck-building-game

---

## 12. Version 2: kampagne med base, mad og vand

**Status:** Besluttet retning. Bygges efter M8, når selve ekspeditionen er testet og sjov. Oplægget udskød basebygning og kampagne; det passer med denne rækkefølge.

**Idé:** Én dag er én ekspedition. Mellem dagene spiser og drikker man, bygger på basen og høster det, basen producerer. Målet er at overleve 7 dage.

### Dagsløkken

1. **Morgen:** Dækket nulstilles til startdækket. Basens forbedringer og gårsdagens straffe lægges på (`ExpeditionSetup`).
2. **Ekspedition:** Prototypens spil (15–25 min).
3. **Hjem:** Mad, vand og materialer tælles op (`ExpeditionResult`).
4. **Aften:** Brug 1 mad og 1 vand. Mangel giver straf næste dag.
5. **Byg:** Brug materialer på forbedringer.
6. **Nat:** Køkkenhave og regnvandsopsamler producerer. Dag +1; byen bliver farligere.

### Regler

| Emne        | Regel                                                                                                                                                       | Startværdi                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Mad og vand | Forsyningspakker _er_ mad eller vand; typen ses, når pakken findes. 2 pakker = én dags forbrug (samme mål som prototypen). Ekstra pakker gemmes på lageret. | Forbrug 1 mad + 1 vand pr. aften |
| Sult        | Næste ekspedition starter med et ekstra Nerves-kort.                                                                                                        | +1 Nerves                        |
| Tørst       | Næste ekspedition starter med færre liv.                                                                                                                    | −2 liv                           |
| Materialer  | Ny slags fund i "vælg 1 af 3" (kort navn: Salvage). Hvert materiale lægger et Heavy Load i dækket på vej hjem: "alt, du bærer hjem, tynger".                | 1 materialetype                  |
| Dækket      | Nulstilles hver morgen. Locker kan beholde ét fundet kort.                                                                                                  | –                                |
| Byen        | Husker plyndrede bygninger (færre søgninger) og får flere zombier hver dag.                                                                                 | +1 zombie pr. dag                |
| Længde      | 7 dage. Kampagnen gemmes i browseren mellem dagene.                                                                                                         | 7 dage                           |

### Forbedringer (tekst på engelsk, som i spillet)

| Forbedring                         | Pris (materialer) | Effekt                                                                 | Type                          |
| ---------------------------------- | ----------------- | ---------------------------------------------------------------------- | ----------------------------- |
| Lookout (Udkigspost)               | 2                 | At the start of each expedition, see the exact zombies in 2 buildings. | Virker fra næste dag          |
| Workbench (Værkbænk)               | 3                 | Start each expedition with one Nerves fewer.                           | Virker fra næste dag          |
| Infirmary (Sygestue)               | 3                 | Start each expedition with +2 health.                                  | Virker fra næste dag          |
| Locker (Våbenskab)                 | 4                 | Keep 1 card you found for the next expedition.                         | Virker fra næste dag          |
| Rain Collector (Regnvandsopsamler) | 4                 | +1 water every second night.                                           | Investering                   |
| Garden (Køkkenhave)                | 6                 | +1 food every second night.                                            | Investering, betaler sig sent |

Samlet pris 22 materialer. En kampagne forventes at give cirka 14–20, så man kan ikke bygge alt. Tallene justeres med bot-simulering.

### Nye valg

- **Kort eller materiale?** En stærkere ekspedition i dag eller en bedre base i morgen.
- **Hvor meget bærer jeg hjem?** Flere materialer giver flere Heavy Load og en farligere hjemtur.
- **Byg nu eller spar?** Garden betaler sig først efter flere dage; Infirmary hjælper i morgen.
- **Spis lageret eller tag ud igen?** Lageret redder en dårlig dag, men byen bliver farligere hver dag.

### Kompleksitetsbudget

- **Med:** mad, vand, én materialetype, seks forbedringer, 7 dage, dæk der nulstilles hver morgen.
- **Ikke med:** sult- eller tørstmålere under ekspeditionen, flere materialetyper, opskrifter (crafting), et dæk der vokser fra dag til dag.
- **Ekspeditionen får kun én ny regel:** materialer som fund.

### Milepæle for version 2

| #   | Milepæl             | Indhold                                                         | Færdig når                                |
| --- | ------------------- | --------------------------------------------------------------- | ----------------------------------------- |
| K1  | Dagsløkke           | Dage, aftensmad, straf ved mangel, gem kampagnen i browseren.   | 3 dage i træk kan spilles og genoptages.  |
| K2  | Base og materialer  | Materialer som fund, baseskærm, de seks forbedringer.           | Forbedringer ændrer næste ekspedition.    |
| K3  | Byen udvikler sig   | Plyndrede bygninger, flere zombier, produktion om natten.       | Dag 7 føles tydeligt farligere end dag 1. |
| K4  | Balance over 7 dage | Bot-spillere spiller hele kampagner; playtest med 2–3 personer. | Flere byggerækkefølger kan overleve.      |

### Forberedelse i prototypen

Regelmotoren tager imod en `ExpeditionSetup` og afleverer et `ExpeditionResult` (se afsnit 5). Det koster næsten intet nu og gør kampagnen til et lag ovenpå, uden at ekspeditionen skal skrives om.

### Åbne spørgsmål (til senere)

1. **Død i kampagnen:** Anbefaling: man mister dagens fund og starter næste dag med 2 Wound-kort. Sker det to gange, er kampagnen slut.
2. **Antal dage:** 7 som start; justeres efter playtest.
