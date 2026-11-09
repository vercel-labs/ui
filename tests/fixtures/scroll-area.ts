// What every Scroll Area fixture renders. Labels, sizes and order are the
// contract the specs rely on, so change them here and nowhere else.
const scrollAreaFixture = {
  // Vertical only, with nothing focusable inside: the viewport is the tab stop.
  tags: {
    label: "Tags",
    items: Array.from({ length: 50 }, (_, index) => `Tag ${index + 1}`),
  },
  // Both axes, with links inside: Tab reaches the links, not the viewport.
  gallery: {
    label: "Gallery",
    items: Array.from({ length: 36 }, (_, index) => `Artwork ${index + 1}`),
  },
  // Fits, so nothing scrolls and no scrollbar shows.
  short: { label: "Short", items: ["One", "Two"] },
  // Anchored to the end, like a chat. "Add message" appends one, "Stream"
  // adds words to the last, "Add image" appends one whose image loads when
  // "Load images" is pressed, and "Jump to latest" scrolls to the end.
  chat: {
    label: "Messages",
    messages: Array.from({ length: 20 }, (_, index) => `Message ${index + 1}`),
    streamed: " and more words arrive while the answer streams in",
    imageHeight: 160,
    jump: "Jump to latest",
  },
}

type ScrollAreaFixtureType = "auto" | "always" | "scroll" | "hover"

// Options a spec can set through the URL: ?type=scroll&delay=300, and
// ?native renders the tags with the browser's own scrollbars instead of custom ones.
function scrollAreaOptions() {
  const params = new URLSearchParams(location.search)
  const delay = params.get("delay")
  return {
    type: (params.get("type") ?? undefined) as
      ScrollAreaFixtureType | undefined,
    scrollHideDelay: delay === null ? undefined : Number(delay),
    native: params.has("native"),
  }
}

export { scrollAreaFixture, type ScrollAreaFixtureType, scrollAreaOptions }
