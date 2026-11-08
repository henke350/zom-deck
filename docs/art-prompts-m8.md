# Codex prompt: the missing illustrations (M8)

Paste everything in the box below into Codex, with this repository open. It generates the
16 missing pictures in the same style as the existing ones, adds them to the game and opens a
pull request.

```
You are working in the repository for "One More Building", a small turn-based zombie
survival deckbuilder (React + TypeScript). Your job: create the 16 missing illustrations in
EXACTLY the same style as the existing ones, and add them to the game.

## Look first

Before generating anything, open and study these existing images; they are the style
reference and the new images must look like they belong to the same set:
- Cards: art-source/cards/search.png, crowbar.png, flashlight.png, kevlarVest.png, pistol.png
- Places: art-source/locations/pharmacy.png, police.png, supermarket.png, street.png
Also read docs/card-art-prompt.md and docs/location-art/prompt.md (the prompts used for
those images).

## Style (same for all 16)

- Landscape 3:2, 1536 x 1024 px, PNG. Full-bleed, no border, no frame, no transparency.
- Match the existing art: gritty, painterly, hand-inked graphic-novel illustration, muted
  and desaturated (concrete greys, dusty off-white, dark charcoal), soft low or overcast
  light, light paper texture. NOT photorealistic, NOT a 3D render, NOT cute, NOT anime.
- At most ONE accent colour per image: hazard amber #b87800, danger red #a5312a or safe
  teal #2a7462 (given per image below).
- Cards: ONE clear object in the centre, about 60 % of the image, with a calm margin of at
  least 10 % on every side (the game crops cards to a wide strip). Seen close, often with
  a hand or on a surface, like the existing cards.
- Places: ONE building seen from street level in a wide establishing shot, in a quiet
  abandoned European town a few weeks after an outbreak (closed shutters, litter, weeds).
- Everything must read clearly when shrunk to 200 px wide: bold silhouette, strong
  contrast between subject and background.
- Mood: tense, quiet, lonely. Not gory: no blood, no corpses, no violence on a person.
  Zombies only as a tiny dark silhouette far away, and only where stated.
- STRICT: NO text, letters, numbers, readable signs, logos or watermarks anywhere (shop
  signs and posters must be blank or unreadable). No close-up faces. Do not copy any
  existing franchise, brand, character or game artwork.

## The 16 images

Rare cards (in the game they get a gold frame, so they may feel a little special: a warm
shaft of light, a found treasure, but still the same muted style):

| file (id)       | Accent | Subject |
| --------------- | ------ | ------- |
| shotgun         | red    | A pump-action shotgun lying across a dusty wooden table, a few shells beside it. No muzzle flash, no person. |
| chainsaw        | red    | A heavy chainsaw resting on a workshop floor among wood shavings, the chain slightly oily. No blood. |
| bicycle         | teal   | A sturdy old city bicycle leaning against a grey wall, a small basket on the front, ready to ride. |
| firstAidKit     | teal   | An open hard-shell first aid kit (a plain cross symbol, no text) full of neatly packed bandages, scissors and pill packs. |
| crossbow        | red    | A compact hunting crossbow resting on a crate, three bolts lying beside it, cocked and ready. Silent and deadly. |

Ordinary weapon cards (no gold frame):

| file (id)       | Accent | Subject |
| --------------- | ------ | ------- |
| knife           | teal   | A plain sturdy kitchen or hunting knife lying on a worn wooden cutting board, its blade catching a thin line of light. No blood. |
| bow             | teal   | A simple recurve bow and a quiver with a few arrows leaning against a gym bench, like it was taken from a school sports hall. |
| headShot        | red    | Seen over the shoulder: a gloved hand steadying a pistol, a simple iron-sight or scope crosshair lined up on a blurred dark silhouette far down a ruined corridor. Calm, precise focus. No blood, no wound, nothing hit. |
| silentTakedown  | teal   | A silhouette's gloved hand reaching around a doorframe from the shadows, a dark zombie silhouette turned away in the corridor beyond. Quiet, stealthy, no violence shown. |

Places:

| file (id)       | Accent | Subject |
| --------------- | ------ | ------- |
| gasStation      | amber  | A small roadside petrol station: two pumps under a flat canopy, the kiosk windows dirty, a car left with its door open. Shop sign blank. |
| school          | amber  | A two-storey brick school building with long rows of windows, an empty playground with a rusty climbing frame, the front door ajar. |
| hospital        | red    | A large, grim hospital entrance: an ambulance parked askew, a cracked glass entrance, a cross symbol without text above the door. One tiny dark silhouette far behind the glass. |
| apartments      | red    | A tall grey apartment block of five or six storeys, many small balconies, some windows lit or broken, a stairwell door hanging open. Feels crowded and dangerous. |
| church          | teal   | A small old stone church with a modest bell tower, a heavy wooden door ajar, a quiet overgrown churchyard. The calmest place in town. |
| sportsShop      | amber  | A sports shop with a wide window showing bikes, balls and running shoes on display (blank signs), the glass cracked, a bicycle left at the door. |
| square          | amber  | An empty town square seen from its edge: a dry fountain in the middle, cobblestones, benches, four streets leading away, a lone tiny silhouette far off. |

## Steps

1. Generate shotgun.png and gasStation.png first and show them to me before going on.
   Check that they match the reference images and contain no text.
2. Generate the other fourteen. If an image contains any text or drifts in style, regenerate it.
3. Save the originals (1536 x 1024 PNG):
   - cards: art-source/cards/<id>.png
   - places: art-source/locations/<id>.png
4. Make the game copies: 768 x 512 WebP, quality about 80, same file name with .webp:
   - cards: src/assets/cards/<id>.webp
   - places: src/assets/locations/<id>.webp
   (The game picks them up automatically by file name; no code change is needed.)
5. Empty the `awaitingArt` lists in src/ui/cardImages.test.ts and
   src/ui/locationImages.test.ts (they name exactly these 16 ids), so the tests now require
   the new images.
6. Run `npm install` (once) and `npm run check`. It must pass.
7. Commit on a new branch (never on main), with a commit message in English, and open a
   pull request named "Add art for new cards and places".
```

