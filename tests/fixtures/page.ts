import "./styles.css"

// Applies URL options that change layout or motion. Every fixture app calls this.
function applyFixtureOptions() {
  const params = new URLSearchParams(location.search)
  const layout = params.get("layout")
  if (layout) {
    document.body.dataset.layout = layout
  }
  if (params.get("dir") === "rtl") {
    document.documentElement.dir = "rtl"
  }
  if (params.has("animate")) {
    document.body.dataset.animate = params.get("animate") ?? ""
  }
  // A container for specs that render popups somewhere else.
  const container = params.get("container")
  if (container && !document.getElementById(container)) {
    const el = document.createElement("div")
    el.id = container
    document.body.append(el)
  }
  return params
}

function formatShortcut(shortcut: string) {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform)
  return shortcut
    .split("+")
    .map((key) => (key === "mod" ? (mac ? "⌘" : "Ctrl+") : key.toUpperCase()))
    .join("")
}

// Menu options a spec can set through the URL: ?modal=false&presentation=auto.
function menuOptions() {
  const params = new URLSearchParams(location.search)
  const modal = params.get("modal")
  const presentation = params.get("presentation")
  const container = params.get("container")
  return {
    ...(params.has("open") && { defaultOpen: true }),
    ...(container && { container: document.getElementById(container) }),
    ...(modal && {
      modal: modal === "pointer" ? ("pointer" as const) : modal === "true",
    }),
    ...(presentation && {
      presentation: presentation as "auto" | "popover" | "sheet",
    }),
  }
}

// ?sr loads a virtual screen reader that records what would be announced.
async function loadScreenReader() {
  if (!new URLSearchParams(location.search).has("sr")) {
    return
  }
  const { virtual } = await import("@guidepup/virtual-screen-reader")
  ;(window as unknown as { virtual: typeof virtual }).virtual = virtual
}

// Tabs options a spec can set through the URL: ?activation=manual&orientation=vertical.
// ?default=none renders without a default value, ?keep-mounted keeps hidden panels,
// ?cancel=<value> cancels changes to that value.
function tabsOptions() {
  const params = new URLSearchParams(location.search)
  const activation = params.get("activation")
  const orientation = params.get("orientation")
  return {
    defaultValue: params.get("default") === "none" ? undefined : "account",
    keepMounted: params.has("keep-mounted"),
    cancel: params.get("cancel"),
    ...(activation && { activation: activation as "automatic" | "manual" }),
    ...(orientation && {
      orientation: orientation as "horizontal" | "vertical",
    }),
  }
}

// Rating options a spec can set through the URL: ?disabled, and ?cancel=<score>
// cancels the change to that score.
function ratingOptions() {
  const params = new URLSearchParams(location.search)
  const cancel = params.get("cancel")
  return {
    disabled: params.has("disabled"),
    cancel: cancel === null ? null : Number(cancel),
  }
}

// Segmented control options a spec can set through the URL: ?default=<value>,
// or none for no default value, ?orientation=vertical, ?disabled, and
// ?cancel=<value> cancels the change to that value.
function segmentedControlOptions() {
  const params = new URLSearchParams(location.search)
  const orientation = params.get("orientation")
  const defaultValue = params.get("default") ?? "list"
  return {
    defaultValue: defaultValue === "none" ? undefined : defaultValue,
    disabled: params.has("disabled"),
    cancel: params.get("cancel"),
    ...(orientation && {
      orientation: orientation as "horizontal" | "vertical",
    }),
  }
}

// Color picker options a spec can set through the URL: ?default=<color>,
// ?space=oklch, ?gamut=false or p3, ?format=<format>, ?disabled, ?readonly,
// and ?cancel cancels every change.
function colorPickerOptions() {
  const params = new URLSearchParams(location.search)
  const gamut = params.get("gamut")
  return {
    defaultValue: params.get("default") ?? "#3b82f6",
    disabled: params.has("disabled"),
    readOnly: params.has("readonly"),
    cancel: params.has("cancel"),
    ...(params.get("space") && {
      space: params.get("space") as "hsv" | "hsl" | "srgb" | "oklch",
    }),
    ...(params.get("format") && { format: params.get("format") as "hex" }),
    ...(gamut && {
      gamut: gamut === "false" ? (false as const) : (gamut as "srgb" | "p3"),
    }),
  }
}

