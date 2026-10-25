# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 66 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 74 % og 89 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 36 % af spillene, men får ★★★ i 26 %.
- Spillene slutter i gennemsnit i tur 4,0, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 55 % | 45 % | 8,3 | 5,8 | 10,0 | 0,6 | 1,3 |
| Skynd dig hjem | 66 % | 66 % | 0 % | 0 % | 34 % | 0 % | 3,3 | 4,3 | 11,5 | 0,0 | 0,4 |
| Grådig | 64 % | 20 % | 18 % | 26 % | 36 % | 0 % | 4,3 | 2,6 | 19,3 | 6,9 | 0,4 |
| Stille | 74 % | 33 % | 42 % | 0 % | 26 % | 0 % | 3,9 | 4,0 | 17,8 | 5,7 | 0,4 |
| Kæmper | 84 % | 29 % | 55 % | 0 % | 16 % | 0 % | 4,4 | 4,6 | 18,8 | 6,7 | 0,4 |
| Løber | 89 % | 33 % | 56 % | 0 % | 11 % | 0 % | 4,0 | 4,7 | 18,7 | 6,4 | 0,3 |
| Let bagage | 83 % | 31 % | 52 % | 0 % | 17 % | 0 % | 4,2 | 4,1 | 16,1 | 5,3 | 1,7 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,5 | 0,2 | 0,3 | 0,4 | 0,0 | 1,7 | 0,2 |
| Skynd dig hjem | 31 % | 3,7 | 2,9 | 0,6 | 0,0 | 0,6 | 0,0 | 3,0 | 0,0 |
| Grådig | 33 % | 3,9 | 4,2 | 1,6 | 0,0 | 0,5 | 0,0 | 3,9 | 2,2 |
| Stille | 23 % | 4,1 | 2,4 | 1,2 | 0,0 | 0,7 | 0,0 | 3,9 | 0,1 |
| Kæmper | 14 % | 2,7 | 2,8 | 1,4 | 0,0 | 0,3 | 0,0 | 3,9 | 2,3 |
| Løber | 10 % | 2,5 | 2,3 | 1,4 | 0,0 | 0,3 | 0,0 | 3,9 | 1,7 |
| Let bagage | 16 % | 3,0 | 2,9 | 1,4 | 0,0 | 0,4 | 0,0 | 3,9 | 1,6 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 3,8 | 0,4 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,6 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,2 | 1,0 | 2,1 |
| Stille | 0,4 | 0,0 | 0,1 | 0,9 | 1,6 |
| Kæmper | 0,2 | 0,0 | 0,1 | 0,7 | 1,7 |
| Løber | 0,3 | 0,0 | 0,1 | 0,7 | 1,7 |
| Let bagage | 0,1 | 0,0 | 0,0 | 0,8 | 1,3 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 410 | 283 | 103 | 42 | 86 | 120 | 60 |
| bicycle | 384 | 279 | 89 | 79 | 55 | 100 | 61 |
| baseballBat | 347 | 123 | 102 | 15 | 124 | 62 | 44 |
| alarmClock | 310 | 27 | 52 | 154 | 50 | 36 | 18 |
| bandage | 269 | 26 | 89 | 25 | 78 | 48 | 29 |
| painkillers | 196 | 102 | 25 | 2 | 24 | 20 | 126 |
| chainsaw | 194 | 29 | 44 | 40 | 51 | 29 | 30 |
| shotgun | 173 | 50 | 45 | 36 | 39 | 22 | 32 |
| flashlight | 152 | 119 | 23 | 75 | 23 | 20 | 12 |
| toolbox | 99 | 16 | 6 | 1 | 1 | 7 | 84 |
| softSoles | 99 | 34 | 1 | 34 | 1 | 62 | 0 |
| axe | 97 | 59 | 24 | 3 | 42 | 24 | 4 |
| firstAidKit | 97 | 7 | 37 | 10 | 23 | 18 | 9 |
| lockpick | 93 | 81 | 13 | 48 | 12 | 13 | 6 |
| pistol | 55 | 22 | 16 | 2 | 19 | 12 | 5 |
| molotov | 49 | 6 | 10 | 0 | 25 | 9 | 4 |
| adrenaline | 42 | 21 | 1 | 1 | 1 | 40 | 0 |
| kevlarVest | 33 | 5 | 11 | 4 | 13 | 4 | 2 |
| travelLight | 2 | 2 | 0 | 0 | 0 | 0 | 2 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 66 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 44 % og med 4 i 26 %, men dør på vej hjem i 33 %.
- **Kan flere spillestile vinde?** Stille 74 %, Kæmper 84 %, Løber 89 %, Let bagage 83 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, bicycle, flashlight · Kæmper: baseballBat, runningShoes, bandage · Løber: runningShoes, bicycle, baseballBat · Let bagage: painkillers, toolbox, bicycle.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 66 % | 64 % (★★★ 26 %) | 74 % | 84 % | 89 % | 83 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 86 % | 70 % (★★★ 33 %) | 79 % | 92 % | 94 % | 86 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 67 % | 77 % (★★★ 45 %) | 90 % | 97 % | 98 % | 98 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 81 % | 74 % (★★★ 30 %) | 83 % | 92 % | 94 % | 89 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 64 % | 52 % (★★★ 20 %) | 61 % | 70 % | 77 % | 71 % |
| Fund i afkastbunken (`findsToHand=false`) | 64 % | 51 % (★★★ 18 %) | 62 % | 72 % | 79 % | 68 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 64 % | 65 % (★★★ 24 %) | 72 % | 83 % | 89 % | 82 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 69 % | 68 % (★★★ 33 %) | 74 % | 88 % | 90 % | 83 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 63 % | 51 % (★★★ 15 %) | 60 % | 71 % | 81 % | 64 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 64 % | 65 % (★★★ 27 %) | 72 % | 84 % | 89 % | 83 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 64 % | 65 % (★★★ 26 %) | 72 % | 87 % | 88 % | 85 % |
| 10 liv (`maxHp=10`) | 72 % | 69 % (★★★ 37 %) | 78 % | 90 % | 91 % | 86 % |
| 8 liv (`maxHp=8`) | 58 % | 61 % (★★★ 22 %) | 69 % | 79 % | 86 % | 76 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 43 % | 35 % (★★★ 9 %) | 53 % | 63 % | 68 % | 57 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 35 % | 30 % (★★★ 1 %) | 37 % | 62 % | 65 % | 48 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 64 % | 68 % (★★★ 28 %) | 72 % | 83 % | 88 % | 84 % |

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
