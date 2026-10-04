/**
 * Location illustrations: every image in `src/assets/locations/` named after a
 * location id (for example `police.webp`) is picked up automatically at build time.
 * Originals live in `art-source/locations/`; the game ships small WebP copies.
 */
const files = import.meta.glob<string>('../assets/locations/*.{png,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const locationImages: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(files).flatMap(([path, url]) => {
    const id = path
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '')
    return id ? [[id, url]] : []
  }),
)
