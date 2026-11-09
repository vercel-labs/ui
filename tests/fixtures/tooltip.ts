// The tooltips every implementation renders. Labels and order are the
// contract the specs rely on, so change them here and nowhere else.
//
// Page: Before, a Save button with a tooltip and a shortcut hint, a toolbar of
// icon buttons whose tooltips name them, a Profile button that opens a
// popover and has a tooltip, an About billing info button, After, the last
// action, and a button that opens the Save tooltip through a controller.
// The popover holds a Help button with its own tooltip and a Close button.
const tooltipFixture = {
  save: { trigger: "Save", content: "Save your changes", shortcut: "mod+s" },
  // Icon buttons with no name of their own. The icon text is aria-hidden.
  toolbar: [
    { icon: "B", content: "Bold" },
    { icon: "I", content: "Italic" },
    { icon: "U", content: "Underline" },
  ],
  profile: {
    trigger: "Profile",
    content: "Edit your profile",
    popover: "Profile settings",
    help: { trigger: "Help", content: "Opens the help center" },
    close: "Close",
  },
  info: {
    trigger: "About billing",
    content: "Billing runs on the first of the month.",
  },
  // Rendered with ?disabled: a button that looks disabled, through aria-disabled, and explains why.
  publish: {
    trigger: "Publish",
    content: "Add a title to publish",
    action: "publish",
  },
  // Rendered with ?shortcut: a trigger after the page's buttons, connected to the
  // Save tooltip through its controller, with a Shortcut part showing its keys.
  shortcut: { trigger: "Save copy" },
  // Rendered with ?icon-popover: an icon button that opens a popover and that its
  // tooltip names, and an icon popover trigger with no tooltip and no name.
  iconPopover: {
    icon: "N",
    content: "Notifications",
    popover: "All caught up",
    unnamed: "?",
  },
}

// Tooltip options a spec can set through the URL, for every tooltip on the page:
// ?delay=0&closeDelay=0&open&toggleable&closeOnPress=false&type=label&disabled-tooltips&container=id.
// ?open opens the Save tooltip from the start.
function tooltipOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  const container = params.get("container")
  const type = params.get("type")
  return {
    delay: number("delay") ?? 100,
    ...(params.has("closeDelay") && { closeDelay: number("closeDelay") }),
    ...(params.has("toggleable") && { toggleable: true }),
    ...(params.get("closeOnPress") === "false" && { closeOnPress: false }),
    ...(type && { type: type as "label" | "description" }),
    ...(params.has("disabled-tooltips") && { disabled: true }),
    ...(container && { container: document.getElementById(container) }),
  }
}

// Whether the Save tooltip starts open (?open), and parts a spec can add:
// ?disabled renders the aria-disabled Publish button, ?native-disabled
// makes Save a natively disabled button, which the trigger warns about, and
// ?shortcut renders the Save copy trigger, and ?icon-popover the icon popover triggers.
function tooltipParts() {
  const params = new URLSearchParams(location.search)
  return {
    open: params.has("open"),
    disabled: params.has("disabled"),
    nativeDisabled: params.has("native-disabled"),
    shortcut: params.has("shortcut"),
    iconPopover: params.has("icon-popover"),
  }
}

// Placement for the Save tooltip's content: ?side=bottom&align=start.
function tooltipContentOptions() {
  const params = new URLSearchParams(location.search)
  const side = params.get("side") as "top" | "bottom" | "left" | "right" | null
  const align = params.get("align") as "start" | "center" | "end" | null
  return { ...(side && { side }), ...(align && { align }) }
}

export { tooltipContentOptions, tooltipFixture, tooltipOptions, tooltipParts }
