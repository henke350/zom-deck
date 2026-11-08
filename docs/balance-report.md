# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 72 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 62 % og 77 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 57 % af spillene, men får ★★★ i 18 %.
- Spillene slutter i gennemsnit i tur 4,9.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 52 % | 47 % | 8,5 | 4,9 | 11,5 | 1,4 | 0,6 |
| Skynd dig hjem | 72 % | 72 % | 0 % | 0 % | 28 % | 0 % | 3,7 | 5,0 | 11,6 | 0,0 | 0,4 |
| Grådig | 42 % | 11 % | 13 % | 18 % | 57 % | 0 % | 5,3 | 3,3 | 18,6 | 6,3 | 0,6 |
| Stille | 62 % | 24 % | 38 % | 0 % | 38 % | 1 % | 4,8 | 4,6 | 18,4 | 6,4 | 0,5 |
| Kæmper | 72 % | 26 % | 46 % | 0 % | 27 % | 1 % | 5,5 | 5,2 | 18,0 | 5,9 | 0,6 |
| Løber | 77 % | 30 % | 48 % | 0 % | 21 % | 1 % | 5,1 | 5,4 | 17,2 | 5,1 | 0,5 |
| Let bagage | 70 % | 30 % | 40 % | 0 % | 29 % | 1 % | 5,2 | 4,9 | 17,2 | 5,7 | 1,1 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 4 % | 1,4 | 5,5 | 0,6 | 0,4 | 0,2 | 0,0 | 1,2 | 0,8 |
| Skynd dig hjem | 21 % | 3,3 | 2,4 | 0,3 | 0,0 | 0,2 | 0,0 | 1,9 | 0,0 |
| Grådig | 52 % | 5,2 | 3,7 | 2,4 | 0,1 | 0,9 | 2,6 | 3,9 | 3,0 |
| Stille | 32 % | 4,6 | 2,4 | 2,1 | 0,0 | 1,0 | 2,4 | 3,8 | 1,0 |
| Kæmper | 23 % | 3,7 | 2,1 | 1,9 | 0,0 | 0,6 | 2,3 | 3,7 | 2,9 |
| Løber | 17 % | 3,2 | 1,9 | 1,6 | 0,0 | 0,4 | 2,0 | 3,7 | 2,2 |
| Let bagage | 25 % | 3,9 | 2,2 | 1,8 | 0,0 | 0,6 | 2,2 | 3,7 | 2,3 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,7 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,4 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,3 | 0,7 | 1,2 |
| Stille | 0,5 | 0,0 | 0,2 | 0,6 | 1,0 |
| Kæmper | 0,1 | 0,0 | 0,2 | 0,5 | 0,9 |
| Løber | 0,1 | 0,1 | 0,3 | 0,5 | 0,9 |
| Let bagage | 0,1 | 0,0 | 0,2 | 0,6 | 0,8 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| alarmClock | 312 | 36 | 61 | 120 | 55 | 41 | 35 |
| bandage | 292 | 47 | 85 | 26 | 76 | 55 | 50 |
| runningShoes | 280 | 328 | 81 | 30 | 49 | 80 | 41 |
| knife | 220 | 126 | 44 | 52 | 66 | 32 | 26 |
| bicycle | 183 | 150 | 49 | 38 | 22 | 43 | 32 |
| painkillers | 182 | 118 | 30 | 12 | 26 | 20 | 94 |
| flashlight | 153 | 173 | 26 | 62 | 22 | 19 | 23 |
| axe | 150 | 97 | 36 | 8 | 60 | 29 | 17 |
| baseballBat | 142 | 50 | 40 | 6 | 51 | 21 | 24 |
| chainsaw | 111 | 13 | 24 | 21 | 30 | 18 | 19 |
| bow | 108 | 53 | 21 | 34 | 26 | 13 | 13 |
| toolbox | 107 | 29 | 9 | 2 | 3 | 9 | 84 |
| softSoles | 82 | 58 | 1 | 26 | 1 | 53 | 1 |
| scout | 76 | 72 | 13 | 38 | 12 | 4 | 8 |
| crossbow | 72 | 60 | 15 | 21 | 13 | 10 | 14 |
| silentTakedown | 72 | 0 | 10 | 43 | 9 | 5 | 6 |
| shotgun | 65 | 23 | 18 | 11 | 13 | 11 | 13 |
| lockpick | 58 | 46 | 4 | 44 | 2 | 5 | 3 |
| repack | 56 | 60 | 2 | 1 | 2 | 2 | 50 |
| nurse | 49 | 45 | 20 | 7 | 12 | 7 | 4 |
| firstAidKit | 33 | 3 | 12 | 6 | 5 | 6 | 4 |
| bouncer | 30 | 29 | 10 | 2 | 4 | 8 | 6 |
| meatBait | 26 | 0 | 1 | 22 | 1 | 1 | 1 |
| streetKid | 19 | 24 | 7 | 1 | 5 | 4 | 3 |
| molotov | 18 | 4 | 0 | 0 | 18 | 0 | 0 |
| adrenaline | 16 | 5 | 0 | 0 | 0 | 16 | 0 |
| bazooka | 12 | 0 | 2 | 2 | 7 | 1 | 1 |
| machineGun | 8 | 2 | 3 | 1 | 2 | 1 | 1 |
| leafBlower | 5 | 0 | 1 | 1 | 1 | 1 | 1 |
| headShot | 4 | 1 | 1 | 1 | 1 | 0 | 0 |
| soldier | 3 | 2 | 1 | 0 | 1 | 1 | 0 |
| kevlarVest | 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| travelLight | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| pistol | 1 | 32 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ammunition | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dog | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 72 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 31 % og med 4 i 18 %, men dør på vej hjem i 52 %.
- **Kan flere spillestile vinde?** Stille 62 %, Kæmper 72 %, Løber 77 %, Let bagage 70 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, knife · Kæmper: bandage, knife, axe · Løber: runningShoes, bandage, softSoles · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): leafBlower, headShot, soldier, kevlarVest, travelLight, pistol, districtMap, ammunition, dog.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 72 % | 42 % (★★★ 18 %) | 62 % | 72 % | 77 % | 70 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 90 % | 52 % (★★★ 25 %) | 75 % | 83 % | 85 % | 74 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 92 % | 37 % (★★★ 23 %) | 50 % | 54 % | 74 % | 55 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 79 % | 54 % (★★★ 11 %) | 75 % | 79 % | 84 % | 75 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 66 % | 37 % (★★★ 17 %) | 48 % | 68 % | 70 % | 63 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 71 % | 40 % (★★★ 17 %) | 58 % | 68 % | 76 % | 66 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 61 % | 42 % (★★★ 6 %) | 54 % | 63 % | 70 % | 61 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 31 % (★★★ 12 %) | 49 % | 67 % | 72 % | 63 % |
| Fund i afkastbunken (`findsToHand=false`) | 71 % | 33 % (★★★ 11 %) | 46 % | 64 % | 70 % | 60 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 71 % | 37 % (★★★ 16 %) | 62 % | 68 % | 78 % | 70 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 75 % | 69 % (★★★ 35 %) | 78 % | 88 % | 90 % | 86 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 38 % (★★★ 15 %) | 49 % | 63 % | 71 % | 59 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 71 % | 39 % (★★★ 16 %) | 56 % | 72 % | 78 % | 67 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 71 % | 45 % (★★★ 19 %) | 69 % | 80 % | 84 % | 73 % |
| 10 liv (`maxHp=10`) | 77 % | 43 % (★★★ 18 %) | 60 % | 76 % | 80 % | 69 % |
| 8 liv (`maxHp=8`) | 68 % | 39 % (★★★ 16 %) | 55 % | 67 % | 73 % | 63 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 52 % | 29 % (★★★ 10 %) | 42 % | 52 % | 62 % | 49 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 40 % | 19 % (★★★ 2 %) | 29 % | 46 % | 43 % | 42 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 71 % | 49 % (★★★ 16 %) | 71 % | 78 % | 82 % | 73 % |

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
