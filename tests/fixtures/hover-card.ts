// The hover card every implementation renders. Labels and order are the
// contract the specs rely on, so change them here and nowhere else.
//
// Page: Before, a link to a profile that opens a card, After, and the last
// action. The card shows a name, a bio, and a link to follow.
const hoverCardFixture = {
  trigger: "@ada",
  href: "#ada",
  name: "Ada Lovelace",
  bio: "Wrote the first program for the Analytical Engine.",
  link: "View profile",
  linkHref: "#profile",
}

// Hover card options a spec can set through the URL: ?delay=0&closeDelay=0&open&container=id.
function hoverCardOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  const container = params.get("container")
  return {
    delay: number("delay") ?? 100,
    closeDelay: number("closeDelay") ?? 100,
    ...(params.has("open") && { defaultOpen: true }),
    ...(container && { container: document.getElementById(container) }),
  }
}

// Placement for the content: ?side=top&align=start.
function hoverCardContentOptions() {
  const params = new URLSearchParams(location.search)
  const side = params.get("side") as "top" | "bottom" | "left" | "right" | null
  const align = params.get("align") as "start" | "center" | "end" | null
  return { ...(side && { side }), ...(align && { align }) }
}

export { hoverCardContentOptions, hoverCardFixture, hoverCardOptions }
