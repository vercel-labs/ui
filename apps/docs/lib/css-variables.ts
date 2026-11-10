import type { Framework } from "./frameworks"
import { partLabel } from "./data-attributes"

type Label = { react: string; web: string }

// Variables one part carries. `label` names an element that isn't a part,
// like a sheet's viewport, and `when` limits them to some of the time.
type Group = { part: string; label?: Label; when?: string; variables: string[] }

const positioned = [
  "--anchor-width",
  "--anchor-height",
  "--available-width",
  "--available-height",
  "--transform-origin",
  "--arrow-offset",
]
const sheetMotion = ["--drawer-progress", "--drawer-dim", "--drawer-expand"]
const keyboard = [
  "--keyboard-inset",
  "--visual-viewport-width",
  "--visual-viewport-height",
  "--visual-viewport-top",
]

const asSheet = "while it presents as a sheet"

const viewport = (component: string): Label => ({
  react: "Viewport",
  web: `<ui-${component}-viewport>`,
})

// A popup that can present as a sheet: placed beside its trigger, and
// inside a viewport while it's a sheet.
function sheetPopup(component: string) {
  return [
    { part: "content", variables: positioned },
    {
      part: "content",
      when: asSheet,
      variables: [...sheetMotion, "--drawer-stack"],
    },
    { part: "content", variables: ["--sheet-backdrop"] },
    {
      part: "viewport",
      label: viewport(component),
      when: asSheet,
      variables: keyboard,
    },
  ] satisfies Group[]
}

// The CSS variables each component's parts carry, in the order of its parts
// in the markup. `css-variables.test.ts` checks them against what core writes.
const components: Record<string, Group[]> = {
  accordion: [
    {
      part: "panel",
      variables: ["--accordion-panel-height", "--accordion-panel-width"],
    },
  ],
  collapsible: [
    {
      part: "panel",
      variables: ["--collapsible-panel-height", "--collapsible-panel-width"],
    },
  ],
  tabs: [
    {
      part: "indicator",
      variables: [
        "--active-tab-left",
        "--active-tab-right",
        "--active-tab-top",
        "--active-tab-bottom",
        "--active-tab-width",
        "--active-tab-height",
      ],
    },
  ],
  rating: [{ part: "item", variables: ["--rating-fill"] }],
  "segmented-control": [
    {
      part: "indicator",
      variables: [
        "--segmented-control-indicator-left",
        "--segmented-control-indicator-right",
        "--segmented-control-indicator-top",
        "--segmented-control-indicator-bottom",
        "--segmented-control-indicator-width",
        "--segmented-control-indicator-height",
      ],
    },
  ],
  slider: [
    {
      part: "indicator",
      variables: ["--slider-indicator-start", "--slider-indicator-size"],
    },
    { part: "thumb", variables: ["--slider-thumb-position"] },
  ],
  progress: [{ part: "root", variables: ["--progress-value"] }],
  meter: [{ part: "root", variables: ["--meter-value"] }],
  "scroll-area": [
    {
      part: "root",
      variables: [
        "--scroll-area-overflow-y-start",
        "--scroll-area-overflow-y-end",
        "--scroll-area-overflow-x-start",
        "--scroll-area-overflow-x-end",
        "--scroll-area-progress-y",
        "--scroll-area-progress-x",
        "--scroll-area-corner-width",
        "--scroll-area-corner-height",
      ],
    },
    {
      part: "scrollbar",
      variables: [
        "--scroll-area-thumb-height",
        "--scroll-area-thumb-width",
        "--scroll-area-thumb-offset",
      ],
    },
  ],
  resizable: [{ part: "panel", variables: ["--resizable-panel-size"] }],
  carousel: [
    { part: "root", variables: ["--carousel-interval", "--carousel-progress"] },
  ],
  timeline: [
    { part: "root", variables: ["--timeline-count"] },
    { part: "item", variables: ["--timeline-index"] },
  ],
  "color-picker": [
    { part: "root", variables: ["--color-picker-color"] },
    { part: "area", variables: ["--color-area-background"] },
    { part: "area-thumb", variables: ["--area-x", "--area-y"] },
    { part: "slider", variables: ["--color-slider-background"] },
    { part: "slider-thumb", variables: ["--color-slider-thumb-position"] },
    { part: "swatch", variables: ["--color-picker-color"] },
    { part: "swatch-item", variables: ["--color-picker-color"] },
  ],
  "image-cropper": [
    { part: "viewport", variables: ["--image-cropper-aspect-ratio"] },
  ],
  tree: [
    { part: "item", variables: ["--tree-level"] },
    { part: "group", variables: ["--tree-group-height"] },
  ],
  "navigation-menu": [
    { part: "content", when: "without a viewport", variables: positioned },
    {
      part: "viewport",
      variables: [...positioned, "--viewport-width", "--viewport-height"],
    },
    {
      part: "indicator",
      variables: [
        "--active-item-left",
        "--active-item-right",
        "--active-item-top",
        "--active-item-bottom",
        "--active-item-width",
        "--active-item-height",
      ],
    },
  ],
  tooltip: [{ part: "content", variables: positioned }],
  "hover-card": [{ part: "content", variables: positioned }],
  "trigger-menu": [{ part: "content", variables: positioned }],
  popover: sheetPopup("popover"),
  menu: sheetPopup("menu"),
  select: sheetPopup("select"),
  combobox: sheetPopup("combobox"),
  autocomplete: sheetPopup("autocomplete"),
  "date-picker": sheetPopup("date-picker"),
  dialog: [
    { part: "content", variables: ["--dialog-stack"] },
    {
      part: "content",
      when: "unless it presents as a sheet",
      variables: keyboard,
    },
    {
      part: "content",
      when: asSheet,
      variables: [...sheetMotion, "--drawer-stack"],
    },
    { part: "content", variables: ["--sheet-backdrop"] },
    {
      part: "viewport",
      label: viewport("dialog"),
      when: asSheet,
      variables: keyboard,
    },
  ],
  "alert-dialog": [
    { part: "content", variables: ["--dialog-stack", ...keyboard] },
  ],
  drawer: [
    { part: "content", variables: [...sheetMotion, "--drawer-stack"] },
    { part: "viewport", label: viewport("drawer"), variables: keyboard },
    { part: "outlet", variables: sheetMotion },
  ],
  toast: [
    {
      part: "region",
      variables: [
        "--toast-front-height",
        "--toast-stack-height",
        "--toast-count",
        ...keyboard,
      ],
    },
    {
      part: "root",
      variables: [
        "--toast-index",
        "--toast-offset",
        "--toast-height",
        "--toast-swipe-x",
        "--toast-swipe-y",
      ],
    },
  ],
}

