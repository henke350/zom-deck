# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 65 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 43 % og 63 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 67 % af spillene, men får ★★★ i 7 %.
- Spillene slutter i gennemsnit i tur 3,8, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0 % | 0 % | 0 % | 0 % | 57 % | 42 % | 8,3 | 1,5 | 10,1 | 0,5 | 1,1 |
| Skynd dig hjem | 65 % | 65 % | 0 % | 0 % | 35 % | 0 % | 3,3 | 4,3 | 11,5 | 0,0 | 0,4 |
| Grådig | 33 % | 15 % | 11 % | 7 % | 67 % | 0 % | 3,7 | 2,0 | 16,9 | 4,7 | 0,3 |
| Stille | 43 % | 25 % | 19 % | 0 % | 57 % | 0 % | 3,7 | 2,8 | 17,3 | 5,4 | 0,3 |
| Kæmper | 56 % | 27 % | 29 % | 0 % | 44 % | 0 % | 4,1 | 3,1 | 16,7 | 4,6 | 0,3 |
| Løber | 63 % | 32 % | 31 % | 0 % | 37 % | 0 % | 4,0 | 3,1 | 16,9 | 4,8 | 0,2 |
| Let bagage | 57 % | 29 % | 28 % | 0 % | 43 % | 0 % | 4,0 | 3,0 | 15,0 | 3,8 | 1,2 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Zombier fra horder | Fare ved slut | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,7 | 5,8 | 0,2 | 0,3 | 0,4 | 0,7 | 1,7 | 0,2 |
| Skynd dig hjem | 32 % | 3,7 | 3,0 | 0,6 | 0,0 | 0,6 | 2,0 | 3,0 | 0,0 |
| Grådig | 63 % | 4,9 | 4,8 | 2,1 | 0,0 | 1,4 | 2,9 | 3,9 | 1,4 |
| Stille | 52 % | 5,6 | 3,3 | 1,7 | 0,0 | 1,7 | 2,9 | 3,9 | 0,2 |
| Kæmper | 41 % | 4,5 | 3,6 | 1,8 | 0,0 | 1,0 | 2,9 | 3,9 | 1,6 |
| Løber | 34 % | 4,2 | 3,4 | 1,9 | 0,0 | 1,0 | 2,9 | 3,9 | 1,4 |
| Let bagage | 41 % | 4,4 | 3,6 | 1,7 | 0,0 | 1,0 | 2,9 | 3,9 | 1,3 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 3,7 | 0,4 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,6 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,2 | 1,0 | 1,3 |
| Stille | 0,3 | 0,0 | 0,2 | 0,9 | 1,2 |
| Kæmper | 0,1 | 0,0 | 0,2 | 0,7 | 1,0 |
| Løber | 0,2 | 0,0 | 0,2 | 0,7 | 1,1 |
| Let bagage | 0,1 | 0,0 | 0,1 | 0,7 | 1,0 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 376 | 118 | 87 | 52 | 76 | 106 | 55 |
| baseballBat | 245 | 34 | 71 | 20 | 85 | 47 | 22 |
| alarmClock | 234 | 18 | 38 | 132 | 34 | 24 | 7 |
| bicycle | 230 | 63 | 54 | 48 | 29 | 59 | 40 |
| bandage | 204 | 20 | 72 | 32 | 55 | 33 | 13 |
| chainsaw | 154 | 11 | 35 | 34 | 36 | 22 | 26 |
| shotgun | 141 | 13 | 33 | 33 | 30 | 19 | 26 |
| axe | 119 | 31 | 27 | 7 | 51 | 26 | 7 |
| softSoles | 108 | 18 | 2 | 37 | 2 | 67 | 1 |
| toolbox | 101 | 9 | 11 | 3 | 2 | 10 | 75 |
| painkillers | 100 | 14 | 1 | 2 | 1 | 0 | 96 |
| flashlight | 93 | 17 | 5 | 78 | 2 | 5 | 2 |
| lockpick | 59 | 12 | 3 | 46 | 3 | 5 | 2 |
| kevlarVest | 41 | 4 | 14 | 5 | 14 | 5 | 3 |
| adrenaline | 40 | 1 | 1 | 2 | 1 | 36 | 0 |
| firstAidKit | 29 | 3 | 8 | 5 | 6 | 6 | 4 |
| pistol | 24 | 2 | 8 | 2 | 8 | 5 | 1 |
| molotov | 21 | 2 | 0 | 0 | 21 | 0 | 0 |
| travelLight | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| districtMap | 1 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 65 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 18 % og med 4 i 7 %, men dør på vej hjem i 63 %.
- **Kan flere spillestile vinde?** Stille 43 %, Kæmper 56 %, Løber 63 %, Let bagage 57 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, runningShoes · Kæmper: baseballBat, runningShoes, bandage · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 65 % | 33 % (★★★ 7 %) | 43 % | 56 % | 63 % | 57 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 85 % | 38 % (★★★ 7 %) | 58 % | 73 % | 74 % | 71 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 60 % | 30 % (★★★ 4 %) | 61 % | 70 % | 72 % | 62 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 80 % | 35 % (★★★ 7 %) | 59 % | 63 % | 70 % | 62 % |
| Uden faremeter (før 23. okt.) (`danger.enabled=false`) | 69 % | 59 % (★★★ 25 %) | 65 % | 74 % | 79 % | 76 % |
| Faremeter uden horder (`danger.hordeSize=0`) | 64 % | 40 % (★★★ 11 %) | 54 % | 63 % | 71 % | 65 % |
| Sjældne fund hæver ikke faren (`danger.perRareFind=0`) | 63 % | 39 % (★★★ 10 %) | 49 % | 62 % | 68 % | 56 % |
| Mildere top (fare 4: 1 zombie pr. 3 støj) (`danger.levels.3.arrivals=1`) | 63 % | 44 % (★★★ 13 %) | 50 % | 63 % | 65 % | 61 % |
| 10 liv (`maxHp=10`) | 71 % | 39 % (★★★ 12 %) | 50 % | 59 % | 66 % | 56 % |
| 8 liv (`maxHp=8`) | 57 % | 29 % (★★★ 6 %) | 39 % | 50 % | 58 % | 49 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 41 % | 18 % (★★★ 3 %) | 24 % | 33 % | 38 % | 32 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 35 % | 9 % (★★★ 0 %) | 16 % | 30 % | 31 % | 25 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 63 % | 32 % (★★★ 8 %) | 42 % | 56 % | 63 % | 56 % |

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
