# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 73 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 71 % og 89 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 40 % af spillene, men får ★★★ i 25 %.
- Spillene slutter i gennemsnit i tur 5,2.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 47 % | 53 % | 8,8 | 4,6 | 11,4 | 1,4 | 0,6 |
| Skynd dig hjem | 73 % | 73 % | 0 % | 0 % | 27 % | 0 % | 3,8 | 4,7 | 11,5 | 0,0 | 0,5 |
| Grådig | 59 % | 14 % | 20 % | 25 % | 40 % | 1 % | 5,8 | 3,4 | 19,1 | 6,8 | 0,7 |
| Stille | 71 % | 28 % | 43 % | 0 % | 29 % | 0 % | 5,0 | 4,6 | 18,2 | 6,3 | 0,6 |
| Kæmper | 85 % | 33 % | 52 % | 0 % | 13 % | 2 % | 5,9 | 5,3 | 18,5 | 6,6 | 0,6 |
| Løber | 89 % | 34 % | 56 % | 0 % | 10 % | 1 % | 5,5 | 5,3 | 18,4 | 6,3 | 0,5 |
| Let bagage | 80 % | 31 % | 49 % | 0 % | 19 % | 1 % | 5,4 | 5,0 | 17,2 | 6,0 | 1,2 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,1 | 0,2 | 0,4 | 0,3 | 0,0 | 1,2 | 0,3 |
| Skynd dig hjem | 22 % | 3,8 | 2,0 | 0,4 | 0,0 | 0,3 | 0,0 | 1,9 | 0,0 |
| Grådig | 36 % | 4,6 | 3,2 | 2,0 | 0,0 | 0,8 | 0,0 | 3,9 | 2,6 |
| Stille | 25 % | 4,3 | 2,0 | 1,7 | 0,0 | 0,7 | 0,0 | 3,8 | 0,6 |
| Kæmper | 11 % | 2,8 | 1,9 | 1,7 | 0,0 | 0,4 | 0,0 | 3,8 | 2,6 |
| Løber | 8 % | 2,6 | 1,7 | 1,8 | 0,0 | 0,4 | 0,0 | 3,8 | 2,0 |
| Let bagage | 17 % | 3,4 | 1,9 | 1,6 | 0,0 | 0,5 | 0,0 | 3,7 | 1,8 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,8 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,5 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,7 | 1,5 |
| Stille | 0,5 | 0,0 | 0,3 | 0,6 | 1,1 |
| Kæmper | 0,2 | 0,1 | 0,3 | 0,5 | 1,2 |
| Løber | 0,3 | 0,1 | 0,2 | 0,5 | 1,2 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 0,9 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| alarmClock | 344 | 38 | 70 | 133 | 60 | 46 | 35 |
| runningShoes | 335 | 384 | 99 | 31 | 46 | 119 | 41 |
| bandage | 314 | 48 | 101 | 25 | 86 | 58 | 44 |
| knife | 244 | 124 | 45 | 66 | 73 | 36 | 24 |
| bicycle | 242 | 209 | 63 | 41 | 30 | 70 | 39 |
| painkillers | 207 | 135 | 32 | 10 | 30 | 25 | 111 |
| baseballBat | 205 | 67 | 53 | 6 | 79 | 40 | 27 |
| flashlight | 170 | 205 | 33 | 59 | 30 | 25 | 23 |
| bow | 158 | 70 | 28 | 52 | 48 | 16 | 16 |
| chainsaw | 149 | 26 | 36 | 27 | 43 | 24 | 19 |
| axe | 142 | 104 | 37 | 4 | 63 | 28 | 11 |
| toolbox | 120 | 31 | 7 | 1 | 2 | 7 | 103 |
| softSoles | 111 | 63 | 1 | 25 | 1 | 83 | 1 |
| crossbow | 91 | 80 | 19 | 26 | 20 | 10 | 16 |
| silentTakedown | 84 | 0 | 11 | 49 | 10 | 7 | 6 |
| shotgun | 71 | 18 | 19 | 13 | 16 | 9 | 15 |
| lockpick | 67 | 56 | 4 | 57 | 1 | 3 | 2 |
| repack | 66 | 73 | 2 | 1 | 1 | 1 | 61 |
| firstAidKit | 36 | 4 | 16 | 5 | 9 | 4 | 2 |
| adrenaline | 20 | 8 | 0 | 1 | 0 | 18 | 0 |
| molotov | 12 | 2 | 0 | 0 | 12 | 0 | 0 |
| headShot | 7 | 2 | 3 | 1 | 1 | 0 | 1 |
| kevlarVest | 2 | 2 | 1 | 0 | 1 | 0 | 0 |
| travelLight | 2 | 2 | 0 | 0 | 0 | 1 | 1 |
| pistol | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dog | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 73 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 45 % og med 4 i 25 %, men dør på vej hjem i 36 %.
- **Kan flere spillestile vinde?** Stille 71 %, Kæmper 85 %, Løber 89 %, Let bagage 80 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, flashlight · Kæmper: bandage, baseballBat, knife · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, repack.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, travelLight, pistol, districtMap, dog.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 73 % | 59 % (★★★ 25 %) | 71 % | 85 % | 89 % | 80 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 91 % | 70 % (★★★ 27 %) | 78 % | 90 % | 90 % | 87 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 95 % | 66 % (★★★ 42 %) | 73 % | 82 % | 93 % | 79 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 81 % | 71 % (★★★ 14 %) | 76 % | 85 % | 92 % | 86 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 70 % | 51 % (★★★ 23 %) | 62 % | 80 % | 79 % | 70 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 72 % | 52 % (★★★ 24 %) | 66 % | 81 % | 89 % | 76 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 62 % | 54 % (★★★ 6 %) | 59 % | 76 % | 79 % | 72 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 72 % | 47 % (★★★ 17 %) | 57 % | 75 % | 83 % | 76 % |
| Fund i afkastbunken (`findsToHand=false`) | 72 % | 48 % (★★★ 19 %) | 56 % | 74 % | 79 % | 72 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 72 % | 53 % (★★★ 21 %) | 65 % | 80 % | 86 % | 80 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 66 % (★★★ 30 %) | 76 % | 92 % | 93 % | 84 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 72 % | 36 % (★★★ 11 %) | 53 % | 65 % | 77 % | 60 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 72 % | 55 % (★★★ 23 %) | 69 % | 82 % | 86 % | 78 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 72 % | 57 % (★★★ 24 %) | 73 % | 86 % | 87 % | 81 % |
| 10 liv (`maxHp=10`) | 77 % | 56 % (★★★ 27 %) | 74 % | 86 % | 91 % | 82 % |
| 8 liv (`maxHp=8`) | 67 % | 51 % (★★★ 19 %) | 65 % | 79 % | 82 % | 72 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 45 % | 32 % (★★★ 12 %) | 46 % | 65 % | 64 % | 53 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 34 % | 25 % (★★★ 3 %) | 42 % | 50 % | 56 % | 48 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 72 % | 57 % (★★★ 18 %) | 73 % | 83 % | 90 % | 81 % |

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