// Image cropper options a spec can set through the URL: ?mode=frame,
// ?aspect=1, ?shape=circle, ?default=x,y,width,height, ?disabled, and
// ?cancel cancels every change.
function imageCropperOptions() {
  const params = new URLSearchParams(location.search)
  const crop = params.get("default")?.split(",").map(Number)
  return {
    mode: (params.get("mode") ?? "box") as "box" | "frame",
    shape: (params.get("shape") ?? "rectangle") as "rectangle" | "circle",
    disabled: params.has("disabled"),
    cancel: params.has("cancel"),
    ...(params.get("aspect") && { aspectRatio: Number(params.get("aspect")) }),
    ...(crop && {
      defaultCrop: { x: crop[0], y: crop[1], width: crop[2], height: crop[3] },
    }),
  }
}

// Accordion options a spec can set through the URL: ?multiple&collapsible=false.
// ?default=none renders without a default value, ?keep-mounted and
// ?hidden-until-found keep closed panels, ?disabled disables the root and
// ?cancel=<value> cancels changes that would open that item.
function accordionOptions() {
  const params = new URLSearchParams(location.search)
  const value = params.get("default")
  return {
    defaultValue:
      value === "none" ? undefined : value ? value.split(",") : ["shipping"],
    multiple: params.has("multiple"),
    disabled: params.has("disabled"),
    keepMounted: params.has("keep-mounted"),
    hiddenUntilFound: params.has("hidden-until-found"),
    cancel: params.get("cancel"),
    ...(params.get("collapsible") === "false" && { collapsible: false }),
  }
}

// Collapsible options a spec can set through the URL: ?open starts open,
// ?disabled disables it, ?keep-mounted and ?hidden-until-found keep the closed
// panel, and ?cancel=open or ?cancel=close cancels that change.
function collapsibleOptions() {
  const params = new URLSearchParams(location.search)
  return {
    defaultOpen: params.has("open"),
    disabled: params.has("disabled"),
    keepMounted: params.has("keep-mounted"),
    hiddenUntilFound: params.has("hidden-until-found"),
    cancel: params.get("cancel") as "open" | "close" | null,
  }
}

// Toggle options a spec can set through the URL: ?orientation=vertical lays
// out both groups vertically, ?deselectable=false keeps one alignment pressed,
// ?loop=false stops arrows at the ends, ?disabled disables the formatting
// group, ?pressed starts the bookmark pressed, ?alignment=<value> starts that
// alignment pressed instead of "left", and ?cancel=<value> cancels any change
// that would press or unpress that toggle.
function toggleOptions() {
  const params = new URLSearchParams(location.search)
  const orientation = params.get("orientation")
  return {
    orientation: (orientation ?? undefined) as
      "horizontal" | "vertical" | undefined,
    deselectable: params.get("deselectable") !== "false",
    loop: params.get("loop") !== "false",
    disabled: params.has("disabled"),
    defaultPressed: params.has("pressed"),
    alignment: params.get("alignment"),
    cancel: params.get("cancel"),
  }
}

// The value a toggle group change touches: the one added or removed.
function changedValue(before: readonly string[], after: readonly string[]) {
  return (
    after.find((value) => !before.includes(value)) ??
    before.find((value) => !after.includes(value)) ??
    null
  )
}

// Tree options a spec can set through the URL: ?selection=none|multiple,
// ?default=a,b selects, ?expanded=a,b expands, ?checkable with ?strategy,
// ?current, ?activation=automatic, ?disabled, ?keep-mounted,
// ?hidden-until-found, and ?cancel=<value> cancels expanding that branch.
function treeOptions() {
  const params = new URLSearchParams(location.search)
  const list = (name: string) => params.get(name)?.split(",").filter(Boolean)
  const mode = (params.get("selection") ?? "single") as
    "none" | "single" | "multiple"
  const selected = list("default")
  return {
    mode,
    defaultValue:
      mode === "multiple" ? (selected ?? []) : (selected?.[0] ?? null),
    defaultExpanded: list("expanded") ?? [],
    checkable: params.has("checkable"),
    checkStrategy: (params.get("strategy") ?? "leaf") as
      "leaf" | "trunk" | "branch" | "independent",
    current: params.get("current") ?? undefined,
    activation: (params.get("activation") ?? "manual") as
      "automatic" | "manual",
    disabled: params.has("disabled"),
    keepMounted: params.has("keep-mounted"),
    hiddenUntilFound: params.has("hidden-until-found"),
    cancel: params.get("cancel"),
  }
}

export {
  colorPickerOptions,
  imageCropperOptions,
  accordionOptions,
  applyFixtureOptions,
  changedValue,
  collapsibleOptions,
  formatShortcut,
  loadScreenReader,
  menuOptions,
  ratingOptions,
  segmentedControlOptions,
  tabsOptions,
  toggleOptions,
  treeOptions,
}
