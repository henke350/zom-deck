# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 66 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 70 % og 83 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 47 % af spillene, men får ★★★ i 21 %.
- Spillene slutter i gennemsnit i tur 4,3, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 55 % | 45 % | 8,4 | 5,4 | 10,0 | 0,6 | 1,3 |
| Skynd dig hjem | 66 % | 66 % | 0 % | 0 % | 34 % | 0 % | 3,3 | 4,3 | 11,5 | 0,0 | 0,4 |
| Grådig | 53 % | 18 % | 14 % | 21 % | 47 % | 0 % | 4,6 | 2,5 | 19,1 | 6,8 | 0,5 |
| Stille | 70 % | 32 % | 38 % | 0 % | 30 % | 0 % | 4,0 | 3,7 | 17,7 | 5,7 | 0,4 |
| Kæmper | 78 % | 30 % | 48 % | 0 % | 22 % | 0 % | 4,9 | 4,2 | 18,7 | 6,7 | 0,5 |
| Løber | 83 % | 34 % | 49 % | 0 % | 18 % | 0 % | 4,5 | 4,3 | 18,5 | 6,4 | 0,4 |
| Let bagage | 76 % | 31 % | 46 % | 0 % | 24 % | 0 % | 4,6 | 3,8 | 16,0 | 5,3 | 1,7 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,5 | 0,2 | 0,3 | 0,4 | 0,0 | 1,7 | 0,2 |
| Skynd dig hjem | 31 % | 3,7 | 2,9 | 0,6 | 0,0 | 0,6 | 0,0 | 3,0 | 0,0 |
| Grådig | 44 % | 4,3 | 4,2 | 1,5 | 0,0 | 0,6 | 0,0 | 3,9 | 2,2 |
| Stille | 27 % | 4,4 | 2,5 | 1,2 | 0,0 | 0,8 | 0,0 | 3,9 | 0,1 |
| Kæmper | 20 % | 3,3 | 2,9 | 1,4 | 0,0 | 0,4 | 0,0 | 3,9 | 2,3 |
| Løber | 16 % | 3,1 | 2,5 | 1,4 | 0,0 | 0,4 | 0,0 | 3,9 | 1,8 |
| Let bagage | 22 % | 3,6 | 3,0 | 1,3 | 0,0 | 0,4 | 0,0 | 3,9 | 1,7 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 3,8 | 0,4 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,6 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,2 | 0,9 | 2,1 |
| Stille | 0,4 | 0,0 | 0,1 | 0,9 | 1,7 |
| Kæmper | 0,1 | 0,0 | 0,1 | 0,7 | 1,7 |
| Løber | 0,2 | 0,0 | 0,1 | 0,7 | 1,7 |
| Let bagage | 0,1 | 0,0 | 0,0 | 0,8 | 1,3 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 402 | 432 | 101 | 40 | 83 | 120 | 58 |
| bicycle | 386 | 293 | 88 | 81 | 54 | 102 | 61 |
| baseballBat | 350 | 131 | 102 | 15 | 128 | 60 | 46 |
| alarmClock | 310 | 33 | 50 | 158 | 50 | 34 | 18 |
| bandage | 267 | 32 | 88 | 23 | 79 | 49 | 29 |
| chainsaw | 195 | 30 | 44 | 41 | 53 | 28 | 29 |
| painkillers | 195 | 107 | 25 | 2 | 26 | 19 | 123 |
| shotgun | 171 | 53 | 44 | 36 | 37 | 22 | 32 |
| flashlight | 148 | 160 | 22 | 71 | 23 | 20 | 12 |
| toolbox | 98 | 19 | 6 | 1 | 1 | 6 | 85 |
| lockpick | 97 | 85 | 15 | 50 | 12 | 14 | 6 |
| softSoles | 96 | 42 | 1 | 32 | 1 | 62 | 0 |
| axe | 96 | 61 | 24 | 2 | 42 | 23 | 4 |
| firstAidKit | 91 | 8 | 35 | 9 | 22 | 16 | 10 |
| pistol | 54 | 22 | 15 | 2 | 18 | 13 | 6 |
| molotov | 49 | 6 | 11 | 0 | 24 | 9 | 4 |
| adrenaline | 41 | 18 | 1 | 1 | 1 | 39 | 0 |
| kevlarVest | 33 | 28 | 10 | 4 | 14 | 4 | 2 |
| travelLight | 2 | 2 | 0 | 0 | 0 | 0 | 2 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 66 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 35 % og med 4 i 21 %, men dør på vej hjem i 44 %.
- **Kan flere spillestile vinde?** Stille 70 %, Kæmper 78 %, Løber 83 %, Let bagage 76 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, bicycle, flashlight · Kæmper: baseballBat, runningShoes, bandage · Løber: runningShoes, bicycle, softSoles · Let bagage: painkillers, toolbox, bicycle.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 66 % | 53 % (★★★ 21 %) | 70 % | 78 % | 83 % | 76 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 86 % | 67 % (★★★ 31 %) | 78 % | 86 % | 89 % | 84 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 67 % | 58 % (★★★ 22 %) | 83 % | 88 % | 92 % | 96 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 81 % | 61 % (★★★ 22 %) | 77 % | 84 % | 87 % | 83 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 64 % | 41 % (★★★ 17 %) | 55 % | 66 % | 73 % | 65 % |
| Fund i afkastbunken (`findsToHand=false`) | 64 % | 40 % (★★★ 13 %) | 55 % | 69 % | 74 % | 67 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 64 % | 57 % (★★★ 20 %) | 66 % | 76 % | 83 % | 78 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 69 % | 57 % (★★★ 22 %) | 70 % | 82 % | 86 % | 77 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 63 % | 36 % (★★★ 6 %) | 51 % | 62 % | 67 % | 57 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 64 % | 55 % (★★★ 22 %) | 66 % | 76 % | 85 % | 79 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 64 % | 55 % (★★★ 22 %) | 66 % | 79 % | 81 % | 78 % |
| 10 liv (`maxHp=10`) | 72 % | 61 % (★★★ 32 %) | 72 % | 82 % | 84 % | 79 % |
| 8 liv (`maxHp=8`) | 58 % | 50 % (★★★ 15 %) | 62 % | 72 % | 79 % | 69 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 43 % | 28 % (★★★ 7 %) | 42 % | 55 % | 59 % | 51 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 35 % | 25 % (★★★ 1 %) | 34 % | 45 % | 54 % | 38 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 64 % | 60 % (★★★ 21 %) | 67 % | 79 % | 86 % | 78 % |

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
