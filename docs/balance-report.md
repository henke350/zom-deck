# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 68 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 60 % og 74 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 55 % af spillene, men får ★★★ i 16 %.
- Spillene slutter i gennemsnit i tur 4,0, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 55 % | 45 % | 8,4 | 3,1 | 10,1 | 0,6 | 1,1 |
| Skynd dig hjem | 68 % | 68 % | 0 % | 0 % | 32 % | 0 % | 3,3 | 4,2 | 11,5 | 0,0 | 0,4 |
| Grådig | 46 % | 14 % | 16 % | 16 % | 55 % | 0 % | 4,0 | 2,2 | 17,4 | 5,0 | 0,4 |
| Stille | 60 % | 29 % | 31 % | 0 % | 40 % | 0 % | 4,0 | 3,3 | 17,6 | 5,5 | 0,3 |
| Kæmper | 70 % | 25 % | 45 % | 0 % | 30 % | 0 % | 4,4 | 3,8 | 17,0 | 4,8 | 0,3 |
| Løber | 74 % | 30 % | 44 % | 0 % | 26 % | 0 % | 4,2 | 3,8 | 17,2 | 5,0 | 0,2 |
| Let bagage | 70 % | 25 % | 44 % | 0 % | 30 % | 0 % | 4,3 | 3,6 | 15,1 | 4,0 | 1,3 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,7 | 5,3 | 0,1 | 0,3 | 0,1 |
| Skynd dig hjem | 29 % | 3,9 | 2,8 | 0,2 | 0,0 | 0,0 |
| Grådig | 50 % | 5,1 | 3,9 | 0,9 | 0,0 | 0,8 |
| Stille | 35 % | 4,8 | 2,9 | 0,9 | 0,0 | 0,0 |
| Kæmper | 26 % | 4,2 | 2,7 | 0,8 | 0,0 | 1,0 |
| Løber | 23 % | 3,9 | 2,7 | 0,9 | 0,0 | 0,7 |
| Let bagage | 27 % | 4,1 | 2,8 | 0,8 | 0,0 | 0,8 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 3,9 | 0,4 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,4 | 0,6 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,3 | 1,1 | 1,5 |
| Stille | 0,3 | 0,0 | 0,2 | 0,9 | 1,3 |
| Kæmper | 0,1 | 0,0 | 0,2 | 0,8 | 1,1 |
| Løber | 0,2 | 0,0 | 0,2 | 0,8 | 1,2 |
| Let bagage | 0,1 | 0,0 | 0,1 | 0,8 | 1,1 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 367 | 115 | 85 | 43 | 77 | 106 | 57 |
| bicycle | 254 | 79 | 58 | 54 | 29 | 67 | 46 |
| baseballBat | 250 | 21 | 72 | 18 | 87 | 49 | 24 |
| alarmClock | 245 | 11 | 42 | 133 | 36 | 25 | 8 |
| bandage | 221 | 27 | 78 | 34 | 61 | 35 | 13 |
| chainsaw | 185 | 24 | 44 | 38 | 45 | 28 | 31 |
| shotgun | 151 | 18 | 37 | 30 | 34 | 21 | 29 |
| axe | 125 | 28 | 31 | 6 | 54 | 28 | 6 |
| softSoles | 118 | 24 | 2 | 46 | 2 | 68 | 1 |
| toolbox | 104 | 15 | 10 | 3 | 3 | 11 | 77 |
| flashlight | 103 | 19 | 6 | 88 | 2 | 5 | 3 |
| painkillers | 97 | 15 | 1 | 2 | 1 | 0 | 93 |
| lockpick | 53 | 13 | 3 | 45 | 2 | 3 | 1 |
| kevlarVest | 45 | 4 | 15 | 5 | 16 | 6 | 3 |
| adrenaline | 41 | 1 | 1 | 1 | 1 | 38 | 0 |
| pistol | 27 | 2 | 9 | 3 | 8 | 5 | 2 |
| firstAidKit | 24 | 3 | 8 | 4 | 5 | 3 | 4 |
| molotov | 20 | 1 | 0 | 0 | 19 | 0 | 0 |
| travelLight | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 68 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 32 % og med 4 i 16 %, men dør på vej hjem i 50 %.
- **Kan flere spillestile vinde?** Stille 60 %, Kæmper 70 %, Løber 74 %, Let bagage 70 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, bicycle · Kæmper: baseballBat, runningShoes, bandage · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 68 % | 46 % (★★★ 16 %) | 60 % | 70 % | 74 % | 70 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 88 % | 71 % (★★★ 25 %) | 71 % | 85 % | 86 % | 85 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 59 % | 64 % (★★★ 29 %) | 91 % | 94 % | 96 % | 95 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 82 % | 59 % (★★★ 25 %) | 73 % | 84 % | 87 % | 79 % |
| 10 liv (`maxHp=10`) | 72 % | 48 % (★★★ 22 %) | 63 % | 73 % | 78 % | 74 % |
| 8 liv (`maxHp=8`) | 60 % | 37 % (★★★ 8 %) | 53 % | 63 % | 66 % | 65 % |
| Zombier giver 2 skade (`zombie.damage=2`) | 35 % | 16 % (★★★ 2 %) | 28 % | 34 % | 40 % | 33 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 35 % | 15 % (★★★ 2 %) | 30 % | 35 % | 37 % | 36 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 69 % | 44 % (★★★ 16 %) | 59 % | 69 % | 72 % | 71 % |

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