// What each variable holds. The table says which part carries it.
const meaning: Record<string, string> = {
  "--anchor-width":
    "Width of the anchor, usually the trigger. Use it to match widths.",
  "--anchor-height": "Height of the anchor.",
  "--available-width":
    "Space beside the popup, up to the viewport edge. Not inherited either.",
  "--available-height":
    "Space between the anchor and the viewport edge. Use it for max-height. Not inherited, so a child that needs it copies it on the popup, like `[--list-height:var(--available-height)]`, and reads `max-h-(--list-height)`. The first popup registers both names for the whole page with `CSS.registerProperty`, so they don't inherit anywhere. A page that needs them to inherit calls it first, with `inherits: true`. An `@property` rule can't, since a registration in script wins.",
  "--transform-origin":
    "The point on the anchor the popup opens from. Use it to scale from the right place.",
  "--arrow-offset":
    "Where the anchor's center falls along the popup's edge, kept `arrowPadding` from the corners. Position a ::before arrow with it.",
  "--color-picker-color":
    "The color as CSS, inside the gamut. On a swatch item, its own color. Use it to fill a thumb or a swatch.",
  "--color-area-background":
    "Gradients that draw the area, when its channels are saturation and brightness or lightness. Unset for others, which a canvas paints.",
  "--area-x": "Where the thumb is across the area, from 0 to 1.",
  "--area-y":
    "Where the thumb is up the area, from 0 at the bottom to 1 at the top.",
  "--color-slider-background":
    "A gradient through the slider's channel, with the other channels as they are.",
  "--color-slider-thumb-position":
    "Where the thumb is along the slider, as a percentage.",
  "--image-cropper-aspect-ratio":
    "The image's width over its height as it shows, turned, once it loads. Give the viewport `aspect-ratio: var(--image-cropper-aspect-ratio)` to fit the image.",
  "--active-tab-left":
    "Distance from the tab list's left edge to the selected tab.",
  "--active-tab-right":
    "Distance from the tab list's right edge to the selected tab.",
  "--active-tab-top":
    "Distance from the tab list's top edge to the selected tab.",
  "--active-tab-bottom":
    "Distance from the tab list's bottom edge to the selected tab.",
  "--active-tab-width": "Width of the selected tab.",
  "--active-tab-height": "Height of the selected tab.",
  "--rating-fill": "How much of the star the shown score covers, from 0 to 1.",
  "--segmented-control-indicator-left":
    "Distance from the control's left edge to the checked item.",
  "--segmented-control-indicator-right":
    "Distance from the control's right edge to the checked item.",
  "--segmented-control-indicator-top":
    "Distance from the control's top edge to the checked item.",
  "--segmented-control-indicator-bottom":
    "Distance from the control's bottom edge to the checked item.",
  "--segmented-control-indicator-width": "Width of the checked item.",
  "--segmented-control-indicator-height": "Height of the checked item.",
  "--viewport-width":
    "The open content's width plus the viewport's own border. Transition width for a viewport that resizes as it switches.",
  "--viewport-height":
    "The open content's height plus the viewport's own border.",
  "--active-item-left":
    "Distance from its positioned ancestor's left edge to the open trigger, or the current page's link.",
  "--active-item-right":
    "Distance from its positioned ancestor's right edge to the item.",
  "--active-item-top":
    "Distance from its positioned ancestor's top edge to the item.",
  "--active-item-bottom":
    "Distance from its positioned ancestor's bottom edge to the item.",
  "--active-item-width": "Width of the item it sits under.",
  "--active-item-height": "Height of the item it sits under.",
  "--accordion-panel-height":
    "The panel's content height in pixels while it animates, auto once open and 0px while closed.",
  "--accordion-panel-width":
    "The panel's content width, the same way. For accordions that open sideways.",
  "--collapsible-panel-height":
    "The panel's content height in pixels while it animates, auto once open and 0px while closed.",
  "--collapsible-panel-width":
    "The panel's content width, the same way. For panels that open sideways.",
  "--tree-level":
    "The item's depth, 1 for a top-level item. Indent a flat tree with it.",
  "--tree-group-height":
    "The group's content height in pixels while it animates, auto once expanded and 0px while collapsed.",
  "--dialog-stack":
    "How many dialogs are open above this one, nested inside it. 0 for the topmost.",
  "--carousel-interval":
    "How long each page shows while rotating, like `500ms`. Time a progress bar's animation with it.",
  "--carousel-progress":
    "How far the slides have scrolled, from 0 at the first page to 1 at the last, or round the loop. It follows every frame of a scroll or spring.",
  "--drawer-progress":
    "How far open the sheet is, from 0 closed to 1 at its largest snap point. Never past 1.",
  "--drawer-dim":
    "How dim the page behind is, from 0 to 1. The backdrop's opacity follows it.",
  "--drawer-expand":
    "0 at the second-largest snap point and below, 1 at the largest. With one snap point, the whole travel.",
  "--drawer-stack":
    "How many sheets opened from inside this one are open above it, rising smoothly as each one opens. Push it back with it.",
  "--timeline-count":
    "How many events are in the page. Size a horizontal grid's columns with it.",
  "--timeline-index":
    "The event's place among the events in the page, 0 for the first. It follows them as they move.",
  "--toast-index":
    "The toast's place in the stack, 0 for the newest. A closing toast keeps its place.",
  "--toast-offset":
    "The height of the toasts in front of this one, in pixels. Add gaps with `--toast-index` to place an expanded stack.",
  "--toast-height":
    "The toast's own height with its content laid out freely, whatever height it's given. Set it as the height to animate the stack.",
  "--toast-front-height":
    "The newest toast's height. Clip the toasts behind it to it in a collapsed stack.",
  "--toast-stack-height":
    "The toasts' heights added up, for the height of an expanded stack.",
  "--toast-count": "How many toasts show.",
  "--toast-swipe-x":
    "How far a swipe moved the toast sideways, in pixels. Translate the toast by it.",
  "--toast-swipe-y": "How far a swipe moved the toast up or down, in pixels.",
  "--sheet-backdrop":
    "Set it yourself: the color the page dims to while it presents as a sheet. Black at 0.2 by default.",
  "--keyboard-inset":
    "How many pixels of the page the on-screen keyboard covers, 0 without one.",
  "--visual-viewport-height":
    "The height of the part of the page you can see, above the keyboard.",
  "--visual-viewport-width": "The width of the part of the page you can see.",
  "--visual-viewport-top":
    "How far the part of the page you can see is scrolled from the top of the layout, as when the keyboard pushes it up.",
  "--scrollbar-width":
    "While a modal popup locks the page's scroll: the page scrollbar's width, 0px for overlay scrollbars. Fixed elements, like a header, can pad themselves by it.",
  "--slider-thumb-position":
    "Where the thumb sits along the track, as a percentage from the start. Use it for a label that follows the thumb.",
  "--slider-indicator-start":
    "Where the indicator starts along the track, as a percentage. 0% for a single thumb.",
  "--slider-indicator-size":
    "How much of the track the indicator covers, as a percentage.",
  "--scroll-area-thumb-height":
    "On a vertical scrollbar: its thumb's length in pixels. The thumb's inline height reads it.",
  "--scroll-area-thumb-width":
    "On a horizontal scrollbar: its thumb's length in pixels. The thumb's inline width reads it.",
  "--scroll-area-thumb-offset":
    "How far its thumb sits from the track's start, in pixels, negative right to left. The thumb's inline transform reads it.",
  "--scroll-area-corner-width":
    "The vertical scrollbar's width while both scrollbars show, so the horizontal one stops short of it. 0px otherwise.",
  "--scroll-area-corner-height":
    "The horizontal scrollbar's height while both show, so the vertical one stops short of it. 0px otherwise.",
  "--scroll-area-overflow-y-start":
    "How far the content reaches above the view, in pixels. Grow a top fade or shadow with it. Not inherited, like the other overflow and progress variables, so scrolling never restyles the content. A child of the root that reads it takes it with `--scroll-area-overflow-y-start: inherit`.",
  "--scroll-area-overflow-y-end":
    "How far the content reaches below the view, in pixels.",
  "--scroll-area-overflow-x-start":
    "How far the content reaches past the inline start, in pixels, left in LTR and right in RTL.",
  "--scroll-area-overflow-x-end":
    "How far the content reaches past the inline end, in pixels.",
  "--scroll-area-progress-y":
    "How far down the view is, from 0 at the top to 1 at the bottom. A reading progress bar can scale with it.",
  "--scroll-area-progress-x":
    "How far along the inline axis the view is, from 0 to 1.",
  "--resizable-panel-size":
    "The panel's share of the group, as a percentage. Written on every frame of a drag, without a render.",
  "--meter-value":
    "Where the value sits between `min` and `max`, as a percentage, like 40%.",
  "--progress-value":
    "Where the value sits between `min` and `max`, as a percentage, like 40%. Unset while indeterminate.",
}

