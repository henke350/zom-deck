# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 73 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 70 % og 88 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 42 % af spillene, men får ★★★ i 23 %.
- Spillene slutter i gennemsnit i tur 5,2.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 47 % | 53 % | 8,8 | 4,3 | 11,4 | 1,4 | 0,6 |
| Skynd dig hjem | 73 % | 73 % | 0 % | 0 % | 27 % | 0 % | 3,8 | 4,7 | 11,5 | 0,0 | 0,5 |
| Grådig | 58 % | 15 % | 19 % | 23 % | 42 % | 1 % | 5,7 | 3,3 | 19,5 | 7,3 | 0,7 |
| Stille | 70 % | 27 % | 43 % | 0 % | 30 % | 0 % | 4,9 | 4,7 | 18,5 | 6,6 | 0,6 |
| Kæmper | 85 % | 33 % | 52 % | 0 % | 14 % | 2 % | 5,9 | 5,4 | 19,0 | 7,1 | 0,6 |
| Løber | 88 % | 34 % | 54 % | 0 % | 11 % | 1 % | 5,5 | 5,4 | 18,8 | 6,8 | 0,5 |
| Let bagage | 80 % | 33 % | 48 % | 0 % | 19 % | 1 % | 5,5 | 4,9 | 17,6 | 6,3 | 1,2 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,1 | 0,2 | 0,4 | 0,3 | 0,0 | 1,2 | 0,3 |
| Skynd dig hjem | 22 % | 3,8 | 2,0 | 0,4 | 0,0 | 0,3 | 0,0 | 1,9 | 0,0 |
| Grådig | 38 % | 4,6 | 3,4 | 3,0 | 0,1 | 1,3 | 0,0 | 3,9 | 3,5 |
| Stille | 25 % | 4,3 | 2,0 | 2,3 | 0,0 | 1,2 | 0,0 | 3,8 | 1,1 |
| Kæmper | 11 % | 2,7 | 1,9 | 2,4 | 0,1 | 0,6 | 0,0 | 3,8 | 3,4 |
| Løber | 9 % | 2,6 | 1,7 | 2,5 | 0,0 | 0,6 | 0,0 | 3,8 | 2,8 |
| Let bagage | 17 % | 3,4 | 1,9 | 2,2 | 0,0 | 0,7 | 0,0 | 3,8 | 2,4 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,8 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,5 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,7 | 1,5 |
| Stille | 0,5 | 0,0 | 0,3 | 0,6 | 1,1 |
| Kæmper | 0,2 | 0,1 | 0,2 | 0,5 | 1,2 |
| Løber | 0,3 | 0,1 | 0,2 | 0,5 | 1,2 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 0,9 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| alarmClock | 385 | 36 | 82 | 138 | 68 | 55 | 42 |
| bandage | 381 | 55 | 119 | 37 | 97 | 75 | 55 |
| runningShoes | 333 | 377 | 97 | 32 | 45 | 118 | 42 |
| knife | 291 | 176 | 55 | 71 | 89 | 45 | 32 |
| painkillers | 246 | 152 | 43 | 15 | 40 | 32 | 117 |
| bicycle | 245 | 203 | 66 | 42 | 31 | 69 | 37 |
| flashlight | 215 | 243 | 43 | 66 | 40 | 36 | 30 |
| baseballBat | 199 | 84 | 52 | 6 | 76 | 39 | 26 |
| bow | 155 | 76 | 27 | 50 | 48 | 15 | 15 |
| chainsaw | 147 | 14 | 34 | 27 | 44 | 24 | 18 |
| axe | 140 | 101 | 36 | 5 | 62 | 27 | 10 |
| toolbox | 121 | 30 | 7 | 1 | 2 | 7 | 104 |
| softSoles | 111 | 61 | 1 | 24 | 1 | 84 | 1 |
| crossbow | 87 | 75 | 18 | 25 | 18 | 11 | 16 |
| silentTakedown | 83 | 0 | 12 | 48 | 11 | 7 | 7 |
| shotgun | 70 | 20 | 17 | 13 | 16 | 9 | 15 |
| lockpick | 66 | 54 | 3 | 57 | 1 | 3 | 2 |
| repack | 66 | 75 | 2 | 1 | 1 | 1 | 61 |
| firstAidKit | 36 | 4 | 15 | 5 | 10 | 5 | 2 |
| adrenaline | 19 | 9 | 0 | 1 | 0 | 18 | 0 |
| molotov | 12 | 3 | 0 | 0 | 12 | 0 | 0 |
| headShot | 5 | 2 | 3 | 1 | 1 | 1 | 1 |
| kevlarVest | 2 | 2 | 1 | 0 | 1 | 0 | 0 |
| travelLight | 2 | 2 | 0 | 0 | 0 | 1 | 1 |
| pistol | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dog | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 73 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 43 % og med 4 i 23 %, men dør på vej hjem i 38 %.
- **Kan flere spillestile vinde?** Stille 70 %, Kæmper 85 %, Løber 88 %, Let bagage 80 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, flashlight · Kæmper: bandage, knife, baseballBat · Løber: runningShoes, softSoles, bandage · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, travelLight, pistol, districtMap, dog.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 73 % | 58 % (★★★ 23 %) | 70 % | 85 % | 88 % | 80 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 91 % | 65 % (★★★ 25 %) | 74 % | 89 % | 88 % | 83 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 95 % | 55 % (★★★ 34 %) | 68 % | 78 % | 91 % | 74 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 81 % | 67 % (★★★ 15 %) | 76 % | 87 % | 90 % | 87 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 70 % | 50 % (★★★ 20 %) | 57 % | 79 % | 76 % | 70 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 72 % | 53 % (★★★ 22 %) | 66 % | 82 % | 85 % | 75 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 62 % | 53 % (★★★ 7 %) | 59 % | 74 % | 77 % | 73 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 72 % | 46 % (★★★ 15 %) | 56 % | 76 % | 81 % | 74 % |
| Fund i afkastbunken (`findsToHand=false`) | 72 % | 45 % (★★★ 17 %) | 56 % | 73 % | 77 % | 72 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 72 % | 53 % (★★★ 17 %) | 65 % | 78 % | 86 % | 79 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 66 % (★★★ 30 %) | 76 % | 92 % | 93 % | 84 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 72 % | 47 % (★★★ 16 %) | 58 % | 76 % | 79 % | 69 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 72 % | 52 % (★★★ 21 %) | 69 % | 82 % | 86 % | 77 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 72 % | 56 % (★★★ 24 %) | 72 % | 85 % | 88 % | 80 % |
| 10 liv (`maxHp=10`) | 77 % | 58 % (★★★ 25 %) | 71 % | 86 % | 87 % | 79 % |
| 8 liv (`maxHp=8`) | 67 % | 50 % (★★★ 18 %) | 63 % | 80 % | 81 % | 71 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 45 % | 32 % (★★★ 10 %) | 45 % | 62 % | 67 % | 54 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 34 % | 25 % (★★★ 3 %) | 39 % | 50 % | 58 % | 50 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 72 % | 59 % (★★★ 17 %) | 72 % | 82 % | 86 % | 82 % |

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
