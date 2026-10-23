# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 71 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 64 % og 80 %, så stilene er ikke lige stærke.
- Grådighed koster: den grådige bot dør i 45 % af spillene, men får ★★★ i 22 %.
- Spillene slutter i gennemsnit i tur 4,2, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 53 % | 47 % | 8,4 | 2,8 | 10,1 | 0,6 | 1,1 |
| Skynd dig hjem | 71 % | 71 % | 0 % | 0 % | 29 % | 0 % | 3,4 | 4,4 | 11,5 | 0,0 | 0,5 |
| Grådig | 55 % | 18 % | 15 % | 22 % | 45 % | 0 % | 4,3 | 2,4 | 17,6 | 5,1 | 0,3 |
| Stille | 64 % | 27 % | 37 % | 0 % | 36 % | 0 % | 4,1 | 3,5 | 17,7 | 5,6 | 0,3 |
| Kæmper | 77 % | 26 % | 51 % | 0 % | 23 % | 0 % | 4,5 | 4,2 | 17,1 | 4,8 | 0,2 |
| Løber | 80 % | 26 % | 55 % | 0 % | 20 % | 0 % | 4,4 | 4,2 | 17,4 | 5,1 | 0,2 |
| Let bagage | 78 % | 28 % | 50 % | 0 % | 22 % | 0 % | 4,5 | 3,9 | 15,3 | 4,0 | 1,3 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Zombier fra skrig | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 6 % | 1,6 | 5,5 | 0,1 | 0,3 | 0,4 | 0,2 |
| Skynd dig hjem | 26 % | 3,6 | 2,8 | 0,3 | 0,0 | 0,4 | 0,0 |
| Grådig | 43 % | 4,5 | 4,0 | 0,9 | 0,0 | 0,4 | 1,5 |
| Stille | 33 % | 4,7 | 2,7 | 0,9 | 0,0 | 0,5 | 0,2 |
| Kæmper | 21 % | 3,5 | 2,8 | 0,9 | 0,0 | 0,3 | 1,5 |
| Løber | 18 % | 3,3 | 2,6 | 0,9 | 0,0 | 0,2 | 1,3 |
| Let bagage | 21 % | 3,5 | 2,8 | 0,8 | 0,0 | 0,3 | 1,3 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 3,8 | 0,4 | 0,1 | 0,0 |
| Skynd dig hjem | 0,0 | 0,0 | 0,5 | 0,6 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,3 | 1,0 | 1,4 |
| Stille | 0,4 | 0,0 | 0,2 | 0,9 | 1,2 |
| Kæmper | 0,1 | 0,0 | 0,2 | 0,7 | 1,1 |
| Løber | 0,2 | 0,0 | 0,2 | 0,7 | 1,1 |
| Let bagage | 0,1 | 0,0 | 0,1 | 0,8 | 1,0 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 407 | 144 | 97 | 50 | 82 | 119 | 59 |
| baseballBat | 263 | 38 | 74 | 21 | 92 | 51 | 25 |
| alarmClock | 250 | 10 | 44 | 139 | 35 | 24 | 8 |
| bicycle | 230 | 78 | 54 | 48 | 29 | 59 | 40 |
| bandage | 214 | 27 | 76 | 34 | 57 | 34 | 12 |
| chainsaw | 167 | 20 | 39 | 36 | 39 | 23 | 30 |
| shotgun | 156 | 19 | 37 | 34 | 33 | 22 | 29 |
| axe | 127 | 30 | 30 | 7 | 55 | 29 | 7 |
| softSoles | 116 | 20 | 3 | 40 | 2 | 70 | 1 |
| toolbox | 109 | 12 | 11 | 3 | 2 | 11 | 82 |
| flashlight | 102 | 18 | 5 | 88 | 2 | 5 | 3 |
| painkillers | 101 | 18 | 1 | 2 | 1 | 0 | 97 |
| lockpick | 54 | 11 | 3 | 45 | 2 | 3 | 1 |
| adrenaline | 46 | 2 | 1 | 2 | 1 | 42 | 0 |
| kevlarVest | 43 | 4 | 15 | 5 | 16 | 5 | 3 |
| firstAidKit | 32 | 4 | 11 | 5 | 7 | 5 | 4 |
| pistol | 27 | 2 | 9 | 3 | 8 | 6 | 2 |
| molotov | 22 | 2 | 0 | 0 | 21 | 0 | 0 |
| travelLight | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 71 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 37 % og med 4 i 22 %, men dør på vej hjem i 43 %.
- **Kan flere spillestile vinde?** Stille 64 %, Kæmper 77 %, Løber 80 %, Let bagage 78 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, runningShoes · Kæmper: baseballBat, runningShoes, bandage · Løber: runningShoes, softSoles, bicycle · Let bagage: painkillers, toolbox, runningShoes.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 71 % | 55 % (★★★ 22 %) | 64 % | 77 % | 80 % | 78 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 86 % | 68 % (★★★ 34 %) | 73 % | 87 % | 89 % | 86 % |
| Klassisk kort, alt synligt (før 21. okt.) (`randomCity=false hiddenBuildings=false`) | 69 % | 69 % (★★★ 29 %) | 91 % | 94 % | 97 % | 98 % |
| Tilfældig by, alt synligt (`hiddenBuildings=false`) | 83 % | 59 % (★★★ 26 %) | 80 % | 87 % | 87 % | 87 % |
| 10 liv (`maxHp=10`) | 75 % | 60 % (★★★ 34 %) | 69 % | 79 % | 85 % | 80 % |
| 8 liv (`maxHp=8`) | 61 % | 53 % (★★★ 16 %) | 59 % | 69 % | 73 % | 69 % |
| Zombier giver 2 skade (`zombies.walker.damage=2`) | 46 % | 26 % (★★★ 6 %) | 39 % | 50 % | 52 % | 46 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 39 % | 15 % (★★★ 1 %) | 29 % | 43 % | 43 % | 42 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 69 % | 59 % (★★★ 24 %) | 65 % | 74 % | 80 % | 77 % |

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
