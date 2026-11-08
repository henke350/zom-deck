# Codex task: art for the eight missing cards

You are working in the repository for "One More Building". Create EIGHT new card illustrations
in EXACTLY the same style as the existing card art, and add them to the game.

Branch: start from main and work on a new branch, never main. These eight cards are NOT done
yet: none of them has a file in src/assets/cards/, and all eight are listed in awaitingArt in
src/ui/cardImages.test.ts. Ignore the older prompts in docs/art-prompts-m8.md; this file is the
whole task.

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
