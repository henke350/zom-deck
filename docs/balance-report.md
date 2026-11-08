# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 72 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 64 % og 77 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 56 % af spillene, men får ★★★ i 18 %.
- Spillene slutter i gennemsnit i tur 5,0.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 48 % | 51 % | 8,7 | 5,2 | 11,5 | 1,4 | 0,6 |
| Skynd dig hjem | 72 % | 72 % | 0 % | 0 % | 28 % | 0 % | 3,7 | 5,0 | 11,6 | 0,0 | 0,4 |
| Grådig | 44 % | 12 % | 14 % | 18 % | 56 % | 0 % | 5,4 | 3,5 | 18,6 | 6,3 | 0,6 |
| Stille | 64 % | 25 % | 39 % | 0 % | 36 % | 1 % | 4,8 | 4,6 | 18,4 | 6,3 | 0,5 |
| Kæmper | 73 % | 27 % | 46 % | 0 % | 25 % | 2 % | 5,5 | 5,2 | 18,0 | 6,0 | 0,5 |
| Løber | 77 % | 28 % | 49 % | 0 % | 22 % | 2 % | 5,1 | 5,3 | 17,3 | 5,1 | 0,5 |
| Let bagage | 70 % | 28 % | 42 % | 0 % | 28 % | 2 % | 5,3 | 4,8 | 17,2 | 5,7 | 1,1 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 5 % | 1,3 | 5,4 | 0,2 | 0,4 | 0,3 | 0,0 | 1,2 | 0,3 |
| Skynd dig hjem | 21 % | 3,3 | 2,4 | 0,3 | 0,0 | 0,2 | 0,0 | 1,9 | 0,0 |
| Grådig | 50 % | 5,1 | 3,6 | 2,4 | 0,1 | 0,9 | 2,6 | 3,9 | 3,0 |
| Stille | 31 % | 4,5 | 2,3 | 2,1 | 0,0 | 1,0 | 2,4 | 3,8 | 1,0 |
| Kæmper | 22 % | 3,6 | 2,1 | 1,8 | 0,0 | 0,6 | 2,3 | 3,7 | 2,9 |
| Løber | 18 % | 3,3 | 1,9 | 1,6 | 0,0 | 0,4 | 2,0 | 3,7 | 2,2 |
| Let bagage | 24 % | 3,8 | 2,3 | 1,8 | 0,0 | 0,5 | 2,2 | 3,7 | 2,3 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,8 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,4 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,3 | 0,6 | 1,2 |
| Stille | 0,5 | 0,0 | 0,2 | 0,6 | 1,0 |
| Kæmper | 0,1 | 0,0 | 0,2 | 0,5 | 0,9 |
| Løber | 0,1 | 0,0 | 0,2 | 0,5 | 0,9 |
| Let bagage | 0,1 | 0,0 | 0,1 | 0,6 | 0,8 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| alarmClock | 308 | 36 | 59 | 128 | 50 | 39 | 33 |
| runningShoes | 295 | 340 | 86 | 31 | 52 | 86 | 40 |
| bandage | 279 | 43 | 85 | 27 | 70 | 53 | 45 |
| knife | 227 | 123 | 40 | 58 | 73 | 31 | 24 |
| painkillers | 185 | 115 | 28 | 12 | 27 | 20 | 97 |
| bicycle | 184 | 150 | 51 | 38 | 23 | 42 | 30 |
| flashlight | 157 | 180 | 28 | 63 | 24 | 20 | 23 |
| baseballBat | 156 | 54 | 44 | 7 | 55 | 22 | 27 |
| axe | 149 | 98 | 35 | 9 | 60 | 30 | 16 |
| chainsaw | 112 | 12 | 24 | 21 | 31 | 17 | 18 |
| bow | 111 | 56 | 23 | 36 | 27 | 12 | 13 |
| toolbox | 108 | 30 | 10 | 2 | 3 | 9 | 84 |
| softSoles | 85 | 63 | 1 | 26 | 1 | 56 | 0 |
| scout | 73 | 70 | 13 | 38 | 12 | 4 | 7 |
| silentTakedown | 68 | 0 | 8 | 44 | 7 | 4 | 5 |
| crossbow | 68 | 60 | 14 | 21 | 12 | 9 | 13 |
| shotgun | 63 | 20 | 17 | 11 | 12 | 10 | 13 |
| repack | 62 | 70 | 2 | 1 | 2 | 1 | 56 |
| lockpick | 56 | 44 | 4 | 44 | 2 | 4 | 3 |
| nurse | 51 | 44 | 21 | 6 | 13 | 6 | 4 |
| firstAidKit | 30 | 3 | 11 | 6 | 4 | 6 | 4 |
| bouncer | 27 | 28 | 9 | 2 | 4 | 8 | 5 |
| streetKid | 20 | 25 | 6 | 2 | 5 | 3 | 4 |
| molotov | 18 | 4 | 0 | 0 | 18 | 0 | 0 |
| adrenaline | 17 | 5 | 0 | 0 | 0 | 16 | 0 |
| bazooka | 14 | 0 | 3 | 2 | 6 | 2 | 1 |
| machineGun | 9 | 2 | 3 | 1 | 3 | 1 | 1 |
| leafBlower | 5 | 0 | 1 | 1 | 1 | 1 | 1 |
| headShot | 3 | 1 | 1 | 1 | 1 | 0 | 0 |
| soldier | 3 | 2 | 1 | 0 | 0 | 1 | 1 |
| kevlarVest | 2 | 2 | 1 | 0 | 1 | 0 | 0 |
| travelLight | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| pistol | 1 | 32 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ammunition | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dog | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 72 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 33 % og med 4 i 18 %, men dør på vej hjem i 50 %.
- **Kan flere spillestile vinde?** Stille 64 %, Kæmper 73 %, Løber 77 %, Let bagage 70 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, knife · Kæmper: knife, bandage, axe · Løber: runningShoes, softSoles, bandage · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): leafBlower, headShot, soldier, kevlarVest, travelLight, pistol, districtMap, ammunition, dog.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 72 % | 44 % (★★★ 18 %) | 64 % | 73 % | 77 % | 70 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 90 % | 49 % (★★★ 20 %) | 69 % | 84 % | 87 % | 76 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 92 % | 39 % (★★★ 23 %) | 52 % | 53 % | 73 % | 56 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 79 % | 57 % (★★★ 11 %) | 70 % | 76 % | 83 % | 78 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 66 % | 38 % (★★★ 16 %) | 50 % | 62 % | 69 % | 60 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 71 % | 38 % (★★★ 18 %) | 61 % | 70 % | 74 % | 68 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 61 % | 44 % (★★★ 5 %) | 53 % | 62 % | 68 % | 64 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 30 % (★★★ 10 %) | 47 % | 67 % | 71 % | 65 % |
| Fund i afkastbunken (`findsToHand=false`) | 71 % | 30 % (★★★ 11 %) | 45 % | 60 % | 68 % | 60 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 40 % (★★★ 18 %) | 63 % | 69 % | 80 % | 70 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 75 % | 72 % (★★★ 36 %) | 78 % | 89 % | 91 % | 86 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 38 % (★★★ 17 %) | 49 % | 65 % | 72 % | 63 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 42 % (★★★ 19 %) | 60 % | 68 % | 80 % | 66 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 71 % | 47 % (★★★ 19 %) | 70 % | 78 % | 81 % | 75 % |
| 10 liv (`maxHp=10`) | 77 % | 41 % (★★★ 20 %) | 65 % | 77 % | 79 % | 73 % |
| 8 liv (`maxHp=8`) | 68 % | 37 % (★★★ 15 %) | 56 % | 66 % | 72 % | 65 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 52 % | 25 % (★★★ 9 %) | 42 % | 53 % | 64 % | 52 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 40 % | 20 % (★★★ 2 %) | 33 % | 45 % | 46 % | 45 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 71 % | 51 % (★★★ 15 %) | 70 % | 78 % | 82 % | 74 % |

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