## Hvis du hellere vil bruge ChatGPT

Brug samme tekst, men bed om ét billede ad gangen og gem dem selv med filnavnene ovenfor
(`shotgun.png`, `gasStation.png` osv.). Send mig billederne, så lægger jeg dem ind i spillet.

## Nyt kort: Repack (oktober 2026)

Kortet **Repack** mangler et billede. Indsæt denne tekst i Codex:

```
You are working in the repository for "One More Building". Create ONE new card illustration in
EXACTLY the same style as the existing card art, and add it to the game.

Look first: art-source/cards/search.png, crowbar.png, flashlight.png, painkillers.png and
docs/card-art-prompt.md. Use the same style rules as there: landscape 3:2, 1536 x 1024 px PNG,
full-bleed, gritty painterly graphic-novel look, muted and desaturated, one accent colour,
ONE clear object in the centre (about 60 %), a calm margin of at least 10 % on every side,
no text, letters, logos or watermarks, no faces, no gore.

Card: repack. Accent: teal #2a7462.
Subject: an open, worn hiking backpack on a concrete floor, seen from above, half its
contents laid out beside it in neat rows (a torch, a bandage roll, a water bottle, a folded
map without text). Two gloved hands pull one item out to make room. Calm, practical mood.

Steps:
1. Save the original as art-source/cards/repack.png (1536 x 1024).
2. Make the game copy: 768 x 512 WebP, quality about 80, at src/assets/cards/repack.webp.
3. Remove 'repack' from the awaitingArt list in src/ui/cardImages.test.ts.
4. Run `npm run check`. It must pass.
5. Commit on a new branch (never main) and open a pull request named "Add art for Repack".
```

## Nyt kort: Salvage (kampagnen, oktober 2026)

Kortet **Salvage** (materialer til basen) mangler et billede. Indsæt denne tekst i Codex:

