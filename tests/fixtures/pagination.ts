// What every Pagination fixture renders. Names and order are the contract the
// specs rely on, so change them here and nowhere else.
const paginationFixture = {
  // The landmark's name.
  label: "Results pages",
  pageCount: 10,
  // The steps, by their names, in the order they render around the pages.
  first: "First page",
  previous: "Previous page",
  next: "Next page",
  last: "Last page",
  // A button outside the pagination that pages it through the controller.
  controller: { label: "Go to page 7", page: 7 },
}

// What the "Last action" status says after a change.
const paginationAction = (page: number, reason: string) =>
  `page: ${page} (${reason})`

// Options a spec can set through the URL: ?page=<n> (the default page),
// ?count=<n>, ?siblings=<n>, ?boundaries=<n>, ?links (parts are links to
// #page-<n>), ?controlled (the fixture owns `page`), ?cancel=<n> (changes
// to that page are canceled) and ?rekey (the list renders from scratch on
// every page, like a list keyed by page).
function paginationOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  return {
    defaultPage: number("page"),
    pageCount: number("count") ?? paginationFixture.pageCount,
    siblings: number("siblings"),
    boundaries: number("boundaries"),
    getHref: params.has("links")
      ? (page: number) => `#page-${page}`
      : undefined,
    controlled: params.has("controlled"),
    cancel: number("cancel"),
    rekey: params.has("rekey"),
  }
}

export { paginationAction, paginationFixture, paginationOptions }
