# Sidste tur ud (One More Building)

Et lille, turbaseret singleplayer-spil i 2D om en overlevende i en zombieapokalypse.
Spillet kombinerer deckbuilding, udforskning og push your luck og kører i browseren.
Al tekst i spillet er på engelsk; "One More Building" er en arbejdstitel.

- **Plan og beslutninger:** [docs/plan.md](docs/plan.md)
- **Visuelt overblik:** https://claude.ai/artifact/XnjVimEtZRq8AUFBc4VR9Z (privat, indtil det deles)
- **Spil prototypen i browseren:** https://claude.ai/artifact/1HKHPRedxcpRYNSh6GNZVY (privat, indtil det deles; opdateres ved hver milepæl)
- **Status:** M0–M6 er bygget. En hel ekspedition kan spilles fra start til slut, og bot-spillere måler balancen. Næste milepæl er M7: playtest og justering.
- **Balancerapport:** [docs/balance-report.md](docs/balance-report.md) (lavet af `npm run sim`)

## Sådan kører du spillet lokalt

Kræver [Node.js](https://nodejs.org/) version 22 eller nyere.

```
npm install      # henter værktøjer og biblioteker (kun første gang)
npm run dev      # starter spillet på http://localhost:5173
```

## Sådan prøver du spillet (M6)

1. Klik **Start expedition**. Første gang vises reglerne på én side. Du kan altid åbne dem igen med **How to play** på forsiden eller **Rules** i toplinjen.
2. Klik på et af de stiplede nabosteder på kortet for at gå dertil gratis (én gang pr. tur).
3. Spil kort med **Play**. Kort som Run beder dig vælge et sted på kortet; Toolbox beder dig vælge et kort at fjerne.
4. Klik **Keep** på ét kort for at gemme det til næste tur, og klik **End turn**.
5. Stå i en bygning og spil **Search**, eller brug **Quick search** i sidepanelet (2 AP, ingen kort). Vælg ét fund, skrot et kort fra hånden, eller tag ingenting.
6. Supermarket har altid en forsyningspakke; tre andre ligger tilfældigt. Hver pakke lægger et Heavy Load i dit dæk.
7. Gå ind i Shelter med mindst 2 pakker for at vinde (3 pakker = ★★, 4 = ★★★). Spillet spørger først **Go home now?**, så du kan vælge at tage én bygning mere.
8. **Zombier:** Bygninger viser et spænd ("1–2?"), indtil du går ind. Zombier, der har set dig (prik med ring), følger ét skridt efter dig og angriber, når turen slutter. Kom to skridt væk, snig dig (Sneak) eller slå dem ned (Crowbar, Axe, Pistol).
9. **Støj:** Search og skud larmer. Ved 4 støj ankommer en ny zombie. Fra tur 8 (skumring) stiger støjen hver tur.
10. Teksten ved **End turn** viser, hvad der sker, når du afslutter turen, fx "2 zombies will attack: −2 health".
11. Grå knapper viser altid, hvorfor de ikke kan bruges.
12. **Workshop** og **Pharmacy** har en tjeneste i sidepanelet: Dismantle fjerner et kort fra hånden, Patch up fjerner Nerves eller Wound. Hver koster 1 AP.
13. Når ekspeditionen slutter (hjem, død eller mørke), forklarer slutskærmen hvorfor, giver et tip og viser tallene. **Same city again** spiller samme by igen, **New expedition** giver en ny.

Tilføj `?seed=4711` til adressen for at spille den samme by igen.

## Balance og simulering

```
npm run sim                              # 7 bots spiller 1.000 spil hver → docs/balance-report.md
npm run sim -- --set maxHp=9             # prøv et andet balancetal (rapporten havner i .sim/)
npm run sim -- --set maxHp=9 --set starterDeck.run=1 --set starterDeck.search=4
npm run fuzz                             # 10.000 tilfældige spil; alle regler tjekkes efter hver handling
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

## Teknik

TypeScript, React og Vite. Vitest til tests, oxlint og Prettier til kodekvalitet.
Ingen server, konti eller database. Projektregler for AI-agenter står i
[CLAUDE.md](CLAUDE.md).
