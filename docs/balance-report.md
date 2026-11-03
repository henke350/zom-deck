# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 72 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 69 % og 85 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 46 % af spillene, men får ★★★ i 22 %.
- Spillene slutter i gennemsnit i tur 5,0.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 47 % | 52 % | 8,7 | 5,5 | 11,5 | 1,3 | 0,6 |
| Skynd dig hjem | 72 % | 72 % | 0 % | 0 % | 28 % | 0 % | 3,7 | 5,0 | 11,6 | 0,0 | 0,4 |
| Grådig | 54 % | 15 % | 17 % | 22 % | 46 % | 0 % | 5,5 | 3,3 | 18,7 | 6,3 | 0,6 |
| Stille | 69 % | 25 % | 44 % | 0 % | 31 % | 0 % | 4,8 | 4,7 | 18,2 | 6,2 | 0,5 |
| Kæmper | 82 % | 32 % | 50 % | 0 % | 17 % | 1 % | 5,6 | 5,2 | 18,2 | 6,2 | 0,6 |
| Løber | 85 % | 32 % | 53 % | 0 % | 14 % | 1 % | 5,3 | 5,3 | 18,2 | 6,0 | 0,5 |
| Let bagage | 78 % | 31 % | 47 % | 0 % | 21 % | 1 % | 5,3 | 4,9 | 17,1 | 5,6 | 1,1 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 5 % | 1,3 | 5,4 | 0,2 | 0,4 | 0,3 | 0,0 | 1,2 | 0,3 |
| Skynd dig hjem | 21 % | 3,3 | 2,4 | 0,3 | 0,0 | 0,2 | 0,0 | 1,9 | 0,0 |
| Grådig | 41 % | 4,5 | 3,6 | 2,6 | 0,1 | 0,7 | 0,0 | 3,8 | 3,0 |
| Stille | 27 % | 4,1 | 2,2 | 2,0 | 0,0 | 0,9 | 0,0 | 3,8 | 1,0 |
| Kæmper | 13 % | 2,8 | 2,2 | 2,1 | 0,0 | 0,4 | 0,0 | 3,8 | 3,0 |
| Løber | 11 % | 2,6 | 2,0 | 2,2 | 0,0 | 0,4 | 0,0 | 3,8 | 2,6 |
| Let bagage | 18 % | 3,3 | 2,2 | 1,9 | 0,0 | 0,5 | 0,0 | 3,7 | 2,2 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,7 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,4 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,7 | 1,5 |
| Stille | 0,4 | 0,0 | 0,2 | 0,6 | 1,1 |
| Kæmper | 0,2 | 0,0 | 0,2 | 0,5 | 1,1 |
| Løber | 0,3 | 0,0 | 0,2 | 0,5 | 1,1 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 0,9 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| alarmClock | 324 | 33 | 64 | 128 | 58 | 45 | 29 |
| runningShoes | 311 | 354 | 91 | 31 | 45 | 107 | 36 |
| bandage | 306 | 47 | 97 | 28 | 79 | 59 | 44 |
| knife | 235 | 125 | 43 | 64 | 67 | 35 | 26 |
| bicycle | 232 | 195 | 60 | 42 | 29 | 64 | 37 |
| baseballBat | 204 | 81 | 51 | 7 | 78 | 40 | 28 |
| painkillers | 195 | 125 | 28 | 11 | 28 | 22 | 105 |
| flashlight | 156 | 181 | 27 | 59 | 26 | 25 | 19 |
| bow | 146 | 71 | 24 | 48 | 44 | 14 | 15 |
| axe | 138 | 88 | 35 | 5 | 59 | 28 | 11 |
| chainsaw | 134 | 14 | 33 | 23 | 39 | 21 | 18 |
| toolbox | 114 | 29 | 6 | 1 | 2 | 7 | 98 |
| softSoles | 107 | 61 | 1 | 23 | 1 | 80 | 1 |
| crossbow | 83 | 71 | 20 | 25 | 15 | 9 | 14 |
| silentTakedown | 78 | 0 | 11 | 45 | 10 | 6 | 6 |
| shotgun | 77 | 24 | 19 | 14 | 17 | 12 | 16 |
| lockpick | 64 | 51 | 3 | 55 | 1 | 3 | 2 |
| repack | 63 | 69 | 1 | 1 | 1 | 1 | 58 |
| firstAidKit | 34 | 4 | 15 | 5 | 9 | 5 | 1 |
| adrenaline | 19 | 8 | 0 | 1 | 0 | 18 | 0 |
| molotov | 10 | 3 | 0 | 0 | 10 | 0 | 0 |
| headShot | 6 | 3 | 2 | 0 | 1 | 1 | 1 |
| kevlarVest | 3 | 2 | 1 | 0 | 1 | 0 | 0 |
| pistol | 2 | 32 | 1 | 0 | 0 | 0 | 0 |
| travelLight | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ammunition | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dog | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 72 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 39 % og med 4 i 22 %, men dør på vej hjem i 41 %.
- **Kan flere spillestile vinde?** Stille 69 %, Kæmper 82 %, Løber 85 %, Let bagage 78 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, flashlight · Kæmper: bandage, baseballBat, knife · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, pistol, travelLight, districtMap, ammunition, dog.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 72 % | 54 % (★★★ 22 %) | 69 % | 82 % | 85 % | 78 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 90 % | 65 % (★★★ 27 %) | 79 % | 91 % | 88 % | 84 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 92 % | 56 % (★★★ 38 %) | 65 % | 73 % | 88 % | 76 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 79 % | 62 % (★★★ 15 %) | 76 % | 84 % | 88 % | 85 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 66 % | 47 % (★★★ 19 %) | 58 % | 73 % | 71 % | 70 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 71 % | 48 % (★★★ 22 %) | 64 % | 80 % | 85 % | 75 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 61 % | 52 % (★★★ 7 %) | 59 % | 72 % | 77 % | 72 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 43 % (★★★ 17 %) | 59 % | 75 % | 78 % | 72 % |
| Fund i afkastbunken (`findsToHand=false`) | 71 % | 41 % (★★★ 19 %) | 54 % | 74 % | 80 % | 74 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 50 % (★★★ 19 %) | 64 % | 84 % | 82 % | 75 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 75 % | 67 % (★★★ 34 %) | 76 % | 88 % | 90 % | 86 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 46 % (★★★ 15 %) | 64 % | 76 % | 81 % | 67 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 46 % (★★★ 20 %) | 68 % | 84 % | 86 % | 77 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 71 % | 56 % (★★★ 25 %) | 68 % | 86 % | 88 % | 82 % |
| 10 liv (`maxHp=10`) | 77 % | 57 % (★★★ 24 %) | 70 % | 85 % | 88 % | 80 % |
| 8 liv (`maxHp=8`) | 68 % | 44 % (★★★ 17 %) | 58 % | 82 % | 82 % | 71 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 52 % | 33 % (★★★ 14 %) | 47 % | 65 % | 69 % | 58 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 40 % | 26 % (★★★ 4 %) | 41 % | 49 % | 60 % | 43 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 71 % | 54 % (★★★ 16 %) | 71 % | 84 % | 88 % | 80 % |

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
