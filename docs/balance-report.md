# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 73 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 64 % og 86 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 53 % af spillene, men får ★★★ i 14 %.
- Spillene slutter i gennemsnit i tur 5,0.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 47 % | 52 % | 8,8 | 4,9 | 11,5 | 1,4 | 0,6 |
| Skynd dig hjem | 73 % | 73 % | 0 % | 0 % | 27 % | 0 % | 3,8 | 4,7 | 11,5 | 0,0 | 0,5 |
| Grådig | 47 % | 15 % | 18 % | 14 % | 53 % | 0 % | 5,4 | 2,4 | 19,2 | 7,1 | 0,6 |
| Stille | 64 % | 30 % | 34 % | 0 % | 36 % | 0 % | 4,8 | 3,9 | 18,5 | 6,7 | 0,5 |
| Kæmper | 84 % | 37 % | 47 % | 0 % | 16 % | 0 % | 5,8 | 4,7 | 19,0 | 7,1 | 0,6 |
| Løber | 86 % | 33 % | 53 % | 0 % | 14 % | 0 % | 5,1 | 4,7 | 18,0 | 5,9 | 0,4 |
| Let bagage | 78 % | 35 % | 43 % | 0 % | 22 % | 0 % | 5,3 | 4,2 | 17,7 | 6,4 | 1,1 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,1 | 0,2 | 0,4 | 0,3 | 0,0 | 1,2 | 0,3 |
| Skynd dig hjem | 22 % | 3,8 | 2,0 | 0,4 | 0,0 | 0,3 | 0,0 | 1,9 | 0,0 |
| Grådig | 46 % | 5,1 | 3,7 | 1,6 | 0,0 | 0,8 | 0,0 | 3,9 | 2,1 |
| Stille | 29 % | 4,9 | 2,1 | 1,4 | 0,0 | 0,8 | 0,0 | 3,8 | 0,2 |
| Kæmper | 13 % | 3,3 | 2,3 | 1,5 | 0,0 | 0,4 | 0,0 | 3,8 | 2,5 |
| Løber | 12 % | 3,3 | 1,8 | 1,3 | 0,0 | 0,4 | 0,0 | 3,8 | 1,5 |
| Let bagage | 19 % | 3,9 | 2,2 | 1,4 | 0,0 | 0,5 | 0,0 | 3,8 | 1,6 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,8 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,5 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,8 | 1,6 |
| Stille | 0,5 | 0,0 | 0,2 | 0,7 | 1,2 |
| Kæmper | 0,3 | 0,0 | 0,2 | 0,5 | 1,2 |
| Løber | 0,2 | 0,0 | 0,2 | 0,5 | 1,1 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 1,0 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| alarmClock | 366 | 37 | 77 | 144 | 69 | 41 | 36 |
| runningShoes | 338 | 393 | 105 | 32 | 49 | 105 | 47 |
| bandage | 325 | 47 | 104 | 19 | 100 | 52 | 50 |
| bicycle | 251 | 201 | 70 | 47 | 32 | 60 | 43 |
| knife | 229 | 120 | 40 | 65 | 76 | 28 | 21 |
| baseballBat | 221 | 73 | 61 | 8 | 87 | 33 | 32 |
| painkillers | 196 | 128 | 27 | 4 | 30 | 19 | 117 |
| bow | 165 | 75 | 30 | 49 | 52 | 17 | 17 |
| flashlight | 161 | 195 | 28 | 62 | 29 | 22 | 20 |
| axe | 156 | 115 | 37 | 5 | 66 | 36 | 12 |
| chainsaw | 155 | 27 | 35 | 30 | 45 | 24 | 21 |
| softSoles | 128 | 86 | 1 | 35 | 1 | 91 | 1 |
| toolbox | 124 | 27 | 7 | 1 | 2 | 7 | 107 |
| silentTakedown | 104 | 0 | 18 | 54 | 15 | 7 | 10 |
| crossbow | 95 | 82 | 21 | 26 | 19 | 10 | 18 |
| lockpick | 77 | 68 | 4 | 66 | 1 | 4 | 2 |
| repack | 76 | 75 | 2 | 1 | 1 | 1 | 70 |
| shotgun | 73 | 17 | 18 | 13 | 17 | 10 | 15 |
| firstAidKit | 39 | 4 | 16 | 6 | 10 | 6 | 2 |
| adrenaline | 22 | 10 | 1 | 1 | 0 | 20 | 0 |
| molotov | 13 | 3 | 0 | 0 | 13 | 0 | 0 |
| headShot | 4 | 2 | 2 | 0 | 1 | 0 | 0 |
| kevlarVest | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| travelLight | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| pistol | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 73 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 32 % og med 4 i 14 %, men dør på vej hjem i 46 %.
- **Kan flere spillestile vinde?** Stille 64 %, Kæmper 84 %, Løber 86 %, Let bagage 78 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, lockpick, knife · Kæmper: bandage, baseballBat, knife · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): headShot, kevlarVest, travelLight, pistol, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 73 % | 47 % (★★★ 14 %) | 64 % | 84 % | 86 % | 78 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 91 % | 61 % (★★★ 18 %) | 72 % | 90 % | 90 % | 85 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 95 % | 59 % (★★★ 34 %) | 68 % | 80 % | 89 % | 80 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 81 % | 62 % (★★★ 7 %) | 72 % | 84 % | 86 % | 86 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 70 % | 50 % (★★★ 19 %) | 60 % | 79 % | 77 % | 68 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 72 % | 41 % (★★★ 12 %) | 61 % | 80 % | 82 % | 76 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 62 % | 40 % (★★★ 4 %) | 53 % | 74 % | 77 % | 69 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 72 % | 36 % (★★★ 10 %) | 52 % | 68 % | 75 % | 72 % |
| Fund i afkastbunken (`findsToHand=false`) | 72 % | 36 % (★★★ 10 %) | 52 % | 67 % | 75 % | 67 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 72 % | 43 % (★★★ 12 %) | 60 % | 79 % | 83 % | 77 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 54 % (★★★ 19 %) | 69 % | 87 % | 88 % | 79 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 72 % | 30 % (★★★ 7 %) | 46 % | 63 % | 71 % | 54 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 72 % | 44 % (★★★ 13 %) | 63 % | 78 % | 82 % | 76 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 72 % | 44 % (★★★ 14 %) | 63 % | 82 % | 86 % | 78 % |
| 10 liv (`maxHp=10`) | 77 % | 49 % (★★★ 17 %) | 69 % | 83 % | 86 % | 80 % |
| 8 liv (`maxHp=8`) | 67 % | 42 % (★★★ 9 %) | 60 % | 75 % | 81 % | 70 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 45 % | 23 % (★★★ 5 %) | 41 % | 60 % | 60 % | 48 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 34 % | 17 % (★★★ 0 %) | 32 % | 47 % | 50 % | 41 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 72 % | 46 % (★★★ 10 %) | 69 % | 80 % | 85 % | 81 % |

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
