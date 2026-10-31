// The slides every implementation renders. Labels and order are the contract
// the specs rely on, so change them here and nowhere else.
type CarouselFixtureSlide = {
  title: string
  // A link inside the slide, to check what Tab reaches.
  link: string
}

const carouselFixture = {
  // The carousel's accessible name.
  label: "Featured products",
  previous: "Previous slide",
  next: "Next slide",
  // The indicators' tablist, and each indicator's name.
  indicators: "Choose a slide",
  indicator: (page: number) => `Slide ${page}`,
  // The play toggle's name while rotating, and while not.
  stop: "Stop slide rotation",
  start: "Start slide rotation",
  slides: [
    { title: "Desk lamp", link: "View desk lamp" },
    { title: "Armchair", link: "View armchair" },
    { title: "Bookshelf", link: "View bookshelf" },
    { title: "Rug", link: "View rug" },
    { title: "Plant stand", link: "View plant stand" },
  ] satisfies CarouselFixtureSlide[] as CarouselFixtureSlide[],
  // A text field in the third slide, which keeps its arrow keys.
  field: "Gift note",
}

// Carousel options a spec can set through the URL: ?per-view=3 lays out three
// slides to a view, ?slides-per-page=2|auto groups them, ?align=center,
// ?loop, ?orientation=vertical, ?playing starts rotating with ?interval=<ms>,
// ?default-page=3, ?cancel=<page> cancels changes to that page, ?no-drag turns
// dragging off, ?skip-snaps and ?drag-free. ?controlled holds the page in the
// fixture's state, where "Show page 3 by prop" sets it (React and Vue).
function carouselOptions() {
  const params = new URLSearchParams(location.search)
  const perPage = params.get("slides-per-page")
  const align = params.get("align")
  const orientation = params.get("orientation")
  const interval = params.get("interval")
  const defaultPage = params.get("default-page")
  const cancel = params.get("cancel")
  return {
    perView: Number(params.get("per-view") ?? 1),
    cancel: cancel === null ? null : Number(cancel),
    // Whether the page renders the play toggle: with rotation, or ?play-toggle without it.
    playToggle: params.has("playing") || params.has("play-toggle"),
    controlled: params.has("controlled"),
    options: {
      ...(perPage && { slidesPerPage: perPage === "auto" ? ("auto" as const) : Number(perPage) }),
      ...(align && { align: align as "start" | "center" | "end" }),
      ...(orientation && { orientation: orientation as "horizontal" | "vertical" }),
      ...(params.has("loop") && { loop: true }),
      ...(params.has("playing") && { defaultPlaying: true }),
      ...(interval && { interval: Number(interval) }),
      ...(defaultPage && { defaultPage: Number(defaultPage) }),
      ...(params.has("no-drag") && { drag: false }),
      ...(params.has("skip-snaps") && { skipSnaps: true }),
      ...(params.has("drag-free") && { dragFree: true }),
    },
  }
}

export { carouselFixture, type CarouselFixtureSlide, carouselOptions }