```
You are working in the repository for "One More Building". Create ONE new card illustration in
EXACTLY the same style as the existing card art, and add it to the game.

Look first: art-source/cards/search.png, crowbar.png, repack.png, and docs/card-art-prompt.md.
Same style rules: landscape 3:2, 1536 x 1024 px PNG, full-bleed, gritty painterly
graphic-novel look, muted and desaturated, one accent colour, ONE clear object in the centre
(about 60 %), a calm margin of at least 10 % on every side, no text, letters, logos or
watermarks, no faces, no gore.

Card: salvage. Accent: hazard amber #b87800.
Subject: a heavy bundle of scrap tied together with rope on a concrete floor: planks, a few
metal pipes, a coil of wire, a car door panel and a small box of nails. It looks heavy and
useful, material to build with. A worn work glove lies on top.

Steps:
1. Save the original as art-source/cards/salvage.png (1536 x 1024).
2. Make the game copy: 768 x 512 WebP, quality about 80, at src/assets/cards/salvage.webp.
3. Remove 'salvage' from the awaitingArt list in src/ui/cardImages.test.ts.
4. Run `npm run check`. It must pass.
5. Commit on a new branch (never main) and open a pull request named "Add art for Salvage".
```

## Ny figur: Stray Dog (oktober 2026)

Hunden mangler et billede. Det vises, når den er blandt fundene. Indsæt denne tekst i Codex:

```
You are working in the repository for "One More Building". Create ONE new card illustration in
EXACTLY the same style as the existing card art, and add it to the game.

Look first: art-source/cards/search.png, silentTakedown.png, repack.png, and
docs/card-art-prompt.md. Same style rules: landscape 3:2, 1536 x 1024 px PNG, full-bleed,
gritty painterly graphic-novel look, muted and desaturated, one accent colour, ONE clear
subject in the centre (about 60 %), a calm margin of at least 10 % on every side, no text,
letters, logos or watermarks, no human faces, no gore.

Card: dog. Accent: safe teal #2a7462 (a worn teal collar or bandana).
Subject: a thin, scruffy medium-sized mixed-breed dog peeking out from under an overturned
table in an abandoned living room, ears up, wary but hopeful, looking at the viewer. Soft
light from a broken window. It should feel like a friend you would want to protect.

Steps:
1. Save the original as art-source/cards/dog.png (1536 x 1024).
2. Make the game copy: 768 x 512 WebP, quality about 80, at src/assets/cards/dog.webp.
3. Remove 'dog' from the awaitingArt list in src/ui/cardImages.test.ts.
4. Run `npm run check`. It must pass.
5. Commit on a new branch (never main) and open a pull request named "Add art for the Stray Dog".
```

## Nyt fund: Ammunition (november 2026)

Ammunition (kugler til Pistol, Shotgun og Head Shot) mangler et billede. Det vises, når den er blandt fundene. Indsæt denne tekst i Codex:

```
You are working in the repository for "One More Building". Create ONE new card illustration in
EXACTLY the same style as the existing card art, and add it to the game.

Look first: art-source/cards/pistol.png, shotgun.png, headShot.png, and
docs/card-art-prompt.md. Same style rules: landscape 3:2, 1536 x 1024 px PNG, full-bleed,
gritty painterly graphic-novel look, muted and desaturated, one accent colour, ONE clear
subject in the centre (about 60 %), a calm margin of at least 10 % on every side, no text,
letters, logos or watermarks, no human faces, no gore.

Card: ammunition. Accent: danger red #a5312a (a faded red stripe on the box).
Subject: a small, battered cardboard box of pistol bullets lying open, a handful of brass
cartridges spilled beside it, catching cold light. Simple background: a faint hint of a dusty
shelf. It should feel precious and scarce.

Steps:
1. Save the original as art-source/cards/ammunition.png (1536 x 1024).
2. Make the game copy: 768 x 512 WebP, quality about 80, at src/assets/cards/ammunition.webp.
3. Remove 'ammunition' from the awaitingArt list in src/ui/cardImages.test.ts.
4. Run `npm run check`. It must pass.
5. Commit on a new branch (never main) and open a pull request named "Add art for Ammunition".
```

