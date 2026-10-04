/**
 * Card illustrations: every image in `src/assets/cards/` named after a card id
 * (for example `crowbar.png`) is picked up automatically at build time.
 * Cards without an image show no picture.
 */
const files = import.meta.glob<string>('../assets/cards/*.{png,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const cardImages: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(files).flatMap(([path, url]) => {
    const id = path
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '')
    return id ? [[id, url]] : []
  }),
)
