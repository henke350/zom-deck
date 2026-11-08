# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 72 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 70 % og 85 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 42 % af spillene, men får ★★★ i 26 %.
- Spillene slutter i gennemsnit i tur 5,1.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 48 % | 51 % | 8,7 | 4,4 | 11,5 | 1,4 | 0,6 |
| Skynd dig hjem | 72 % | 72 % | 0 % | 0 % | 28 % | 0 % | 3,7 | 5,0 | 11,6 | 0,0 | 0,4 |
| Grådig | 57 % | 14 % | 17 % | 26 % | 42 % | 1 % | 5,8 | 3,7 | 18,8 | 6,3 | 0,6 |
| Stille | 70 % | 25 % | 45 % | 0 % | 30 % | 1 % | 5,0 | 4,9 | 18,4 | 6,3 | 0,5 |
| Kæmper | 82 % | 31 % | 51 % | 0 % | 17 % | 2 % | 5,7 | 5,3 | 18,0 | 5,9 | 0,5 |
| Løber | 85 % | 30 % | 54 % | 0 % | 14 % | 2 % | 5,2 | 5,4 | 17,3 | 5,1 | 0,5 |
| Let bagage | 78 % | 30 % | 48 % | 0 % | 21 % | 1 % | 5,4 | 5,0 | 17,2 | 5,6 | 1,1 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 4 % | 1,4 | 5,4 | 0,2 | 0,4 | 0,3 | 0,0 | 1,2 | 0,3 |
| Skynd dig hjem | 21 % | 3,3 | 2,4 | 0,3 | 0,0 | 0,2 | 0,0 | 1,9 | 0,0 |
| Grådig | 37 % | 4,3 | 3,5 | 2,6 | 0,1 | 0,8 | 0,0 | 3,9 | 3,1 |
| Stille | 24 % | 3,9 | 2,2 | 2,1 | 0,0 | 0,8 | 0,0 | 3,8 | 1,0 |
| Kæmper | 14 % | 2,9 | 2,1 | 1,9 | 0,0 | 0,5 | 0,0 | 3,7 | 2,8 |
| Løber | 11 % | 2,7 | 1,9 | 1,7 | 0,0 | 0,4 | 0,0 | 3,7 | 2,1 |
| Let bagage | 17 % | 3,2 | 2,2 | 1,9 | 0,0 | 0,5 | 0,0 | 3,7 | 2,2 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,7 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,4 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,7 | 1,3 |
| Stille | 0,5 | 0,0 | 0,2 | 0,6 | 1,0 |
| Kæmper | 0,2 | 0,0 | 0,2 | 0,5 | 1,0 |
| Løber | 0,1 | 0,1 | 0,2 | 0,5 | 0,9 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 0,8 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 311 | 362 | 93 | 32 | 53 | 91 | 43 |
| alarmClock | 302 | 32 | 56 | 127 | 49 | 38 | 31 |
| bandage | 262 | 44 | 82 | 26 | 64 | 49 | 40 |
| knife | 218 | 118 | 42 | 55 | 68 | 29 | 24 |
| bicycle | 204 | 177 | 55 | 37 | 26 | 51 | 35 |
| painkillers | 184 | 117 | 28 | 11 | 27 | 20 | 98 |
| baseballBat | 161 | 56 | 47 | 7 | 59 | 21 | 27 |
| flashlight | 141 | 168 | 25 | 54 | 23 | 19 | 20 |
| axe | 138 | 90 | 34 | 4 | 61 | 29 | 10 |
| chainsaw | 131 | 12 | 33 | 23 | 39 | 18 | 18 |
| bow | 117 | 51 | 24 | 38 | 30 | 12 | 13 |
| toolbox | 106 | 27 | 5 | 0 | 2 | 6 | 92 |
| softSoles | 84 | 59 | 1 | 27 | 1 | 56 | 0 |
| shotgun | 80 | 26 | 19 | 15 | 17 | 13 | 17 |
| crossbow | 79 | 69 | 18 | 26 | 14 | 9 | 12 |
| silentTakedown | 71 | 0 | 9 | 46 | 8 | 4 | 5 |
| scout | 68 | 66 | 11 | 36 | 10 | 4 | 7 |
| lockpick | 64 | 54 | 3 | 55 | 1 | 3 | 2 |
| repack | 60 | 67 | 1 | 1 | 1 | 1 | 57 |
| nurse | 48 | 43 | 21 | 6 | 12 | 6 | 3 |
| firstAidKit | 23 | 2 | 10 | 3 | 6 | 3 | 2 |
| bouncer | 21 | 23 | 8 | 1 | 2 | 7 | 4 |
| streetKid | 20 | 27 | 7 | 2 | 4 | 4 | 3 |
| adrenaline | 18 | 6 | 0 | 0 | 0 | 18 | 0 |
| molotov | 10 | 3 | 0 | 0 | 10 | 0 | 0 |
| soldier | 5 | 4 | 2 | 1 | 1 | 1 | 0 |
| headShot | 4 | 2 | 1 | 0 | 2 | 0 | 1 |
| kevlarVest | 2 | 2 | 1 | 0 | 1 | 0 | 0 |
| travelLight | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| pistol | 1 | 33 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ammunition | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dog | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 72 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 43 % og med 4 i 26 %, men dør på vej hjem i 37 %.
- **Kan flere spillestile vinde?** Stille 70 %, Kæmper 82 %, Løber 85 %, Let bagage 78 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, lockpick · Kæmper: knife, bandage, axe · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): headShot, kevlarVest, travelLight, pistol, districtMap, ammunition, dog.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 72 % | 57 % (★★★ 26 %) | 70 % | 82 % | 85 % | 78 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 90 % | 62 % (★★★ 28 %) | 78 % | 90 % | 87 % | 86 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 92 % | 60 % (★★★ 43 %) | 68 % | 72 % | 85 % | 73 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 79 % | 66 % (★★★ 16 %) | 77 % | 85 % | 90 % | 87 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 66 % | 52 % (★★★ 23 %) | 59 % | 77 % | 80 % | 73 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 71 % | 52 % (★★★ 26 %) | 67 % | 79 % | 84 % | 77 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 61 % | 51 % (★★★ 8 %) | 61 % | 74 % | 75 % | 73 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 43 % (★★★ 17 %) | 58 % | 75 % | 78 % | 74 % |
| Fund i afkastbunken (`findsToHand=false`) | 71 % | 44 % (★★★ 17 %) | 57 % | 77 % | 78 % | 73 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 52 % (★★★ 20 %) | 69 % | 79 % | 86 % | 78 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 75 % | 69 % (★★★ 32 %) | 79 % | 91 % | 89 % | 87 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 50 % (★★★ 23 %) | 62 % | 74 % | 78 % | 69 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 50 % (★★★ 24 %) | 67 % | 82 % | 85 % | 76 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 71 % | 57 % (★★★ 26 %) | 71 % | 86 % | 88 % | 85 % |
| 10 liv (`maxHp=10`) | 77 % | 57 % (★★★ 27 %) | 72 % | 85 % | 87 % | 81 % |
| 8 liv (`maxHp=8`) | 68 % | 52 % (★★★ 21 %) | 62 % | 79 % | 80 % | 71 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 52 % | 37 % (★★★ 15 %) | 43 % | 62 % | 68 % | 61 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 40 % | 29 % (★★★ 5 %) | 34 % | 48 % | 56 % | 49 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 71 % | 59 % (★★★ 20 %) | 72 % | 87 % | 86 % | 83 % |

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
