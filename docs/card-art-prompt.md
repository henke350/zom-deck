# Card art prompt (for ChatGPT / Codex image generation)

How to use: paste the **master prompt** once at the start of a chat. Then ask for
**one card at a time** by pasting its subject line ("Generate: ..."). Keep everything in
the same chat so the style stays consistent. Save each result as `<card id>.png`
(for example `crowbar.png`) and put the files in `src/assets/cards/`.

## Master prompt

```
You are the illustrator for a small browser card game called "One More Building": a
turn-based zombie survival deckbuilder set in a quiet, grey, abandoned European town.
I will ask for one card illustration at a time. Every image must match the same style.

FORMAT
- Landscape, 3:2 ratio, 1536 x 1024 px, PNG.
- Full-bleed illustration with its own background (no transparency, no border, no frame).
- ONE clear subject, centred, filling about 60% of the image. Keep a calm margin of at
  least 10% on every side, because the image is cropped to a wide strip in the game.
- The subject must read clearly when shrunk to about 200 px wide: bold silhouette,
  simple shapes, strong contrast between subject and background.

STYLE
- Flat-shaded graphic illustration with a slightly rough, hand-inked outline,
  like a modern screen-printed poster or a gritty graphic novel. NOT photorealistic,
  NOT 3D render, NOT cartoonish or cute, NOT anime.
- Muted, desaturated palette: concrete greys and off-white, dark charcoal for outlines.
  Use at most one accent colour per image, taken from this set: hazard amber (#b87800),
  danger red (#a5312a), safe teal (#2a7462).
- Simple background: a soft flat colour field or a faint hint of a wall, floor or
  street. No detailed scenery, no crowds.
- Gentle texture (paper grain, light halftone) is fine. No gradients-heavy glossy look.
- Mood: tense, quiet, resourceful. Not gory. No blood splatter, no gore, no violence
  shown on a person. Zombies, if present, are shown as dark silhouettes only.

STRICT RULES
- NO text, letters, numbers, logos, watermarks, signatures or UI of any kind.
- No human faces in close-up. Hands and silhouettes are fine.
- Do not copy any existing franchise, character, brand or card game artwork.

If you understand, reply only "Ready" and wait for the first card.
```

## Card subjects

Paste one line at a time as: `Generate: <subject>`. File name in bold.

### Starter cards

- **search** – A hand pulling open a drawer of a dusty cabinet, a faint beam of light falling inside on a few supplies. Accent: amber.
- **crowbar** – A crowbar wedged into the gap of a crate lid or a door, about to pry it open. Accent: amber.
- **run** – A lone silhouette sprinting down an empty street between two grey buildings, long shadow behind. Accent: teal.
- **sneak** – A silhouette pressed against a wall, creeping past a dark doorway where a zombie silhouette stands with its back turned. Accent: teal.

### Junk cards

- **nerves** – Close-up of a trembling hand gripping its own wrist, faint shaking lines. Accent: red.
- **heavyLoad** – An overstuffed backpack with straps stretched, items spilling at the seams, sagging on the ground. Accent: amber.
- **wound** – A hand pressing a torn cloth bandage onto a forearm, a small red stain on the cloth only. Accent: red.

### Quiet finds

- **softSoles** – A pair of worn rubber-soled shoes, mid-step on a floor, with a few small footstep marks fading behind. Accent: teal.
- **lockpick** – A lockpick and tension wrench inside a keyhole of an old padlock. Accent: amber.
- **flashlight** – A flashlight with a beam of light cutting through a dark room, dust in the beam. Accent: amber.
- **alarmClock** – An old twin-bell alarm clock on a dusty floor, with small noise lines around it. Accent: red.

### Weapons and defence

- **baseballBat** – A wooden baseball bat leaning against a brick wall, tape wrapped around the handle. Accent: amber.
- **axe** – A fire axe stuck upright in a wooden stump. Accent: red.
- **pistol** – A plain handgun lying on a table next to a few scattered items. No muzzle flash. Accent: red.
- **molotov** – A glass bottle with a rag in its neck, the rag burning with a small flame. Accent: amber.
- **kevlarVest** – A bulletproof vest hanging on a hook. Accent: teal.

### Movement and tempo

- **runningShoes** – A pair of bright-soled running shoes with laces untied, motion streaks behind. Accent: teal.
- **adrenaline** – An auto-injector pen held in a fist, clenched, radiating short energy lines. Accent: red.
- **travelLight** – A small, almost empty rucksack on one shoulder of a silhouette walking away along a road. Accent: teal.

### Utility

- **toolbox** – An open metal toolbox with a hammer, wrench and pliers visible. Accent: amber.
- **districtMap** – A folded paper town map on a table, a few pins and a pencil circle marking some buildings. Accent: amber.

### Healing

- **bandage** – A roll of white bandage with a safety pin, next to a small first-aid kit. Accent: teal.
- **painkillers** – A small pill bottle with a few tablets spilled beside it. Accent: teal.

## After generating

- Check that no image contains text or letters. If it does, ask: "Regenerate without any text".
- If the style drifts, ask: "Match the style of the first image exactly".