## Nye allierede: Nurse, Soldier, Scout, Street Kid og Bouncer (november 2026)

De fem allierede mangler billeder. Indsæt denne tekst i Codex (den laver alle fem i én opgave):

```
You are working in the repository for "One More Building". Create FIVE new card illustrations
in EXACTLY the same style as the existing card art, and add them to the game.

Look first: art-source/cards/search.png, silentTakedown.png, kevlarVest.png, and
docs/card-art-prompt.md. Same style rules for all five: landscape 3:2, 1536 x 1024 px PNG,
full-bleed, gritty painterly graphic-novel look, muted and desaturated, one accent colour, ONE
clear subject in the centre (about 60 %), a calm margin of at least 10 % on every side, simple
background, no text, letters, logos or watermarks, no gore. These are people: show them from
behind, in silhouette or with the face turned away or shadowed, so no face is clearly visible.

1. nurse. Accent: safe teal #2a7462 (scrubs or a medical bag). A tired nurse in worn scrubs
   kneeling, opening a battered medical bag, a roll of bandage in hand.
2. soldier. Accent: danger red #a5312a (a faded red armband). A soldier in torn fatigues
   crouching behind a low wall, rifle raised, seen from behind and to the side.
3. scout. Accent: hazard amber #b87800 (a scarf). A lean scout in a hooded jacket on a rooftop
   ledge, looking through binoculars over an empty street.
4. streetKid. Accent: hazard amber #b87800 (a backpack). A scrawny teenager in an oversized
   hoodie squeezing through a gap in a fence, holding up a found can, face hidden by the hood.
5. bouncer. Accent: danger red #a5312a (a red door behind). A huge, broad-shouldered bouncer in
   a black jacket standing in front of a door, arms crossed, seen from behind.

Steps:
1. Save each original as art-source/cards/<id>.png (1536 x 1024), with the ids above.
2. Make the game copies: 768 x 512 WebP, quality about 80, at src/assets/cards/<id>.webp.
3. Remove 'nurse', 'soldier', 'scout', 'streetKid' and 'bouncer' from the awaitingArt list in
   src/ui/cardImages.test.ts.
4. Run `npm run check`. It must pass.
5. Commit on a new branch (never main) and open a pull request named "Add art for the allies".
```

## Samlet: alle 8 manglende kort (november 2026)

Denne prompt **erstatter** de enkelte prompts ovenfor for Salvage, Stray Dog, Ammunition og de fem allierede. Brug kun denne. Indsæt hele teksten i Codex:

