# Location art prompt (for Codex / ChatGPT image generation)

Generate 8 location illustrations for the game "One More Building", one image per
location, saved as `src/assets/locations/<id>.png`. Keep the style identical across all
eight, and identical to the card illustrations in `src/assets/cards/` (use the card
`search.png` as the style reference if you can).

## Style (same for every image)

- Landscape 3:2, 1536 x 1024 px, PNG. Full-bleed illustration, no border, no frame,
  no transparency.
- Painterly, slightly rough hand-inked illustration, gritty graphic-novel feel. NOT
  photorealistic, NOT a 3D render, NOT cute, NOT anime.
- Muted, desaturated palette: concrete greys, dusty off-white, dark charcoal. At most
  ONE accent colour per image (hazard amber #b87800, danger red #a5312a or safe teal
  #2a7462; given per location below). Soft low sunlight or overcast light.
- Setting: a quiet, abandoned European town, a few weeks after the outbreak. Empty
  streets, closed shutters, scattered litter, overgrown weeds.
- ONE clear building or place as the subject, seen from street level in a wide
  establishing shot. The subject must read clearly when shrunk to 200 px wide.
- Mood: tense, quiet, lonely. Not gory: no blood, no corpses. Zombies are never shown
  close up; at most one tiny dark silhouette far in the background, and only if the
  location says so.
- STRICT: NO text, letters, numbers, signs with readable writing, logos or watermarks
  (shop signs must be blank or unreadable). No close-up faces. No copying of existing
  franchises, brands or game artwork.

## Locations

| id          | Name           | Accent | Subject                                                                                                                                                    |
| ----------- | -------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shelter     | Shelter        | teal   | A fortified ground-floor flat or small community building: boarded windows, a barricaded door, a single warm lit window. The safest-looking place.         |
| street      | Street         | amber  | An empty town crossroads seen from its middle: abandoned cars, five roads leading away in different directions, faint fog. A lone tiny silhouette far off. |
| houseA      | House A        | amber  | A quiet detached family house with a small garden, a gate slightly ajar, curtains drawn, a child's bicycle lying on the lawn.                              |
| houseB      | House B        | amber  | A narrow terraced town house wedged between two buildings, a broken upstairs window, an overturned bin on the pavement.                                    |
| supermarket | Supermarket    | amber  | A neighbourhood supermarket with a wide glass front and a half-empty car park, shopping trolleys scattered, one automatic door stuck open, dark inside.    |
| pharmacy    | Pharmacy       | teal   | A small corner pharmacy with a glowing-green cross-shaped sign (no text), a cracked shop window, medicine boxes visible on shelves inside.                 |
| workshop    | Workshop       | amber  | A garage-style workshop with a half-raised roller door, tools and tyres stacked outside, a workbench visible in the dim interior.                          |
| police      | Police Station | red    | A heavy brick police station with barred windows, a tipped-over patrol car at the kerb, barricades pushed aside, a dark open doorway. Feels dangerous.     |

## Output

Save as `src/assets/locations/<id>.png` (shelter.png, street.png, houseA.png,
houseB.png, supermarket.png, pharmacy.png, workshop.png, police.png). Show me the first
two (shelter and police) for approval before generating the other six. Check that no
image contains readable text; regenerate if it does.
