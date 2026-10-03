# Balancerapport

Lavet af simulatoren (`npm run sim`). 1000 spil pr. bot, samme byer (seed 1–1000) for alle bots. Standardtallene fra `src/data/balance.ts`.

Botterne ser kun det, en spiller ser på skærmen: zombiespænd i ubesøgte bygninger, ikke hvor de tilfældige pakker ligger. De spiller efter faste regler og er ikke så kloge som et menneske, men de er ens hver gang, så rapporten viser, hvad en ændring gør.

## Kort fortalt

- **For let:** "Skynd dig hjem" vinder 93 % uden at træffe valg (planens grænse er cirka 80 %).
- De fire spillestile vinder mellem 97 % og 99 %, så ingen stil er klart bedst.
- Grådighed koster: den grådige bot dør i 9 % af spillene, men får ★★★ i 66 %.
- Spillene slutter i gennemsnit i tur 5,2, og ingen tænkende bot når at blive overrasket af mørket.

## Resultat pr. bot

| Bot | Sejr | ★ | ★★ | ★★★ | Død | Mørke | Ture | Liv ved sejr | Dæk ved slut | Fund taget | Fjernet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 2 % | 2 % | 0 % | 0 % | 43 % | 55 % | 9,1 | 5,1 | 10,0 | 0,5 | 1,3 |
| Skynd dig hjem | 93 % | 93 % | 0 % | 0 % | 7 % | 0 % | 3,5 | 4,6 | 11,7 | 0,0 | 0,3 |
| Grådig | 91 % | 5 % | 20 % | 66 % | 9 % | 0 % | 6,3 | 3,9 | 18,3 | 5,1 | 0,3 |
| Stille | 97 % | 19 % | 78 % | 0 % | 3 % | 0 % | 5,5 | 5,9 | 18,0 | 5,6 | 0,3 |
| Kæmper | 99 % | 11 % | 88 % | 0 % | 1 % | 0 % | 5,4 | 7,0 | 17,2 | 4,5 | 0,2 |
| Løber | 99 % | 6 % | 94 % | 0 % | 1 % | 0 % | 5,0 | 6,8 | 16,7 | 3,9 | 0,2 |
| Let bagage | 99 % | 7 % | 92 % | 0 % | 1 % | 0 % | 5,4 | 6,9 | 15,4 | 3,8 | 1,3 |

_Ture_: gennemsnitlig tur, hvor spillet sluttede. _Dæk ved slut_: kort ejet til sidst (startdækket har 10). _Fjernet_: kort skrottet, brugt op eller fjernet.

## Hvor kommer faren fra?

| Bot | Død på vej hjem | Skade fra forfølgere | Skade fra zombier på stedet | Zombier fra støj | Zombier fra skumring | Dræbte zombier |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Tilfældig | 7 % | 2,0 | 5,0 | 0,1 | 0,4 | 0,1 |
| Skynd dig hjem | 7 % | 3,4 | 2,4 | 0,1 | 0,0 | 0,0 |
| Grådig | 9 % | 2,9 | 3,9 | 1,0 | 0,0 | 1,0 |
| Stille | 3 % | 2,3 | 2,1 | 1,1 | 0,0 | 0,0 |
| Kæmper | 1 % | 1,7 | 1,4 | 0,7 | 0,0 | 0,8 |
| Løber | 1 % | 1,9 | 1,4 | 0,7 | 0,0 | 0,6 |
| Let bagage | 1 % | 1,7 | 1,5 | 0,7 | 0,0 | 0,6 |

_Død på vej hjem_: dræbt med nok pakker til at vinde. Skade og zombier er gennemsnit pr. spil.

## Døde hænder og tjenester

| Bot | Hastesøgninger pr. spil | Tomme ture pr. spil | Dismantle/Patch up pr. spil |
| --- | ---: | ---: | ---: |
| Tilfældig | 0,5 | 3,9 | 0,5 |
| Skynd dig hjem | 0,2 | 0,0 | 0,3 |
| Grådig | 0,5 | 0,0 | 0,3 |
| Stille | 1,0 | 0,0 | 0,1 |
| Kæmper | 0,5 | 0,0 | 0,2 |
| Løber | 0,3 | 0,0 | 0,1 |
| Let bagage | 0,4 | 0,0 | 0,2 |