```
You are working in the repository for "One More Building". Create EIGHT new card illustrations
in EXACTLY the same style as the existing card art, and add them to the game.

Branch: start from main. If src/data/cards.ts on main has no 'nurse' card yet, start from the
branch claude/festive-ride-3gk45u instead (the allies are there). Work on a new branch, never
main.

Look first: art-source/cards/search.png, silentTakedown.png, kevlarVest.png, crowbar.png and
pistol.png, and docs/card-art-prompt.md. Match them closely.

Style rules for all eight: landscape 3:2, 1536 x 1024 px PNG, full-bleed, gritty painterly
graphic-novel look, muted and desaturated, ONE accent colour (from: hazard amber #b87800,
danger red #a5312a, safe teal #2a7462), ONE clear subject in the centre (about 60 % of the
image), a calm margin of at least 10 % on every side, simple background (a soft colour field
or a faint hint of a wall, floor or street), no text, letters, numbers, logos or watermarks,
no gore. People are shown from behind, in silhouette, or with the face turned away or in
shadow: no face is clearly visible.

The eight cards (file id: accent, subject):

1. salvage: amber. A heavy bundle of scrap tied with rope on a concrete floor: planks, metal
   pipes, a coil of wire and a small box of nails, a worn work glove on top. Heavy but useful.
2. dog: teal (a worn collar or bandana). A thin, scruffy medium-sized mixed-breed dog peeking
   out from under an overturned table, ears up, wary but hopeful. A friend worth protecting.
3. ammunition: red (a faded stripe on the box). A small battered cardboard box of pistol
   bullets lying open, a few brass cartridges spilled beside it, catching cold light. Scarce.
4. nurse: teal (scrubs or a medical bag). A tired nurse in worn scrubs, kneeling and opening a
   battered medical bag, a roll of bandage in hand, seen from behind and to the side.
5. soldier: red (a faded armband). A soldier in torn fatigues crouching behind a low wall,
   rifle raised, seen from behind.
6. scout: amber (a scarf). A lean scout in a hooded jacket on a rooftop ledge, looking through
   binoculars over an empty street, seen from behind.
7. streetKid: amber (a backpack). A scrawny teenager in an oversized hoodie squeezing through
   a gap in a fence, holding up a found can, face hidden by the hood.
8. bouncer: red (a red door). A huge, broad-shouldered bouncer in a black jacket standing in
   front of a door, arms crossed, seen from behind.

Steps:
1. Save each original as art-source/cards/<id>.png (1536 x 1024), using the ids above.
2. Make the game copies: 768 x 512 WebP, quality about 80, at src/assets/cards/<id>.webp.
3. Check how src/ui/cardImages.ts picks up card images and make sure all eight are found.
4. Remove the eight ids from the awaitingArt list in src/ui/cardImages.test.ts (the list should
   end up empty).
5. Look at each finished image next to the existing ones: same style, colours and framing. Redo
   any that stand out.
6. Run `npm run check`. It must pass.
7. Commit and open a pull request named "Add art for the eight missing cards".
```

## Nye kort: Machine Gun, Bazooka, Leaf Blower og Meat Bait (november 2026)

Indsæt hele teksten i Codex (vedhæft ikke filen):

```
You are working in the repository for "One More Building". Create FOUR new card illustrations
in EXACTLY the same style as the existing card art, and add them to the game.

Branch: start from main and work on a new branch, never main. These four cards are NOT done
yet: none of them has a file in src/assets/cards/, and all four are listed in awaitingArt in
src/ui/cardImages.test.ts. This message is the whole task; ignore older prompts in the docs.

Look first: art-source/cards/pistol.png, shotgun.png, chainsaw.png and molotov.png, and
docs/card-art-prompt.md. Match them closely: landscape 3:2, 1536 x 1024 px PNG, full-bleed,
gritty painterly graphic-novel look, muted and desaturated, ONE accent colour (hazard amber
#b87800, danger red #a5312a or safe teal #2a7462), ONE clear object in the centre (about 60 %),
a calm margin of at least 10 % on every side, simple background, no text, letters, numbers,
logos or watermarks, no people, no gore. These four may be a little funny and over the top.

1. machineGun: red (a red strap). A big, battered belt-fed machine gun lying on a plain floor,
   its ammo belt trailing off in a long, slightly ridiculous loop.
2. bazooka: amber (a hazard stripe on the tube). A dented rocket launcher with a hand-painted
   hazard stripe, a single rocket loaded, a bit too big for anyone sensible.
3. leafBlower: teal (the blower's plastic body). A petrol leaf blower on a garden path, a few
   dry leaves swirling out of the nozzle. Ordinary, harmless, and somehow menacing.
4. meatBait: red (the meat). A big, raw-looking joint of meat on a bone tied to a length of
   string, lying on the ground, a few flies buzzing above it. Gross, but not gory.

Steps:
1. Save each original as art-source/cards/<id>.png (1536 x 1024), using the ids above.
2. Make the game copies: 768 x 512 WebP, quality about 80, at src/assets/cards/<id>.webp.
3. Remove the four ids from the awaitingArt list in src/ui/cardImages.test.ts.
4. Look at each image next to the existing weapon cards; redo any that stand out.
5. Run `npm run check`. It must pass.
6. Commit and open a pull request named "Add art for the Machine Gun, Bazooka, Leaf Blower and Meat Bait".
```
