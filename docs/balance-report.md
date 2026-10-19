# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 60 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 89 % og 95 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 35 % af spillene, men får ★★★ i 28 %.
- Spillene slutter i gennemsnit i tur 5,5.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 1 % | 0 % | 0 % | 40 % | 60 % | 9,1 | 4,4 | 10,1 | 0,6 | 1,2 |
| Skynd dig hjem | 60 % | 60 % | 0 % | 0 % | 40 % | 0 % | 3,9 | 3,0 | 11,8 | 0,0 | 0,2 |
| Grådig | 65 % | 15 % | 23 % | 28 % | 35 % | 0 % | 6,2 | 2,5 | 18,2 | 5,4 | 0,3 |
| Stille | 89 % | 41 % | 48 % | 0 % | 11 % | 0 % | 5,6 | 3,9 | 18,1 | 5,8 | 0,2 |
| Kæmper | 93 % | 30 % | 63 % | 0 % | 7 % | 0 % | 5,9 | 4,6 | 17,5 | 5,0 | 0,2 |
| Løber | 95 % | 34 % | 61 % | 0 % | 5 % | 0 % | 5,6 | 4,5 | 17,9 | 5,4 | 0,1 |
| Let bagage | 95 % | 34 % | 60 % | 0 % | 5 % | 0 % | 5,9 | 4,4 | 15,9 | 4,5 | 1,2 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 7 % | 1,6 | 4,4 | 0,1 | 0,4 | 0,1 |
| Skynd dig hjem | 37 % | 4,3 | 3,2 | 0,2 | 0,0 | 0,0 |
| Grådig | 35 % | 4,3 | 3,6 | 1,1 | 0,0 | 0,8 |
| Stille | 10 % | 3,5 | 2,2 | 1,0 | 0,0 | 0,1 |
| Kæmper | 6 % | 3,1 | 1,8 | 0,8 | 0,0 | 0,7 |
| Løber | 5 % | 3,0 | 1,8 | 1,1 | 0,0 | 0,5 |
| Let bagage | 5 % | 3,2 | 1,6 | 0,8 | 0,0 | 0,5 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder, tjenester og gemmesteder

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil | Gemmesteder åbnet | Sjældne fund taget |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 0,4 | 4,3 | 0,5 | 0,1 | 0,1 |
| Skynd dig hjem | 0,0 | 0,0 | 0,2 | 0,5 | 0,0 |
| Grådig | 0,1 | 0,0 | 0,2 | 1,2 | 1,6 |
| Stille | 0,4 | 0,0 | 0,1 | 0,9 | 1,3 |
| Kæmper | 0,1 | 0,0 | 0,1 | 0,8 | 1,2 |
| Løber | 0,2 | 0,0 | 0,1 | 0,8 | 1,3 |
| Let bagage | 0,1 | 0,0 | 0,1 | 0,9 | 1,2 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge. Gemmesteder og sjældne fund er gennemsnit pr. spil.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 448 | 265 | 105 | 55 | 79 | 135 | 74 |
| axe | 274 | 31 | 70 | 18 | 111 | 61 | 14 |
| bicycle | 272 | 132 | 61 | 56 | 29 | 74 | 51 |
| baseballBat | 245 | 8 | 83 | 10 | 86 | 41 | 26 |
| alarmClock | 220 | 22 | 29 | 130 | 28 | 27 | 7 |
| chainsaw | 213 | 22 | 53 | 40 | 52 | 31 | 37 |
| shotgun | 161 | 31 | 45 | 31 | 35 | 22 | 28 |
| toolbox | 155 | 12 | 11 | 1 | 5 | 11 | 127 |
| softSoles | 153 | 13 | 2 | 56 | 2 | 91 | 1 |
| bandage | 144 | 28 | 47 | 14 | 40 | 33 | 11 |
| lockpick | 108 | 12 | 7 | 85 | 5 | 8 | 3 |
| flashlight | 91 | 11 | 2 | 85 | 2 | 1 | 1 |
| painkillers | 68 | 37 | 2 | 1 | 0 | 1 | 65 |
| molotov | 26 | 0 | 0 | 0 | 26 | 0 | 0 |
| pistol | 16 | 0 | 14 | 1 | 1 | 1 | 0 |
| kevlarVest | 13 | 0 | 11 | 1 | 1 | 0 | 0 |
| adrenaline | 8 | 0 | 1 | 0 | 1 | 7 | 0 |
| firstAidKit | 5 | 0 | 2 | 0 | 1 | 1 | 1 |
| travelLight | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 60 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 51 % og med 4 i 28 %, men dør på vej hjem i 35 %.
- **Kan flere spillestile vinde?** Stille 89 %, Kæmper 93 %, Løber 95 %, Let bagage 95 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, lockpick, flashlight · Kæmper: axe, baseballBat, runningShoes · Løber: runningShoes, softSoles, bicycle · Let bagage: toolbox, runningShoes, painkillers.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): firstAidKit, travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 60 % | 65 % (★★★ 28 %) | 89 % | 93 % | 95 % | 95 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 94 % | 84 % (★★★ 56 %) | 96 % | 99 % | 100 % | 100 % |
| 10 liv (`maxHp=10`) | 76 % | 70 % (★★★ 38 %) | 91 % | 95 % | 97 % | 97 % |
| 8 liv (`maxHp=8`) | 50 % | 58 % (★★★ 19 %) | 88 % | 92 % | 95 % | 92 % |
| Zombier giver 2 skade (`zombie.damage=2`) | 16 % | 33 % (★★★ 4 %) | 59 % | 77 % | 68 % | 74 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 18 % | 34 % (★★★ 2 %) | 51 % | 60 % | 61 % | 53 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 59 % | 69 % (★★★ 17 %) | 94 % | 95 % | 93 % | 95 % |

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
