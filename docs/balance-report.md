# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- "Skynd dig hjem" vinder 61 %, under planens grænse på cirka 80 %.
- De fire spillestile vinder mellem 90 % og 96 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 34 % af spillene, men får ★★★ i 33 %.
- Spillene slutter i gennemsnit i tur 5,6, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 1 % | 0 % | 0 % | 0 % | 37 % | 63 % | 9,3 | 4,4 | 10,1 | 0,6 | 1,2 |
| Skynd dig hjem | 61 % | 61 % | 0 % | 0 % | 39 % | 0 % | 3,9 | 3,1 | 11,8 | 0,0 | 0,2 |
| Grådig | 66 % | 11 % | 22 % | 33 % | 34 % | 0 % | 6,2 | 2,7 | 17,2 | 4,4 | 0,4 |
| Stille | 90 % | 34 % | 56 % | 0 % | 10 % | 0 % | 5,8 | 3,9 | 17,5 | 5,2 | 0,3 |
| Kæmper | 95 % | 27 % | 69 % | 0 % | 5 % | 0 % | 5,9 | 4,9 | 16,8 | 4,3 | 0,2 |
| Løber | 93 % | 16 % | 77 % | 0 % | 7 % | 0 % | 5,8 | 4,7 | 16,4 | 3,8 | 0,2 |
| Let bagage | 96 % | 31 % | 65 % | 0 % | 4 % | 0 % | 6,0 | 4,6 | 14,8 | 3,6 | 1,4 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 7 % | 1,5 | 4,1 | 0,1 | 0,4 | 0,1 |
| Skynd dig hjem | 36 % | 4,3 | 3,1 | 0,1 | 0,0 | 0,0 |
| Grådig | 34 % | 4,4 | 3,5 | 0,9 | 0,0 | 0,7 |
| Stille | 10 % | 3,7 | 2,0 | 1,0 | 0,0 | 0,0 |
| Kæmper | 4 % | 3,2 | 1,5 | 0,7 | 0,0 | 0,6 |
| Løber | 7 % | 3,4 | 1,5 | 0,6 | 0,0 | 0,4 |
| Let bagage | 4 % | 3,3 | 1,4 | 0,7 | 0,0 | 0,4 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder og tjenester

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil |
| --- | ---: | ---: | ---: |
| Tilfældig | 0,5 | 4,4 | 0,5 |
| Skynd dig hjem | 0,0 | 0,0 | 0,2 |
| Grådig | 0,1 | 0,0 | 0,3 |
| Stille | 0,4 | 0,0 | 0,1 |
| Kæmper | 0,2 | 0,0 | 0,1 |
| Løber | 0,1 | 0,0 | 0,2 |
| Let bagage | 0,1 | 0,0 | 0,1 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 483 | 339 | 119 | 62 | 90 | 125 | 86 |
| axe | 333 | 53 | 83 | 20 | 130 | 83 | 17 |
| baseballBat | 253 | 9 | 100 | 10 | 91 | 24 | 29 |
| alarmClock | 242 | 28 | 34 | 146 | 30 | 24 | 8 |
| bandage | 159 | 47 | 53 | 16 | 47 | 29 | 13 |
| toolbox | 158 | 24 | 10 | 2 | 5 | 10 | 131 |
| softSoles | 132 | 20 | 2 | 61 | 2 | 65 | 1 |
| lockpick | 117 | 20 | 7 | 97 | 5 | 7 | 2 |
| flashlight | 109 | 11 | 3 | 101 | 2 | 1 | 2 |
| painkillers | 72 | 36 | 1 | 1 | 1 | 0 | 70 |
| molotov | 26 | 1 | 0 | 0 | 26 | 0 | 0 |
| pistol | 18 | 1 | 17 | 1 | 1 | 0 | 0 |
| kevlarVest | 18 | 0 | 15 | 1 | 1 | 0 | 0 |
| adrenaline | 12 | 0 | 1 | 0 | 0 | 11 | 0 |
| travelLight | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 61 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 55 % og med 4 i 33 %, men dør på vej hjem i 34 %.
- **Kan flere spillestile vinde?** Stille 90 %, Kæmper 95 %, Løber 93 %, Let bagage 96 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, lockpick · Kæmper: axe, baseballBat, runningShoes · Løber: runningShoes, axe, softSoles · Let bagage: toolbox, runningShoes, painkillers.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): travelLight, districtMap.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=8`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 61 % | 66 % (★★★ 33 %) | 90 % | 95 % | 93 % | 96 % |
| Som i M6: 10 liv, Run ×2 og Search ×3 (`maxHp=10 starterDeck.run=2 starterDeck.search=3`) | 93 % | 91 % (★★★ 69 %) | 97 % | 99 % | 100 % | 99 % |
| 10 liv (`maxHp=10`) | 83 % | 73 % (★★★ 43 %) | 90 % | 95 % | 96 % | 95 % |
| 8 liv (`maxHp=8`) | 53 % | 57 % (★★★ 20 %) | 87 % | 94 % | 92 % | 94 % |
| Zombier giver 2 skade (`zombie.damage=2`) | 16 % | 32 % (★★★ 7 %) | 63 % | 74 % | 78 % | 73 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 17 % | 32 % (★★★ 2 %) | 45 % | 63 % | 66 % | 51 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 65 % | 70 % (★★★ 18 %) | 94 % | 95 % | 97 % | 97 % |

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
