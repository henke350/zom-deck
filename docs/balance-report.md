# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 69 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 69 % og 90 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 42 % af spillene, men får ★★★ i 18 %.
- Spillene slutter i gennemsnit i tur 5,2.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 49 % | 50 % | 8,8 | 4,4 | 9,9 | 0,8 | 1,5 |
| Skynd dig hjem | 69 % | 69 % | 0 % | 0 % | 31 % | 0 % | 3,7 | 4,7 | 11,5 | 0,0 | 0,5 |
| Grådig | 58 % | 17 % | 23 % | 18 % | 42 % | 0 % | 5,7 | 2,6 | 20,6 | 8,5 | 0,7 |
| Stille | 69 % | 32 % | 37 % | 0 % | 31 % | 0 % | 4,8 | 4,1 | 18,8 | 6,9 | 0,5 |
| Kæmper | 88 % | 37 % | 51 % | 0 % | 12 % | 1 % | 6,0 | 5,2 | 20,5 | 8,6 | 0,6 |
| Løber | 90 % | 44 % | 46 % | 0 % | 10 % | 0 % | 5,5 | 4,7 | 20,0 | 7,9 | 0,4 |
| Let bagage | 81 % | 38 % | 43 % | 0 % | 19 % | 0 % | 5,4 | 4,2 | 16,7 | 6,2 | 1,9 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,7 | 5,2 | 0,2 | 0,4 | 0,5 | 0,0 | 1,7 | 0,3 |
| Skynd dig hjem | 26 % | 4,1 | 2,1 | 0,7 | 0,0 | 0,6 | 0,0 | 2,9 | 0,0 |
| Grådig | 38 % | 4,7 | 3,6 | 1,7 | 0,0 | 0,7 | 0,0 | 3,9 | 2,9 |
| Stille | 26 % | 4,7 | 2,0 | 1,4 | 0,0 | 0,9 | 0,0 | 3,8 | 0,5 |
| Kæmper | 10 % | 2,8 | 2,0 | 1,5 | 0,0 | 0,4 | 0,0 | 3,9 | 3,2 |
| Løber | 8 % | 2,9 | 2,0 | 1,6 | 0,0 | 0,3 | 0,0 | 3,9 | 2,3 |
| Let bagage | 16 % | 3,7 | 2,2 | 1,4 | 0,0 | 0,5 | 0,0 | 3,8 | 2,0 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,6 | 3,8 | 0,5 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,5 | 0,0 |
| Grådig | 0,3 | 0,0 | 0,3 | 0,7 | 1,9 |
| Stille | 0,5 | 0,0 | 0,2 | 0,7 | 1,3 |
| Kæmper | 0,3 | 0,0 | 0,2 | 0,5 | 1,4 |
| Løber | 0,3 | 0,0 | 0,2 | 0,5 | 1,5 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 1,1 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 473 | 528 | 132 | 38 | 71 | 154 | 79 |
| alarmClock | 410 | 33 | 87 | 173 | 81 | 46 | 24 |
| baseballBat | 357 | 141 | 96 | 9 | 139 | 65 | 47 |
| bandage | 348 | 41 | 122 | 21 | 104 | 64 | 36 |
| bicycle | 312 | 240 | 84 | 52 | 37 | 90 | 49 |
| painkillers | 238 | 119 | 33 | 7 | 36 | 24 | 139 |
| knife | 207 | 118 | 28 | 77 | 68 | 22 | 12 |
| flashlight | 178 | 208 | 34 | 68 | 36 | 26 | 15 |
| softSoles | 171 | 82 | 1 | 40 | 1 | 128 | 1 |
| chainsaw | 164 | 21 | 37 | 29 | 50 | 27 | 21 |
| bow | 155 | 68 | 25 | 52 | 52 | 14 | 11 |
| axe | 142 | 105 | 38 | 4 | 64 | 32 | 5 |
| lockpick | 128 | 116 | 18 | 66 | 20 | 16 | 7 |
| toolbox | 125 | 26 | 6 | 1 | 1 | 6 | 112 |
| crossbow | 98 | 82 | 21 | 30 | 20 | 10 | 17 |
| firstAidKit | 79 | 8 | 32 | 6 | 22 | 13 | 7 |
| shotgun | 76 | 26 | 19 | 14 | 15 | 13 | 16 |
| molotov | 66 | 8 | 16 | 3 | 28 | 12 | 8 |
| pistol | 58 | 15 | 17 | 2 | 19 | 13 | 7 |
| adrenaline | 20 | 8 | 0 | 0 | 0 | 19 | 0 |
| travelLight | 7 | 8 | 0 | 0 | 0 | 0 | 7 |
| kevlarVest | 2 | 1 | 1 | 0 | 1 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 69 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 41 % og med 4 i 18 %, men dør på vej hjem i 38 %.
- **Kan flere spillestile vinde?** Stille 69 %, Kæmper 88 %, Løber 90 %, Let bagage 81 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, flashlight · Kæmper: baseballBat, bandage, alarmClock · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 69 % | 58 % (★★★ 18 %) | 69 % | 88 % | 90 % | 81 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 88 % | 67 % (★★★ 20 %) | 77 % | 94 % | 95 % | 90 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 93 % | 64 % (★★★ 35 %) | 77 % | 76 % | 86 % | 74 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 79 % | 68 % (★★★ 12 %) | 77 % | 90 % | 92 % | 87 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 66 % | 57 % (★★★ 23 %) | 61 % | 82 % | 83 % | 75 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 65 % | 58 % (★★★ 18 %) | 70 % | 86 % | 87 % | 75 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 56 % | 55 % (★★★ 6 %) | 65 % | 80 % | 79 % | 71 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 46 % (★★★ 13 %) | 59 % | 78 % | 82 % | 70 % |
| Fund i afkastbunken (`findsToHand=false`) | 65 % | 44 % (★★★ 11 %) | 58 % | 79 % | 82 % | 70 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 55 % (★★★ 14 %) | 67 % | 83 % | 88 % | 76 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 57 % (★★★ 19 %) | 69 % | 87 % | 90 % | 81 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 66 % | 44 % (★★★ 7 %) | 51 % | 76 % | 78 % | 65 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 65 % | 56 % (★★★ 16 %) | 68 % | 85 % | 85 % | 77 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 65 % | 55 % (★★★ 17 %) | 67 % | 86 % | 88 % | 77 % |
| 10 liv (`maxHp=10`) | 71 % | 62 % (★★★ 23 %) | 79 % | 89 % | 91 % | 79 % |
| 8 liv (`maxHp=8`) | 59 % | 52 % (★★★ 14 %) | 63 % | 85 % | 83 % | 72 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 43 % | 28 % (★★★ 7 %) | 45 % | 67 % | 65 % | 49 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 31 % | 23 % (★★★ 0 %) | 30 % | 49 % | 52 % | 43 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 65 % | 59 % (★★★ 13 %) | 72 % | 87 % | 89 % | 79 % |

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
