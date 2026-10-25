# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 66 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 60 % og 76 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 50 % af spillene, men får ★★★ i 16 %.
- Spillene slutter i gennemsnit i tur 4,1, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 54 % | 46 % | 8,4 | 2,2 | 10,1 | 0,6 | 1,1 |
| Skynd dig hjem | 66 % | 66 % | 0 % | 0 % | 34 % | 0 % | 3,3 | 4,3 | 11,5 | 0,0 | 0,4 |
| Grådig | 50 % | 18 % | 16 % | 16 % | 50 % | 0 % | 4,1 | 2,2 | 17,4 | 5,0 | 0,3 |
| Stille | 60 % | 26 % | 34 % | 0 % | 40 % | 0 % | 4,0 | 3,3 | 17,7 | 5,6 | 0,3 |
| Kæmper | 73 % | 27 % | 47 % | 0 % | 27 % | 0 % | 4,4 | 3,8 | 17,0 | 4,8 | 0,2 |
| Løber | 76 % | 29 % | 48 % | 0 % | 24 % | 0 % | 4,2 | 4,0 | 17,2 | 4,9 | 0,2 |
| Let bagage | 70 % | 24 % | 46 % | 0 % | 30 % | 0 % | 4,4 | 3,8 | 15,4 | 4,1 | 1,2 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,5 | 0,2 | 0,3 | 0,4 | 0,0 | 1,7 | 0,2 |
| Skynd dig hjem | 31 % | 3,7 | 2,9 | 0,6 | 0,0 | 0,6 | 0,0 | 3,0 | 0,0 |
| Grådig | 48 % | 4,6 | 4,2 | 1,4 | 0,0 | 0,6 | 0,0 | 3,9 | 1,5 |
| Stille | 37 % | 4,9 | 2,8 | 1,3 | 0,0 | 0,9 | 0,0 | 3,9 | 0,2 |
| Kæmper | 24 % | 3,7 | 3,0 | 1,3 | 0,0 | 0,4 | 0,0 | 3,9 | 1,5 |
| Løber | 21 % | 3,5 | 2,8 | 1,3 | 0,0 | 0,4 | 0,0 | 3,9 | 1,4 |
| Let bagage | 28 % | 3,8 | 3,0 | 1,3 | 0,0 | 0,4 | 0,0 | 3,9 | 1,3 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 3,8 | 0,4 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,6 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,2 | 1,0 | 2,0 |
| Stille | 0,3 | 0,0 | 0,2 | 0,9 | 1,7 |
| Kæmper | 0,1 | 0,0 | 0,2 | 0,7 | 1,5 |
| Løber | 0,2 | 0,0 | 0,2 | 0,7 | 1,6 |
| Let bagage | 0,1 | 0,0 | 0,1 | 0,8 | 1,3 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| bicycle | 374 | 97 | 86 | 78 | 49 | 101 | 60 |
| runningShoes | 351 | 132 | 84 | 41 | 70 | 106 | 50 |
| baseballBat | 252 | 34 | 71 | 16 | 98 | 42 | 25 |
| alarmClock | 224 | 9 | 30 | 148 | 26 | 15 | 5 |
| chainsaw | 199 | 16 | 46 | 41 | 52 | 30 | 31 |
| shotgun | 172 | 18 | 43 | 36 | 39 | 23 | 31 |
| bandage | 155 | 20 | 57 | 23 | 46 | 21 | 8 |
| painkillers | 104 | 18 | 1 | 1 | 0 | 0 | 102 |
| softSoles | 101 | 19 | 1 | 35 | 1 | 63 | 0 |
| toolbox | 98 | 11 | 7 | 1 | 1 | 6 | 84 |
| axe | 97 | 26 | 22 | 4 | 45 | 23 | 3 |
| flashlight | 77 | 18 | 2 | 71 | 1 | 2 | 1 |
| firstAidKit | 66 | 4 | 25 | 10 | 14 | 10 | 7 |
| lockpick | 53 | 11 | 2 | 47 | 1 | 3 | 0 |
| adrenaline | 42 | 1 | 1 | 1 | 1 | 40 | 0 |
| kevlarVest | 33 | 5 | 10 | 3 | 15 | 4 | 1 |
| pistol | 19 | 2 | 7 | 2 | 5 | 4 | 1 |
| molotov | 13 | 1 | 0 | 0 | 13 | 0 | 0 |
| travelLight | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 66 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 32 % og med 4 i 16 %, men dør på vej hjem i 48 %.
- **Kan flere spillestile vinde?** Stille 60 %, Kæmper 73 %, Løber 76 %, Let bagage 70 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, bicycle, flashlight · Kæmper: baseballBat, runningShoes, chainsaw · Løber: runningShoes, bicycle, softSoles · Let bagage: painkillers, toolbox, bicycle.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 66 % | 50 % (★★★ 16 %) | 60 % | 73 % | 76 % | 70 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 86 % | 67 % (★★★ 31 %) | 73 % | 85 % | 87 % | 82 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 67 % | 63 % (★★★ 24 %) | 90 % | 92 % | 95 % | 98 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 81 % | 66 % (★★★ 27 %) | 72 % | 82 % | 87 % | 79 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 69 % | 59 % (★★★ 25 %) | 65 % | 74 % | 79 % | 76 % |
| Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning) (`danger.hordeSize=1 danger.levels.3.arrivals=2 danger.levels.1.rareFindWeight=0.25 danger.levels.2.rareFindWeight=0.25 danger.levels.3.rareFindWeight=0.25 danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 63 % | 32 % (★★★ 8 %) | 41 % | 55 % | 63 % | 55 % |
| Faremeter uden ekstra fund (`danger.levels.2.extraFinds=0 danger.levels.3.extraFinds=0`) | 64 % | 50 % (★★★ 20 %) | 62 % | 74 % | 76 % | 72 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 64 % | 51 % (★★★ 19 %) | 62 % | 72 % | 78 % | 70 % |
| 10 liv (`maxHp=10`) | 72 % | 57 % (★★★ 25 %) | 64 % | 73 % | 80 % | 79 % |
| 8 liv (`maxHp=8`) | 57 % | 42 % (★★★ 14 %) | 53 % | 65 % | 73 % | 66 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 43 % | 29 % (★★★ 6 %) | 36 % | 44 % | 55 % | 40 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 35 % | 15 % (★★★ 1 %) | 30 % | 38 % | 39 % | 38 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 64 % | 52 % (★★★ 20 %) | 61 % | 71 % | 79 % | 72 % |

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
