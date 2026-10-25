# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 58 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 62 % og 79 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 49 % af spillene, men får ★★★ i 5 %.
- Spillene slutter i gennemsnit i tur 5,4.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 49 % | 51 % | 8,8 | 4,1 | 9,8 | 0,8 | 1,5 |
| Skynd dig hjem | 58 % | 58 % | 0 % | 0 % | 42 % | 0 % | 3,8 | 4,4 | 11,4 | 0,0 | 0,5 |
| Grådig | 50 % | 28 % | 17 % | 5 % | 49 % | 1 % | 5,7 | 2,3 | 19,7 | 8,0 | 0,7 |
| Stille | 62 % | 40 % | 22 % | 0 % | 37 % | 1 % | 4,9 | 3,9 | 18,5 | 6,9 | 0,5 |
| Kæmper | 78 % | 51 % | 27 % | 0 % | 18 % | 4 % | 6,4 | 4,6 | 19,5 | 7,9 | 0,6 |
| Løber | 79 % | 55 % | 24 % | 0 % | 18 % | 3 % | 5,8 | 4,4 | 19,5 | 7,9 | 0,5 |
| Let bagage | 72 % | 50 % | 22 % | 0 % | 25 % | 2 % | 5,8 | 3,9 | 16,5 | 6,4 | 2,0 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 5 % | 1,7 | 5,2 | 0,2 | 0,4 | 0,5 | 0,0 | 1,6 | 0,3 |
| Skynd dig hjem | 30 % | 4,7 | 2,4 | 0,8 | 0,0 | 0,6 | 0,0 | 2,9 | 0,0 |
| Grådig | 38 % | 5,0 | 3,8 | 1,7 | 0,1 | 0,6 | 0,0 | 3,8 | 2,6 |
| Stille | 24 % | 4,9 | 2,2 | 1,5 | 0,0 | 0,9 | 0,0 | 3,8 | 0,1 |
| Kæmper | 12 % | 3,5 | 2,2 | 1,6 | 0,1 | 0,4 | 0,0 | 3,7 | 2,7 |
| Løber | 10 % | 3,4 | 2,2 | 1,6 | 0,0 | 0,4 | 0,0 | 3,8 | 2,1 |
| Let bagage | 17 % | 4,0 | 2,4 | 1,5 | 0,1 | 0,5 | 0,0 | 3,7 | 1,9 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,6 | 3,8 | 0,5 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,6 | 0,0 |
| Grådig | 0,2 | 0,1 | 0,3 | 0,7 | 1,9 |
| Stille | 0,6 | 0,0 | 0,2 | 0,7 | 1,6 |
| Kæmper | 0,2 | 0,0 | 0,3 | 0,5 | 1,6 |
| Løber | 0,4 | 0,0 | 0,2 | 0,6 | 1,7 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,7 | 1,2 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 548 | 633 | 139 | 54 | 108 | 166 | 80 |
| alarmClock | 466 | 39 | 91 | 224 | 81 | 43 | 26 |
| bicycle | 420 | 332 | 96 | 89 | 57 | 113 | 64 |
| baseballBat | 380 | 159 | 105 | 8 | 146 | 66 | 55 |
| bandage | 345 | 53 | 120 | 15 | 112 | 60 | 38 |
| painkillers | 226 | 117 | 28 | 2 | 28 | 22 | 145 |
| chainsaw | 196 | 32 | 41 | 41 | 56 | 31 | 27 |
| softSoles | 196 | 100 | 1 | 60 | 1 | 133 | 1 |
| flashlight | 189 | 222 | 30 | 91 | 29 | 24 | 15 |
| axe | 148 | 113 | 37 | 4 | 66 | 32 | 8 |
| toolbox | 142 | 33 | 10 | 2 | 1 | 9 | 121 |
| lockpick | 129 | 126 | 18 | 72 | 16 | 15 | 7 |
| shotgun | 115 | 41 | 28 | 24 | 25 | 15 | 24 |
| firstAidKit | 73 | 6 | 28 | 6 | 18 | 14 | 8 |
| molotov | 62 | 9 | 14 | 1 | 29 | 11 | 7 |
| pistol | 56 | 17 | 16 | 1 | 19 | 13 | 8 |
| adrenaline | 21 | 11 | 0 | 0 | 0 | 21 | 0 |
| travelLight | 7 | 8 | 0 | 0 | 0 | 0 | 6 |
| kevlarVest | 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 58 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 22 % og med 4 i 5 %, men dør på vej hjem i 38 %.
- **Kan flere spillestile vinde?** Stille 62 %, Kæmper 78 %, Løber 79 %, Let bagage 72 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, bicycle · Kæmper: baseballBat, bandage, runningShoes · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 58 % | 50 % (★★★ 5 %) | 62 % | 78 % | 79 % | 72 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 81 % | 61 % (★★★ 5 %) | 70 % | 83 % | 82 % | 80 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 67 % | 58 % (★★★ 22 %) | 83 % | 88 % | 92 % | 96 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 70 % | 64 % (★★★ 4 %) | 72 % | 83 % | 87 % | 82 % |
| Lille by (3 × 3, før 25. okt.) (`cityMap=classic`) | 66 % | 56 % (★★★ 20 %) | 66 % | 76 % | 82 % | 77 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 56 % | 51 % (★★★ 4 %) | 60 % | 73 % | 76 % | 70 % |
| Stor by med 5 pakker (`packsOnMap=5`) | 65 % | 59 % (★★★ 14 %) | 66 % | 79 % | 87 % | 75 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 57 % | 43 % (★★★ 4 %) | 49 % | 66 % | 71 % | 63 % |
| Fund i afkastbunken (`findsToHand=false`) | 56 % | 43 % (★★★ 3 %) | 50 % | 67 % | 74 % | 63 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 57 % | 43 % (★★★ 3 %) | 60 % | 70 % | 75 % | 68 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 60 % | 49 % (★★★ 4 %) | 61 % | 76 % | 79 % | 73 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 57 % | 36 % (★★★ 2 %) | 50 % | 67 % | 72 % | 57 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 56 % | 50 % (★★★ 5 %) | 60 % | 73 % | 75 % | 71 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 56 % | 50 % (★★★ 5 %) | 56 % | 74 % | 79 % | 71 % |
| 10 liv (`maxHp=10`) | 61 % | 56 % (★★★ 6 %) | 66 % | 79 % | 82 % | 73 % |
| 8 liv (`maxHp=8`) | 49 % | 46 % (★★★ 2 %) | 50 % | 71 % | 71 % | 65 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 33 % | 26 % (★★★ 1 %) | 38 % | 54 % | 51 % | 41 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 22 % | 22 % (★★★ 0 %) | 29 % | 34 % | 42 % | 31 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 56 % | 55 % (★★★ 3 %) | 63 % | 74 % | 76 % | 72 % |

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