const capitalize = (text: string) => `${text[0].toUpperCase()}${text.slice(1)}`
const lowerFirst = (text: string) =>
  /^[A-Z][a-z]/.test(text) ? `${text[0].toLowerCase()}${text.slice(1)}` : text

/**
 * Every CSS variable a component writes, by the element that carries it, in
 * markup order: its part (`viewport` or `html` for an element that isn't one),
 * its name in `framework`, and each variable with what it holds. Empty for a
 * component that writes none.
 */
function cssVariableTable(component: string, framework: Framework) {
  const table: {
    part: string
    name: string
    variables: { name: string; text: string }[]
  }[] = []
  for (const { part, label, when, variables } of components[component] ?? []) {
    const rows = variables.map((variable) => ({
      name: variable,
      text: when
        ? `${capitalize(when)}: ${lowerFirst(meaning[variable])}`
        : meaning[variable],
    }))
    const last = table.at(-1)
    if (last?.part === part) {
      last.variables.push(...rows)
    } else {
      table.push({
        part,
        name: label
          ? label[framework === "web-components" ? "web" : "react"]
          : partLabel(component, part, framework),
        variables: rows,
      })
    }
  }
  return table
}

export {
  components as cssVariableGroups,
  meaning as cssVariableMeaning,
  cssVariableTable,
}
