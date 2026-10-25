# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 68 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 65 % og 84 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 53 % af spillene, men får ★★★ i 15 %.
- Spillene slutter i gennemsnit i tur 5,0.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 50 % | 49 % | 8,7 | 4,3 | 9,8 | 0,7 | 1,5 |
| Skynd dig hjem | 68 % | 68 % | 0 % | 0 % | 32 % | 0 % | 3,7 | 4,6 | 11,5 | 0,0 | 0,4 |
| Grådig | 47 % | 17 % | 16 % | 15 % | 53 % | 0 % | 5,3 | 2,5 | 19,1 | 6,9 | 0,5 |
| Stille | 65 % | 31 % | 34 % | 0 % | 35 % | 0 % | 4,7 | 3,8 | 18,4 | 6,6 | 0,5 |
| Kæmper | 80 % | 38 % | 42 % | 0 % | 20 % | 0 % | 5,7 | 4,5 | 18,8 | 6,9 | 0,5 |
| Løber | 84 % | 43 % | 41 % | 0 % | 16 % | 0 % | 5,2 | 4,4 | 18,7 | 6,6 | 0,3 |
| Let bagage | 74 % | 34 % | 40 % | 0 % | 27 % | 0 % | 5,1 | 4,0 | 15,9 | 5,3 | 1,8 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,7 | 5,3 | 0,2 | 0,4 | 0,3 | 0,0 | 1,7 | 0,2 |
| Skynd dig hjem | 27 % | 4,1 | 2,2 | 0,7 | 0,0 | 0,4 | 0,0 | 2,9 | 0,0 |
| Grådig | 47 % | 5,0 | 3,8 | 1,7 | 0,0 | 1,0 | 0,0 | 4,0 | 2,0 |
| Stille | 28 % | 4,8 | 2,3 | 1,5 | 0,0 | 0,9 | 0,0 | 4,0 | 0,2 |
| Kæmper | 16 % | 3,4 | 2,5 | 1,6 | 0,0 | 0,6 | 0,0 | 4,0 | 2,3 |
| Løber | 12 % | 3,2 | 2,2 | 1,6 | 0,0 | 0,6 | 0,0 | 4,0 | 1,4 |
| Let bagage | 23 % | 3,9 | 2,4 | 1,4 | 0,0 | 0,6 | 0,0 | 3,9 | 1,4 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,6 | 3,8 | 0,5 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,5 | 0,0 |
| Grådig | 0,3 | 0,0 | 0,3 | 0,8 | 1,9 |
| Stille | 0,5 | 0,0 | 0,2 | 0,7 | 1,3 |
| Kæmper | 0,3 | 0,0 | 0,2 | 0,5 | 1,4 |
| Løber | 0,4 | 0,0 | 0,2 | 0,5 | 1,5 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 1,1 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 400 | 455 | 113 | 30 | 54 | 133 | 69 |
| bicycle | 320 | 247 | 81 | 56 | 38 | 92 | 53 |
| alarmClock | 307 | 33 | 62 | 147 | 55 | 29 | 14 |
| baseballBat | 281 | 91 | 76 | 7 | 111 | 51 | 36 |
| bandage | 228 | 34 | 84 | 13 | 72 | 37 | 23 |
| chainsaw | 177 | 31 | 41 | 31 | 51 | 29 | 24 |
| knife | 159 | 62 | 19 | 67 | 54 | 13 | 6 |
| painkillers | 156 | 89 | 12 | 3 | 17 | 9 | 115 |
| softSoles | 149 | 67 | 1 | 26 | 0 | 121 | 0 |
| bow | 149 | 61 | 27 | 51 | 46 | 14 | 10 |
| axe | 133 | 97 | 36 | 3 | 61 | 29 | 5 |
| silentTakedown | 128 | 0 | 23 | 63 | 23 | 12 | 7 |
| toolbox | 124 | 27 | 6 | 0 | 2 | 6 | 111 |
| flashlight | 94 | 113 | 14 | 48 | 15 | 12 | 6 |
| lockpick | 93 | 80 | 11 | 62 | 8 | 9 | 3 |
| crossbow | 92 | 79 | 21 | 27 | 19 | 11 | 15 |
| shotgun | 75 | 20 | 20 | 12 | 17 | 11 | 16 |
| firstAidKit | 59 | 8 | 23 | 6 | 16 | 10 | 5 |
| molotov | 36 | 5 | 6 | 1 | 21 | 4 | 3 |
| headShot | 27 | 17 | 9 | 1 | 9 | 6 | 3 |
| pistol | 24 | 8 | 7 | 1 | 8 | 5 | 4 |
| adrenaline | 19 | 10 | 0 | 0 | 0 | 18 | 0 |
| travelLight | 6 | 6 | 0 | 0 | 0 | 0 | 6 |
| kevlarVest | 1 | 0 | 1 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 68 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 30 % og med 4 i 15 %, men dør på vej hjem i 47 %.
- **Kan flere spillestile vinde?** Stille 65 %, Kæmper 80 %, Løber 84 %, Let bagage 74 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, silentTakedown · Kæmper: baseballBat, bandage, axe · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 68 % | 47 % (★★★ 15 %) | 65 % | 80 % | 84 % | 74 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 88 % | 53 % (★★★ 15 %) | 72 % | 86 % | 83 % | 84 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 93 % | 58 % (★★★ 30 %) | 63 % | 74 % | 88 % | 76 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 77 % | 62 % (★★★ 9 %) | 75 % | 86 % | 90 % | 83 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 62 % | 47 % (★★★ 15 %) | 59 % | 70 % | 79 % | 67 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 65 % | 45 % (★★★ 18 %) | 62 % | 77 % | 81 % | 70 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 55 % | 45 % (★★★ 4 %) | 55 % | 74 % | 74 % | 67 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 37 % (★★★ 8 %) | 51 % | 66 % | 72 % | 65 % |
| Fund i afkastbunken (`findsToHand=false`) | 65 % | 31 % (★★★ 9 %) | 51 % | 65 % | 69 % | 66 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 42 % (★★★ 11 %) | 62 % | 74 % | 83 % | 68 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 56 % (★★★ 19 %) | 67 % | 88 % | 89 % | 78 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 63 % | 28 % (★★★ 6 %) | 43 % | 63 % | 63 % | 53 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 65 % | 41 % (★★★ 13 %) | 64 % | 78 % | 80 % | 69 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 65 % | 44 % (★★★ 17 %) | 60 % | 79 % | 84 % | 74 % |
| 10 liv (`maxHp=10`) | 69 % | 50 % (★★★ 19 %) | 66 % | 81 % | 83 % | 78 % |
| 8 liv (`maxHp=8`) | 60 % | 48 % (★★★ 11 %) | 58 % | 73 % | 77 % | 65 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 42 % | 30 % (★★★ 7 %) | 38 % | 59 % | 60 % | 49 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 31 % | 15 % (★★★ 1 %) | 33 % | 42 % | 50 % | 39 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 65 % | 48 % (★★★ 14 %) | 70 % | 82 % | 82 % | 75 % |

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
