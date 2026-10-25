# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 68 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 65 % og 84 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 54 % af spillene, men får ★★★ i 13 %.
- Spillene slutter i gennemsnit i tur 4,9.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 50 % | 49 % | 8,7 | 4,3 | 9,8 | 0,7 | 1,5 |
| Skynd dig hjem | 68 % | 68 % | 0 % | 0 % | 32 % | 0 % | 3,7 | 4,6 | 11,5 | 0,0 | 0,4 |
| Grådig | 46 % | 18 % | 16 % | 13 % | 54 % | 0 % | 5,2 | 2,4 | 19,0 | 6,9 | 0,5 |
| Stille | 65 % | 32 % | 33 % | 0 % | 35 % | 0 % | 4,7 | 3,8 | 18,4 | 6,6 | 0,5 |
| Kæmper | 81 % | 36 % | 45 % | 0 % | 19 % | 0 % | 5,7 | 4,5 | 18,9 | 7,0 | 0,6 |
| Løber | 84 % | 41 % | 43 % | 0 % | 16 % | 0 % | 5,1 | 4,5 | 18,7 | 6,6 | 0,4 |
| Let bagage | 74 % | 33 % | 40 % | 0 % | 26 % | 0 % | 5,1 | 4,0 | 15,9 | 5,3 | 1,8 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,7 | 5,3 | 0,2 | 0,4 | 0,3 | 0,0 | 1,7 | 0,2 |
| Skynd dig hjem | 27 % | 4,1 | 2,2 | 0,7 | 0,0 | 0,4 | 0,0 | 2,9 | 0,0 |
| Grådig | 48 % | 5,0 | 3,7 | 1,7 | 0,0 | 0,9 | 0,0 | 4,0 | 1,9 |
| Stille | 28 % | 4,8 | 2,3 | 1,5 | 0,0 | 0,9 | 0,0 | 4,0 | 0,2 |
| Kæmper | 15 % | 3,4 | 2,5 | 1,6 | 0,0 | 0,6 | 0,0 | 4,0 | 2,3 |
| Løber | 12 % | 3,2 | 2,2 | 1,6 | 0,0 | 0,5 | 0,0 | 4,0 | 1,4 |
| Let bagage | 23 % | 3,9 | 2,4 | 1,5 | 0,0 | 0,6 | 0,0 | 3,9 | 1,3 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,6 | 3,8 | 0,5 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,5 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,8 | 1,8 |
| Stille | 0,5 | 0,0 | 0,2 | 0,6 | 1,3 |
| Kæmper | 0,3 | 0,0 | 0,2 | 0,5 | 1,4 |
| Løber | 0,4 | 0,0 | 0,2 | 0,5 | 1,5 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 1,1 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 375 | 434 | 106 | 29 | 47 | 131 | 63 |
| alarmClock | 338 | 35 | 70 | 149 | 66 | 36 | 18 |
| bicycle | 324 | 249 | 82 | 56 | 39 | 93 | 54 |
| bandage | 271 | 39 | 93 | 15 | 87 | 48 | 28 |
| baseballBat | 240 | 73 | 66 | 5 | 96 | 43 | 32 |
| knife | 218 | 109 | 34 | 68 | 75 | 28 | 13 |
| painkillers | 186 | 105 | 23 | 4 | 25 | 15 | 119 |
| chainsaw | 175 | 31 | 40 | 31 | 52 | 30 | 23 |
| bow | 150 | 62 | 27 | 51 | 47 | 14 | 11 |
| softSoles | 147 | 70 | 1 | 27 | 1 | 119 | 0 |
| axe | 133 | 94 | 36 | 3 | 60 | 29 | 4 |
| flashlight | 129 | 155 | 23 | 50 | 28 | 18 | 11 |
| toolbox | 125 | 27 | 6 | 0 | 2 | 5 | 113 |
| silentTakedown | 106 | 0 | 18 | 62 | 14 | 8 | 5 |
| crossbow | 95 | 78 | 21 | 27 | 19 | 10 | 16 |
| shotgun | 73 | 19 | 18 | 12 | 16 | 11 | 16 |
| lockpick | 69 | 54 | 4 | 61 | 1 | 3 | 0 |
| firstAidKit | 43 | 5 | 18 | 5 | 13 | 6 | 2 |
| adrenaline | 20 | 11 | 1 | 0 | 0 | 19 | 0 |
| molotov | 13 | 3 | 0 | 0 | 13 | 0 | 0 |
| travelLight | 6 | 7 | 0 | 0 | 0 | 0 | 6 |
| headShot | 4 | 1 | 2 | 0 | 1 | 0 | 0 |
| kevlarVest | 1 | 0 | 1 | 0 | 0 | 0 | 0 |
| pistol | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 68 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 29 % og med 4 i 13 %, men dør på vej hjem i 48 %.
- **Kan flere spillestile vinde?** Stille 65 %, Kæmper 81 %, Løber 84 %, Let bagage 74 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, silentTakedown · Kæmper: baseballBat, bandage, knife · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): headShot, kevlarVest, pistol, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 68 % | 46 % (★★★ 13 %) | 65 % | 81 % | 84 % | 74 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 88 % | 53 % (★★★ 17 %) | 73 % | 86 % | 85 % | 83 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 93 % | 60 % (★★★ 30 %) | 63 % | 73 % | 87 % | 77 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 77 % | 64 % (★★★ 8 %) | 75 % | 86 % | 91 % | 83 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 62 % | 47 % (★★★ 14 %) | 61 % | 72 % | 78 % | 65 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 65 % | 46 % (★★★ 15 %) | 63 % | 79 % | 81 % | 69 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 55 % | 43 % (★★★ 3 %) | 55 % | 73 % | 73 % | 67 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 37 % (★★★ 8 %) | 51 % | 66 % | 72 % | 65 % |
| Fund i afkastbunken (`findsToHand=false`) | 65 % | 32 % (★★★ 9 %) | 51 % | 64 % | 69 % | 67 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 42 % (★★★ 11 %) | 62 % | 74 % | 83 % | 68 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 55 % (★★★ 19 %) | 67 % | 88 % | 90 % | 79 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 63 % | 21 % (★★★ 5 %) | 42 % | 60 % | 62 % | 52 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 65 % | 46 % (★★★ 15 %) | 64 % | 79 % | 79 % | 69 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 65 % | 45 % (★★★ 16 %) | 60 % | 81 % | 84 % | 74 % |
| 10 liv (`maxHp=10`) | 69 % | 49 % (★★★ 17 %) | 66 % | 83 % | 82 % | 77 % |
| 8 liv (`maxHp=8`) | 60 % | 49 % (★★★ 11 %) | 58 % | 76 % | 75 % | 66 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 42 % | 33 % (★★★ 7 %) | 38 % | 60 % | 62 % | 50 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 31 % | 17 % (★★★ 1 %) | 34 % | 46 % | 49 % | 39 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 65 % | 47 % (★★★ 12 %) | 70 % | 82 % | 81 % | 74 % |

## Botterne

- **Tilfældig** (`random`): Vælger en tilfældig lovlig handling. Nedre grænse og fuzz-test.
- **Skynd dig hjem** (`rush`): Fast rute uden valg: nærmeste bygning med chance for en pakke, ingen fund, ingen kamp, hjem ved 2 pakker.
- **Grådig** (`greedy`): Går efter alle 4 pakker (★★★), tager fund og kæmper. Går først hjem i sidste øjeblik.
- **Stille** (`quiet`): Forsigtig, går efter ★★. Foretrækker stille kort og sniger sig uden om kamp.
- **Kæmper** (`fighter`): Forsigtig, går efter ★★. Foretrækker våben og Kevlar Vest.
- **Løber** (`runner`): Forsigtig, går efter ★★. Foretrækker bevægelseskort.
- **Let bagage** (`light`): Forsigtig, går efter ★★. Tynder dækket ud (Toolbox, Workshop, Travel Light).

## Fejl

Ingen. Alle regler blev tjekket efter hver handling i alle spil.
