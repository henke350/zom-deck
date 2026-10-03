# Sidste tur ud (One More Building)

Et lille, turbaseret singleplayer-spil i 2D om en overlevende i en zombieapokalypse.
Spillet kombinerer deckbuilding, udforskning og push your luck og kører i browseren.
Al tekst i spillet er på engelsk; "One More Building" er en arbejdstitel.

- **Plan og beslutninger:** [docs/plan.md](docs/plan.md)
- **Visuelt overblik:** https://claude.ai/artifact/XnjVimEtZRq8AUFBc4VR9Z (privat, indtil det deles)
- **Spil prototypen i browseren:** https://claude.ai/artifact/1HKHPRedxcpRYNSh6GNZVY (privat, indtil det deles; opdateres ved hver milepæl)
- **Status:** M0–M4 er færdige. Byen har nu zombier, støj og kamp. Næste milepæl er M5: den første hele ekspedition med slutskærm og regelskærm.

## Sådan kører du spillet lokalt

Kræver [Node.js](https://nodejs.org/) version 22 eller nyere.

```
npm install      # henter værktøjer og biblioteker (kun første gang)
npm run dev      # starter spillet på http://localhost:5173
```

## Sådan prøver du spillet (M4)

1. Klik **Start expedition**.
2. Klik på et af de stiplede nabosteder på kortet for at gå dertil gratis (én gang pr. tur).
3. Spil kort med **Play**. Kort som Run beder dig vælge et sted på kortet; Toolbox beder dig vælge et kort at fjerne.
4. Klik **Keep** på ét kort for at gemme det til næste tur, og klik **End turn**.
5. Stå i en bygning og spil **Search**, eller brug **Quick search** i sidepanelet (2 AP, ingen kort). Vælg ét fund, skrot et kort fra hånden, eller tag ingenting.
6. Supermarket har altid en forsyningspakke; tre andre ligger tilfældigt. Hver pakke lægger et Heavy Load i dit dæk.
7. Gå ind i Shelter med mindst 2 pakker for at vinde (3 pakker = ★★, 4 = ★★★).
8. **Zombier:** Bygninger viser et spænd ("1–2?"), indtil du går ind. Zombier, der har set dig (prik med ring), følger ét skridt efter dig og angriber, når turen slutter. Kom to skridt væk, snig dig (Sneak) eller slå dem ned (Crowbar, Axe, Pistol).
9. **Støj:** Search og skud larmer. Ved 4 støj ankommer en ny zombie. Fra tur 8 (skumring) stiger støjen hver tur.
10. Teksten ved **End turn** viser, hvad der sker, når du afslutter turen, fx "2 zombies will attack: −2 health".
11. Grå knapper viser altid, hvorfor de ikke kan bruges.

Tilføj `?seed=4711` til adressen for at spille den samme by igen.

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
