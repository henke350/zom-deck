# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 69 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 68 % og 89 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 40 % af spillene, men får ★★★ i 19 %.
- Spillene slutter i gennemsnit i tur 5,2.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 49 % | 50 % | 8,8 | 4,4 | 9,9 | 0,8 | 1,5 |
| Skynd dig hjem | 69 % | 69 % | 0 % | 0 % | 31 % | 0 % | 3,7 | 4,7 | 11,5 | 0,0 | 0,5 |
| Grådig | 59 % | 20 % | 21 % | 19 % | 40 % | 1 % | 5,7 | 2,7 | 20,7 | 8,5 | 0,6 |
| Stille | 68 % | 31 % | 37 % | 0 % | 32 % | 0 % | 4,8 | 4,0 | 18,8 | 6,9 | 0,5 |
| Kæmper | 89 % | 38 % | 51 % | 0 % | 11 % | 1 % | 6,1 | 5,2 | 20,5 | 8,7 | 0,6 |
| Løber | 88 % | 40 % | 48 % | 0 % | 12 % | 0 % | 5,5 | 4,8 | 20,1 | 8,0 | 0,4 |
| Let bagage | 82 % | 37 % | 44 % | 0 % | 18 % | 0 % | 5,4 | 4,3 | 16,7 | 6,2 | 1,9 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,7 | 5,2 | 0,2 | 0,4 | 0,5 | 0,0 | 1,7 | 0,3 |
| Skynd dig hjem | 26 % | 4,1 | 2,1 | 0,7 | 0,0 | 0,6 | 0,0 | 2,9 | 0,0 |
| Grådig | 36 % | 4,6 | 3,6 | 1,7 | 0,0 | 0,7 | 0,0 | 3,9 | 3,0 |
| Stille | 26 % | 4,8 | 2,0 | 1,4 | 0,0 | 0,9 | 0,0 | 3,8 | 0,5 |
| Kæmper | 9 % | 2,7 | 2,0 | 1,6 | 0,0 | 0,4 | 0,0 | 3,9 | 3,3 |
| Løber | 9 % | 3,0 | 2,0 | 1,6 | 0,0 | 0,4 | 0,0 | 3,9 | 2,3 |
| Let bagage | 15 % | 3,6 | 2,2 | 1,4 | 0,0 | 0,5 | 0,0 | 3,8 | 2,1 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,6 | 3,8 | 0,5 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,5 | 0,0 |
| Grådig | 0,2 | 0,0 | 0,3 | 0,7 | 1,9 |
| Stille | 0,5 | 0,0 | 0,2 | 0,7 | 1,2 |
| Kæmper | 0,3 | 0,0 | 0,2 | 0,5 | 1,4 |
| Løber | 0,3 | 0,0 | 0,2 | 0,5 | 1,5 |
| Let bagage | 0,2 | 0,0 | 0,1 | 0,6 | 1,1 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 456 | 507 | 126 | 36 | 70 | 148 | 76 |
| alarmClock | 369 | 31 | 76 | 148 | 72 | 46 | 27 |
| baseballBat | 352 | 145 | 95 | 8 | 132 | 69 | 48 |
| bandage | 326 | 43 | 109 | 20 | 97 | 63 | 37 |
| bicycle | 295 | 229 | 80 | 48 | 33 | 86 | 48 |
| painkillers | 216 | 108 | 31 | 5 | 32 | 22 | 127 |
| knife | 191 | 111 | 26 | 68 | 64 | 22 | 11 |
| flashlight | 164 | 195 | 32 | 58 | 34 | 26 | 14 |
| chainsaw | 163 | 22 | 38 | 27 | 50 | 28 | 20 |
| silentTakedown | 161 | 0 | 34 | 64 | 31 | 19 | 13 |
| softSoles | 156 | 71 | 2 | 30 | 1 | 123 | 0 |
| bow | 153 | 69 | 26 | 50 | 52 | 15 | 11 |
| axe | 139 | 101 | 37 | 5 | 61 | 31 | 5 |
| toolbox | 126 | 26 | 6 | 1 | 1 | 6 | 112 |
| lockpick | 117 | 105 | 17 | 64 | 18 | 12 | 5 |
| crossbow | 94 | 82 | 19 | 31 | 18 | 11 | 16 |
| shotgun | 77 | 26 | 20 | 13 | 16 | 12 | 16 |
| firstAidKit | 76 | 9 | 31 | 5 | 21 | 11 | 8 |
| molotov | 65 | 10 | 14 | 2 | 29 | 13 | 7 |
| headShot | 58 | 32 | 18 | 3 | 18 | 11 | 8 |
| pistol | 49 | 15 | 14 | 3 | 17 | 10 | 6 |
| adrenaline | 22 | 11 | 1 | 1 | 0 | 21 | 0 |
| travelLight | 7 | 9 | 0 | 0 | 0 | 0 | 7 |
| kevlarVest | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 69 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 39 % og med 4 i 19 %, men dør på vej hjem i 36 %.
- **Kan flere spillestile vinde?** Stille 68 %, Kæmper 89 %, Løber 88 %, Let bagage 82 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, knife, lockpick · Kæmper: baseballBat, bandage, alarmClock · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): kevlarVest, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 69 % | 59 % (★★★ 19 %) | 68 % | 89 % | 88 % | 82 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 88 % | 70 % (★★★ 20 %) | 77 % | 92 % | 92 % | 90 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 93 % | 65 % (★★★ 32 %) | 73 % | 76 % | 87 % | 75 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 79 % | 69 % (★★★ 12 %) | 77 % | 91 % | 91 % | 84 % |
| Lille by (3 × 3, 4 pakker, før 25. okt.) (`cityMap=classic packsOnMap=4`) | 66 % | 60 % (★★★ 25 %) | 62 % | 83 % | 84 % | 73 % |
| Stor by med 12 ture (skumring fra tur 10) (`turnLimit=12 duskFromTurn=10`) | 65 % | 57 % (★★★ 17 %) | 66 % | 88 % | 85 % | 78 % |
| Stor by med 4 pakker (`packsOnMap=4`) | 56 % | 53 % (★★★ 5 %) | 61 % | 83 % | 78 % | 74 % |
| Fund i afkastbunken og ingen ligsøgning (før 25. okt.) (`findsToHand=false zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 46 % (★★★ 13 %) | 57 % | 79 % | 82 % | 70 % |
| Fund i afkastbunken (`findsToHand=false`) | 65 % | 41 % (★★★ 10 %) | 58 % | 77 % | 79 % | 70 % |
| Ingen ligsøgning (`zombies.walker.loot=0 zombies.runner.loot=0 zombies.brute.loot=0 zombies.screamer.loot=0`) | 65 % | 55 % (★★★ 14 %) | 63 % | 83 % | 88 % | 77 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 71 % | 57 % (★★★ 18 %) | 66 % | 88 % | 89 % | 82 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 66 % | 41 % (★★★ 7 %) | 49 % | 77 % | 79 % | 64 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 65 % | 53 % (★★★ 14 %) | 63 % | 87 % | 85 % | 79 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 65 % | 57 % (★★★ 16 %) | 63 % | 88 % | 87 % | 81 % |
| 10 liv (`maxHp=10`) | 71 % | 61 % (★★★ 22 %) | 73 % | 92 % | 90 % | 81 % |
| 8 liv (`maxHp=8`) | 59 % | 49 % (★★★ 12 %) | 59 % | 87 % | 84 % | 74 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 43 % | 31 % (★★★ 7 %) | 43 % | 68 % | 64 % | 54 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 31 % | 21 % (★★★ 2 %) | 32 % | 50 % | 54 % | 42 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 65 % | 58 % (★★★ 12 %) | 71 % | 89 % | 86 % | 81 % |

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
