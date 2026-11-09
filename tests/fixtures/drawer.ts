// The drawer every implementation renders. Labels and order are the contract
// the specs rely on, so change them here and nowhere else.
//
// Page: Before, the drawer's trigger, the drawer, After, the last action, a
// button that opens the drawer through a controller, and a page button that
// reports "page", for presses that reach the page beside a drawer that isn't modal.
// Drawer: a backdrop, a handle, the title, the description, a Submit button
// that reports "submit" without closing, and a Close part.
const drawerFixture = {
  trigger: "Move goal",
  handle: "Resize",
  title: "Move goal",
  description: "Set your daily activity goal.",
  action: "Submit",
  close: "Cancel",
  page: "Page action",
  controller: "Open with controller",
  // A list long enough to scroll inside the drawer, with ?scroll.
  scroll: {
    label: "Activity",
    items: Array.from({ length: 40 }, (_, index) => `Day ${index + 1}`),
  },
  // A text field, with ?field.
  field: "Goal",
  // A drawer opened from inside the drawer, with ?nested.
  nested: { trigger: "More options", title: "More options", close: "Done" },
  // A button that adds content, so the drawer's "content" snap point grows, with ?grow.
  grow: { button: "Show more", text: "More details about the goal." },
  // An element outside the drawer that follows it, scaling down as it opens, with ?outlet.
  outlet: { label: "Page", keyframes: { scale: [1, 0.9] } },
  // With ?shortcut: a trigger after the page's buttons, connected through the
  // controller, with these keys and a Shortcut part that shows them.
  shortcut: { trigger: "Quick goal", keys: "mod+g" },
}

// Drawer options a spec can set through the URL:
// ?open&snap=0.25,0.5,1&default-snap=0.5&side=left&modal-above=0.25
// &dismissible=false&expand-on-scroll=false&driver=scroll-snap&container=id
// &modal=false&theme-color.
function drawerOptions() {
  const params = new URLSearchParams(location.search)
  const snap = params.get("snap")
  const side = params.get("side")
  const modalAbove = params.get("modal-above")
  const defaultSnap = params.get("default-snap")
  const driver = params.get("driver")
  const container = params.get("container")
  const modal = params.get("modal")
  const point = (value: string) =>
    (/^[\d.]+$/.test(value) ? Number(value) : value) as number
  return {
    ...(params.has("open") && { defaultOpen: true }),
    ...(snap && { snapPoints: snap.split(",").map(point) }),
    ...(defaultSnap && { defaultSnapPoint: point(defaultSnap) }),
    ...(side && {
      side: side as "bottom" | "top" | "left" | "right" | "start" | "end",
    }),
    ...(modalAbove && { modalAbove: point(modalAbove) }),
    ...(params.get("dismissible") === "false" && { dismissible: false }),
    ...(params.get("expand-on-scroll") === "false" && {
      expandOnScroll: false,
    }),
    ...(driver && { driver: driver as "pointer" | "scroll-snap" }),
    ...(modal && {
      modal:
        modal === "trap-focus" ? ("trap-focus" as const) : modal === "true",
    }),
    ...(container && { container: document.getElementById(container) }),
    ...(params.has("theme-color") && { themeColor: true }),
  }
}

// Parts a spec can add through the URL: ?scroll, ?field, ?nested, ?grow,
// ?outlet, ?shortcut, ?backdrop=none. ?theme-color also adds the page's theme color.
function drawerParts() {
  const params = new URLSearchParams(location.search)
  // The tag is the page's, so the server, which has no document, leaves it to the client.
  if (
    params.has("theme-color") &&
    typeof document !== "undefined" &&
    !document.querySelector('meta[name="theme-color"]')
  ) {
    const meta = document.createElement("meta")
    meta.name = "theme-color"
    meta.content = "#ffffff"
    document.head.append(meta)
  }
  return {
    scroll: params.has("scroll"),
    field: params.has("field"),
    nested: params.has("nested"),
    grow: params.has("grow"),
    outlet: params.has("outlet"),
    shortcut: params.has("shortcut"),
    backdrop: params.get("backdrop") !== "none",
  }
}

// What every drawer fixture records for the specs: open changes, snap point
// changes and refused dismissals, as "drawer:false:swipe", "0.5:handle-press"
// and "attempt:escape-key".
type Window = { drawer?: unknown; __drawerLog?: string[] }

function exposeDrawerFixture(controller: unknown) {
  const target = window as unknown as Window
  target.drawer = controller
  target.__drawerLog = []
}

function recordDrawer(entry: string) {
  ;((window as unknown as Window).__drawerLog ??= []).push(entry)
}

export {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
}
