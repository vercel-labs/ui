// The navigation menu every implementation renders. Labels and order are the
// contract the specs rely on, so change them here and nowhere else.
//
// Page: Before, a navigation landmark named "Main" with two items that open
// panels of links and a plain link for the current page, After, and the last
// action. Panels render into one shared viewport unless ?viewport=none.
//
// The bound fixture (navigation-menu-bound) binds the open item to the app's
// own state, which a spec sets through `setNavigationMenuValue`, and lists
// each `onOpenChangeComplete` in an output named "Completed".
const navigationMenuFixture = {
  label: "Main",
  items: [
    {
      value: "products",
      trigger: "Products",
      links: [
        { label: "Analytics", href: "#analytics" },
        { label: "Engagement", href: "#engagement" },
        { label: "Security", href: "#security" },
      ],
    },
    {
      value: "resources",
      trigger: "Resources",
      links: [
        { label: "Blog", href: "#blog" },
        { label: "Guides", href: "#guides" },
      ],
    },
  ],
  // A top-level link, marked as the current page.
  link: { label: "Pricing", href: "#pricing" },
  // A menu nested in the Resources panel, with ?nested.
  nested: {
    value: "learn",
    trigger: "Learn",
    links: [
      { label: "Tutorials", href: "#tutorials" },
      { label: "Courses", href: "#courses" },
    ],
  },
}

// Options a spec can set through the URL: ?delay=0&closeDelay=0&open=products&
// orientation=vertical&hover=false&close-on-select=false&container=id.
function navigationMenuOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  const container = params.get("container")
  const orientation = params.get("orientation") as
    "horizontal" | "vertical" | null
  return {
    delay: number("delay") ?? 50,
    closeDelay: number("closeDelay") ?? 50,
    ...(params.has("open") && {
      defaultValue: params.get("open") || "products",
    }),
    ...(orientation && { orientation }),
    ...(params.get("hover") === "false" && { openOnHover: false }),
    ...(params.get("close-on-select") === "false" && { closeOnSelect: false }),
    ...(container && { container: document.getElementById(container) }),
  }
}

// What the page renders: ?viewport=none leaves the viewport out, ?keep-mounted
// and ?hidden-until-found keep closed contents, ?nested adds the nested menu,
// and ?side and ?align place the panels.
function navigationMenuLayout() {
  const params = new URLSearchParams(location.search)
  const side = params.get("side") as "top" | "bottom" | "left" | "right" | null
  const align = params.get("align") as "start" | "center" | "end" | null
  return {
    viewport: params.get("viewport") !== "none",
    keepMounted: params.has("keep-mounted"),
    hiddenUntilFound: params.has("hidden-until-found"),
    nested: params.has("nested"),
    placement: { ...(side && { side }), ...(align && { align }) },
  }
}

// The status line: which item opened, or "close", and why.
function navigationMenuAction(value: string | null, reason: string) {
  return `${value ?? "close"}: ${reason}`
}

// The bound fixture's page hook: a spec sets the bound value from outside the
// menu, like the app's own state would.
type BoundWindow = { setNavigationMenuValue?: (value: string | null) => void }

function exposeNavigationMenuValue(set: (value: string | null) => void) {
  ;(window as unknown as BoundWindow).setNavigationMenuValue = set
}

export {
  exposeNavigationMenuValue,
  navigationMenuAction,
  navigationMenuFixture,
  navigationMenuLayout,
  navigationMenuOptions,
}
