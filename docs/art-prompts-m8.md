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