_Tom tur_: en tur, der sluttede uden at spille et kort, gå eller søge.

## Fundkort

Pr. 100 spil. "Taget" er summen for Grådig, Stille, Kæmper, Løber, Let bagage; "spillet" ligeså.

| Kort | Taget | Spillet | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| runningShoes | 484 | 340 | 127 | 62 | 87 | 121 | 88 |
| axe | 326 | 43 | 82 | 22 | 127 | 80 | 16 |
| baseballBat | 287 | 33 | 117 | 12 | 100 | 26 | 32 |
| alarmClock | 279 | 23 | 42 | 166 | 36 | 27 | 9 |
| bandage | 199 | 25 | 72 | 22 | 57 | 33 | 15 |
| toolbox | 164 | 7 | 11 | 4 | 7 | 11 | 131 |
| softSoles | 147 | 29 | 4 | 67 | 3 | 72 | 1 |
| lockpick | 116 | 16 | 8 | 94 | 4 | 7 | 3 |
| flashlight | 112 | 27 | 4 | 102 | 3 | 1 | 2 |
| painkillers | 89 | 33 | 3 | 3 | 2 | 1 | 81 |
| molotov | 26 | 1 | 0 | 0 | 26 | 0 | 0 |
| adrenaline | 21 | 0 | 2 | 1 | 1 | 16 | 0 |
| pistol | 19 | 3 | 18 | 0 | 0 | 0 | 0 |
| kevlarVest | 17 | 0 | 16 | 1 | 0 | 0 | 0 |
| districtMap | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| travelLight | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Spørgsmålene fra planen (afsnit 7)

- **Kan en fast rute vinde uden valg?** "Skynd dig hjem" vinder 93 % (grænsen er cirka 80 %).
- **Er det spændende at fortsætte eller gå hjem?** Den grådige bot kommer hjem med 3+ pakker i 86 % og med 4 i 66 %, men dør på vej hjem i 9 %.
- **Kan flere spillestile vinde?** Stille 97 %, Kæmper 99 %, Løber 99 %, Let bagage 99 %.
- **Bliver dækkene forskellige?** Mest tagne fund: Stille: alarmClock, flashlight, lockpick · Kæmper: axe, baseballBat, runningShoes · Løber: runningShoes, axe, softSoles · Let bagage: toolbox, runningShoes, painkillers.
- **Er der kort, ingen bruger?** Sjældent taget (under 5 pr. 100 spil): districtMap, travelLight.
- **Kan dårlige hænder håndteres?** 0,0 tomme ture pr. spil i gennemsnit for de tænkende bots.

## Hvad hvis?

Sejrsrate med ét eller flere balancetal ændret (300 spil pr. bot). Prøv selv med fx `npm run sim -- --set maxHp=9`.

| Ændring | Skynd dig hjem | Grådig | Stille | Kæmper | Løber | Let bagage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ingen (standard) | 93 % | 91 % (★★★ 66 %) | 97 % | 99 % | 99 % | 99 % |
| 8 liv (`maxHp=8`) | 76 % | 80 % (★★★ 37 %) | 94 % | 98 % | 97 % | 97 % |
| Zombier giver 2 skade (`zombie.damage=2`) | 44 % | 41 % (★★★ 12 %) | 64 % | 84 % | 79 % | 82 % |
| +1 startzombie i hver bygning (`extraStartZombies=1`) | 52 % | 43 % (★★★ 9 %) | 63 % | 87 % | 84 % | 82 % |
| Run ×1 og Search ×4 i startdækket (`starterDeck.run=1 starterDeck.search=4`) | 83 % | 73 % (★★★ 43 %) | 90 % | 95 % | 96 % | 95 % |
| 9 liv, Run ×1 og Search ×4 (`maxHp=9 starterDeck.run=1 starterDeck.search=4`) | 65 % | 65 % (★★★ 31 %) | 89 % | 96 % | 94 % | 95 % |
| 8 ture (skumring fra tur 6) (`turnLimit=8 duskFromTurn=6`) | 93 % | 90 % (★★★ 55 %) | 95 % | 98 % | 99 % | 99 % |

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
