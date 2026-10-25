# Sidste tur ud (One More Building)

Et lille, turbaseret singleplayer-spil i 2D om en overlevende i en zombieapokalypse.
Spillet kombinerer deckbuilding, udforskning og push your luck og kører i browseren.
Al tekst i spillet er på engelsk; "One More Building" er en arbejdstitel.

- **Plan og beslutninger:** [docs/plan.md](docs/plan.md)
- **Visuelt overblik:** https://claude.ai/artifact/XnjVimEtZRq8AUFBc4VR9Z (privat, indtil det deles)
- **Spil prototypen i browseren:** https://claude.ai/artifact/1HKHPRedxcpRYNSh6GNZVY (privat, indtil det deles; opdateres ved hver milepæl)
- **Status:** M0–M6 er bygget, og M7 (playtest og justering) er i gang. Første justering efter simuleringen: 9 liv og Run ×1 / Search ×4 i startdækket. Nyt: sjældne fund og låste gemmesteder. Nu mangler playtest med rigtige spillere.
- **Playtest-skema:** https://claude.ai/artifact/1WDft2tZ33fJ1oLQLTExcQ (del med testerne som Contributor)
- **Balancerapport:** [docs/balance-report.md](docs/balance-report.md) (lavet af `npm run sim`)

## Sådan kører du spillet lokalt

