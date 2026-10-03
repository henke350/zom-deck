# Sidste tur ud (One More Building)

Et lille, turbaseret singleplayer-spil i 2D om en overlevende i en zombieapokalypse.
Spillet kombinerer deckbuilding, udforskning og push your luck og kører i browseren.
Al tekst i spillet er på engelsk; "One More Building" er en arbejdstitel.

- **Plan og beslutninger:** [docs/plan.md](docs/plan.md)
- **Visuelt overblik:** https://claude.ai/artifact/XnjVimEtZRq8AUFBc4VR9Z (privat, indtil det deles)
- **Status:** M0 (projektopsætning) er færdig. Næste milepæl er M1: dæk og ture.

## Sådan kører du spillet lokalt

Kræver [Node.js](https://nodejs.org/) version 22 eller nyere.

```
npm install      # henter værktøjer og biblioteker (kun første gang)
npm run dev      # starter spillet på http://localhost:5173
```

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
