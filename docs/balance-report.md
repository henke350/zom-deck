# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 58 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 61 % og 81 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 45 % af spillene, men får ★★★ i 7 %.
- Spillene slutter i gennemsnit i tur 5,6.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 48 % | 51 % | 8,8 | 3,8 | 9,8 | 0,8 | 1,6 |
| Skynd dig hjem | 58 % | 58 % | 0 % | 0 % | 42 % | 0 % | 3,8 | 4,4 | 11,4 | 0,0 | 0,5 |
| Grådig | 53 % | 27 % | 20 % | 7 % | 45 % | 1 % | 6,0 | 2,5 | 20,4 | 8,7 | 0,7 |
| Stille | 61 % | 39 % | 22 % | 0 % | 37 % | 2 % | 5,2 | 3,9 | 18,9 | 7,4 | 0,5 |
| Kæmper | 81 % | 53 % | 29 % | 0 % | 13 % | 6 % | 6,7 | 5,1 | 20,4 | 8,9 | 0,7 |
| Løber | 81 % | 55 % | 26 % | 0 % | 16 % | 3 % | 6,1 | 4,5 | 20,1 | 8,4 | 0,5 |
| Let bagage | 74 % | 51 % | 23 % | 0 % | 24 % | 3 % | 6,0 | 4,1 | 16,7 | 6,6 | 2,0 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 5 % | 1,7 | 5,2 | 0,2 | 0,4 | 0,5 | 0,0 | 1,6 | 0,3 |
| Skynd dig hjem | 30 % | 4,7 | 2,4 | 0,8 | 0,0 | 0,6 | 0,0 | 2,9 | 0,0 |
| Grådig | 35 % | 4,8 | 3,8 | 1,7 | 0,1 | 0,6 | 0,0 | 3,8 | 3,1 |
| Stille | 25 % | 5,0 | 2,1 | 1,5 | 0,0 | 1,0 | 0,0 | 3,7 | 0,5 |
| Kæmper | 8 % | 3,0 | 2,0 | 1,6 | 0,1 | 0,4 | 0,0 | 3,7 | 3,4 |
| Løber | 9 % | 3,2 | 2,2 | 1,7 | 0,1 | 0,4 | 0,0 | 3,8 | 2,4 |
| Let bagage | 16 % | 3,9 | 2,3 | 1,5 | 0,0 | 0,5 | 0,0 | 3,7 | 2,2 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,6 | 3,8 | 0,5 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,6 | 0,0 |
| Grådig | 0,3 | 0,1 | 0,3 | 0,7 | 1,9 |
| Stille | 0,6 | 0,0 | 0,2 | 0,7 | 1,4 |
| Kæmper | 0,3 | 0,0 | 0,3 | 0,6 | 1,5 |
| Løber | 0,4 | 0,1 | 0,2 | 0,6 | 1,6 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 1,2 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 493 | 574 | 135 | 41 | 73 | 161 | 83 |
| alarmClock | 429 | 35 | 91 | 181 | 82 | 49 | 27 |
| baseballBat | 375 | 151 | 99 | 10 | 144 | 70 | 51 |
| bandage | 363 | 56 | 127 | 23 | 106 | 68 | 39 |
| bicycle | 322 | 257 | 82 | 56 | 38 | 94 | 52 |
| painkillers | 248 | 124 | 34 | 7 | 38 | 27 | 143 |
| knife | 223 | 130 | 29 | 83 | 71 | 25 | 15 |
| flashlight | 185 | 225 | 36 | 71 | 36 | 25 | 17 |
| softSoles | 179 | 96 | 1 | 42 | 1 | 135 | 1 |
| chainsaw | 177 | 27 | 40 | 31 | 55 | 29 | 23 |
| bow | 162 | 75 | 26 | 57 | 53 | 15 | 11 |
| axe | 148 | 113 | 39 | 5 | 65 | 33 | 7 |
| toolbox | 133 | 31 | 6 | 1 | 1 | 7 | 118 |
| lockpick | 133 | 123 | 18 | 70 | 20 | 16 | 8 |
| crossbow | 106 | 89 | 22 | 33 | 21 | 12 | 18 |
| shotgun | 83 | 28 | 20 | 15 | 17 | 13 | 18 |
| firstAidKit | 79 | 8 | 31 | 7 | 22 | 14 | 7 |
| molotov | 67 | 8 | 15 | 4 | 29 | 12 | 7 |
| pistol | 64 | 19 | 19 | 3 | 21 | 13 | 8 |
| adrenaline | 20 | 7 | 0 | 0 | 0 | 19 | 0 |
| travelLight | 8 | 10 | 0 | 0 | 0 | 0 | 8 |
| kevlarVest | 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 58 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 26 % og med 4 i 7 %, men dør på vej hjem i 35 %.
- **Kan flere spillestile vinde?** Stille 61 %, Kæmper 81 %, Løber 81 %, Let bagage 74 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, flashlight · Kæmper: baseballBat, bandage, alarmClock · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 58 % | 53 % (★★★ 7 %) | 61 % | 81 % | 81 % | 74 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 81 % | 64 % (★★★ 7 %) | 66 % | 84 % | 87 % | 83 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 67 % | 58 % (★★★ 21 %) | 85 % | 96 % | 93 % | 97 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 70 % | 64 % (★★★ 3 %) | 69 % | 84 % | 87 % | 82 % |
| Lille by (3 × 3, før 25. okt.) (`cityMap=classic`) | 66 % | 57 % (★★★ 23 %) | 61 % | 82 % | 83 % | 75 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 56 % | 55 % (★★★ 6 %) | 64 % | 79 % | 79 % | 69 % |
| Stor by med 5 pakker (`packsOnMap=5`) | 65 % | 58 % (★★★ 17 %) | 70 % | 86 % | 88 % | 76 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 57 % | 43 % (★★★ 4 %) | 50 % | 72 % | 73 % | 65 % |
| Fund i afkastbunken (`findsToHand=false`) | 56 % | 45 % (★★★ 4 %) | 50 % | 73 % | 74 % | 66 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 57 % | 48 % (★★★ 6 %) | 62 % | 79 % | 78 % | 68 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 60 % | 53 % (★★★ 7 %) | 63 % | 81 % | 78 % | 73 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 57 % | 43 % (★★★ 3 %) | 50 % | 70 % | 69 % | 62 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 56 % | 52 % (★★★ 5 %) | 61 % | 78 % | 79 % | 71 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 56 % | 52 % (★★★ 5 %) | 60 % | 80 % | 79 % | 70 % |
| 10 liv (`maxHp=10`) | 61 % | 60 % (★★★ 8 %) | 71 % | 83 % | 82 % | 74 % |
| 8 liv (`maxHp=8`) | 49 % | 47 % (★★★ 4 %) | 60 % | 77 % | 75 % | 66 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 33 % | 26 % (★★★ 2 %) | 41 % | 59 % | 58 % | 44 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 22 % | 23 % (★★★ 0 %) | 25 % | 34 % | 39 % | 33 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 56 % | 54 % (★★★ 5 %) | 67 % | 77 % | 80 % | 74 % |

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