Kræver [Node.js](https://nodejs.org/) version 22 eller nyere.

```
npm install      # henter værktøjer og biblioteker (kun første gang)
npm run dev      # starter spillet på http://localhost:5173
```

## Sådan prøver du spillet (M6)

1. Klik **Start expedition**. Første gang vises reglerne på én side. Du kan altid åbne dem igen med **How to play** på forsiden eller **Rules** i toplinjen.
2. **Hver by er ny:** byen har 10 bygninger på et kort på 5 × 3 felter. Bygningerne vælges og placeres tilfældigt, og en bygning står som _Unknown_, indtil du har stået ved siden af den. Længst væk ligger _downtown_ med de farlige, rige bygninger (Police Station, Hospital, Apartment Block, Sports Shop). Find Supermarket – den har altid en pakke.
3. Klik på et af de stiplede nabosteder på kortet for at gå dertil gratis (én gang pr. tur).
4. Spil kort med **Play**. Kort som Run beder dig vælge et sted på kortet; Toolbox beder dig vælge et kort at fjerne.
5. Klik **Keep** på ét kort for at gemme det til næste tur, og klik **End turn**.
6. Stå i en bygning og spil **Search**, eller brug **Quick search** i sidepanelet (2 AP, ingen kort). Vælg ét fund, skrot et kort fra hånden, eller tag ingenting.
7. Supermarket har altid en forsyningspakke; fire andre ligger tilfældigt. Hver pakke lægger et Heavy Load i dit dæk.
8. Gå ind i Shelter med mindst 2 pakker for at vinde (3 pakker = ★★, 4 = ★★★). Spillet spørger først **Go home now?**, så du kan vælge at tage én bygning mere.
9. **Zombier:** Bygninger viser et spænd ("1–2?"), indtil du går ind. Zombier, der har set dig (prik med ring), følger efter dig og angriber, når turen slutter. Kom to skridt væk, snig dig (Sneak) eller slå dem ned (Crowbar, Axe, Pistol). Der er fire typer, vist med et bogstav i prikken: **W**alker (følger 1 skridt), **R**unner (hurtig, følger 2 skridt, 1 liv), **B**rute (4 liv, slår for 2, følger aldrig) og **S**creamer (bider ikke, men skriger og laver støj).
10. **Støj:** Search og skud larmer. Ved 4 støj ankommer en ny zombie. Fra tur 8 (skumring) stiger støjen hver tur.
11. **Fare (Danger):** Starter på 1 og stiger for hver pakke og hvert sjældent fund (op til 4). Nye zombier bliver hurtigere og hårdere, men fundene bliver også bedre: fra fare 3 giver hver søgning +1 fund, og sjældne fund dukker oftere op.
12. **Fund og drab:** Et fund, du tager, kommer direkte på hånden. Dræber du en zombie, kan du gennemsøge liget og tage et fund mere (en Brute bærer mere).
13. **Gear:** Kevlar Vest, Running Shoes og Flashlight bliver liggende foran dig (rækken over hånden) og virker hver tur, til de slides op. Så ryger de i afkastbunken.
14. **Stille våben:** Knife, Bow og Crossbow larmer ikke. Bow og Crossbow kan ramme en zombie ét skridt væk, hvis du kan se den (gade eller en bygning, du har været i). **Head Shot** dræber en zombie, hvis du har spillet et våben først; **Silent Takedown** dræber en zombie, der ikke har set dig.
15. Teksten ved **End turn** viser, hvad der sker, når du afslutter turen, fx "2 zombies will attack: −2 health".
16. Grå knapper viser altid, hvorfor de ikke kan bruges.
17. **Sjældne fund** har guldkant og mærket _Rare_. To bygninger gemmer et **låst gemmested**, som findes, når man søger dér. Åbn det i sidepanelet med et Tool-kort (1 AP) eller bryd det op (2 AP, +2 støj), og vælg 1 af 2 sjældne fund.
18. **Workshop** og **Pharmacy** har en tjeneste i sidepanelet: Dismantle fjerner et kort fra hånden, Patch up fjerner Nerves eller Wound. Hver koster 1 AP.
19. Når ekspeditionen slutter (hjem, død eller mørke), forklarer slutskærmen hvorfor, giver et tip og viser tallene. **Same city again** spiller samme by igen, **New expedition** giver en ny.

Tilføj `?seed=4711` til adressen for at spille den samme by igen.

## Spil på tablet (app)

Spillet kan installeres som app på en Android-tablet (en PWA: en hjemmeside, der installeres som app med eget ikon og fuld skærm). Det kræver net. Det er lavet til en tablet på langs: alt er på én skærm, og knapperne er store nok til fingre.

1. **Én gang:** slå GitHub Pages til i repoet: _Settings → Pages → Source: "GitHub Actions"_. Derefter bygges og udgives spillet automatisk ved hver ændring på main (`.github/workflows/pages.yml`).
2. Åbn **https://henke350.github.io/zom-deck/** i Chrome på tabletten, og vælg menuen **⋮ → Installér app** (eller "Føj til startskærm").
3. Appen åbner i fuld skærm på langs og viser altid den nyeste udgave.

På en berøringsskærm viser første tryk på et sted på kortet, hvad der er der; andet tryk (eller **Go here**) går derhen.

## Balance og simulering

```
npm run sim                              # 7 bots spiller 1.000 spil hver → docs/balance-report.md
npm run sim -- --set maxHp=8             # prøv et andet balancetal (rapporten havner i .sim/)
npm run sim -- --set turnLimit=8 --set duskFromTurn=6
npm run fuzz                             # 10.000 tilfældige spil; alle regler tjekkes efter hver handling
npm run print                            # print-and-play-ark → print/print-and-play.html (udskriv eller gem som PDF)
npm run print -- --no-card-backs         # uden bagsider til kortene (til sleeves med sort bagside)
```

Navnene efter `--set` er dem i `src/data/balance.ts`. Botterne ser kun det, en spiller ser på
skærmen. Rapporten har et afsnit "Hvad hvis?", der viser effekten af de vigtigste justeringer.

## Kontroller

```
npm test         # kører de automatiske tests
npm run check    # alt det, den automatiske kontrol på GitHub tjekker
```

Den automatiske kontrol (GitHub Actions) kører lint, formatering, typekontrol, tests og
build ved hvert push.

## Illustrationer

Kort- og stedillustrationerne er lavet med en AI-billedgenerator ud fra prompts i `docs/`
(`card-art-prompt.md`, `card-art/cards.json` og `location-art/prompt.md`). Spillet bruger små
WebP-filer i `src/assets/cards/` og `src/assets/locations/`; originalerne ligger i `art-source/`.
Filnavnet er kortets eller stedets id, så et nyt billede findes automatisk.
De 14 manglende billeder (nye kort og steder) laves med prompten i
`docs/art-prompts-m8.md` (til Codex eller ChatGPT).

## Teknik

TypeScript, React og Vite. Vitest til tests, oxlint og Prettier til kodekvalitet.
Ingen server, konti eller database. Projektregler for AI-agenter står i
[CLAUDE.md](CLAUDE.md).
