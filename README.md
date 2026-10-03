# Sidste tur ud (One More Building)

Et lille, turbaseret singleplayer-spil i 2D om en overlevende i en zombieapokalypse.
Spillet kombinerer deckbuilding, udforskning og push your luck og kører i browseren.
Al tekst i spillet er på engelsk; "One More Building" er en arbejdstitel.

- **Plan og beslutninger:** [docs/plan.md](docs/plan.md)
- **Visuelt overblik:** https://claude.ai/artifact/XnjVimEtZRq8AUFBc4VR9Z (privat, indtil det deles)
- **Status:** M0–M2 er færdige. Du kan gå rundt i byen og spille kort. Næste milepæl er M3: søgning, fund og forsyningspakker.

## Sådan kører du spillet lokalt

Kræver [Node.js](https://nodejs.org/) version 22 eller nyere.

```
npm install      # henter værktøjer og biblioteker (kun første gang)
npm run dev      # starter spillet på http://localhost:5173
```

## Sådan prøver du spillet (M2)

1. Klik **Start expedition**.
2. Klik på et af de stiplede nabosteder på kortet for at gå dertil gratis (én gang pr. tur).
3. Spil kort med **Play**. Kort som Run beder dig vælge et sted på kortet; Toolbox beder dig vælge et kort at fjerne.
4. Klik **Keep** på ét kort for at gemme det til næste tur, og klik **End turn**.
5. Grå knapper viser, hvorfor de ikke kan bruges endnu. Søgning kommer i M3 og zombier i M4.

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
