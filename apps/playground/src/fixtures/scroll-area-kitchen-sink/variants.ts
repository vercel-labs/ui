import type { ScrollAreaType } from "@ui-sdk/core/scroll-area"

// Every scenario in the scroll area kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Plain options, so the web components take them as attributes.
  options: {
    type?: ScrollAreaType
    scrollHideDelay?: number
    stickToEnd?: boolean
  }
  // What fills the viewport. Plain DOM, filled by the shell, so every framework shows the same.
  content:
    "text" | "links" | "short" | "grid" | "wide" | "chat" | "snap" | "nested"
  // Which Scrollbar parts render. "none" keeps the native scrollbars.
  scrollbars: "vertical" | "horizontal" | "both" | "none"
  // Where the scroll area sits.
  place?: "rtl" | "max-height" | "scaled"
  // Fades over the top and bottom edges from the CSS variables.
  fade?: boolean
  // `scroll-behavior: smooth` on the viewport.
  smooth?: boolean
  // A ScrollToEnd part.
  jump?: boolean
  // Controller buttons below the stage.
  controller?: boolean
}

const types: ScrollAreaType[] = ["hover", "scroll", "auto", "always"]

const variants: Variant[] = [
  ...types.map((type) => ({
    id: `type-${type}`,
    section: "Scrollbar types",
    title: `type="${type}"`,
    options: { type },
    content: "text" as const,
    scrollbars: "vertical" as const,
  })),
  {
    id: "type-always-short",
    section: "Scrollbar types",
    title: "always, content fits",
    note: "The track shows with no thumb.",
    options: { type: "always" },
    content: "short",
    scrollbars: "vertical",
  },
  ...[0, 2000].map((scrollHideDelay) => ({
    id: `delay-${scrollHideDelay}`,
    section: "Hide delay",
    title: `scrollHideDelay=${scrollHideDelay}`,
    options: { type: "scroll" as const, scrollHideDelay },
    content: "text" as const,
    scrollbars: "vertical" as const,
  })),
  {
    id: "axes-horizontal",
    section: "Axes",
    title: "Horizontal",
    options: { type: "auto" },
    content: "wide",
    scrollbars: "horizontal",
  },
  {
    id: "axes-both",
    section: "Axes",
    title: "Both, with a corner",
    options: { type: "auto" },
    content: "grid",
    scrollbars: "both",
  },
  {
    id: "axes-native",
    section: "Axes",
    title: "No Scrollbar parts",
    note: "Native scrollbars stay.",
    options: {},
    content: "text",
    scrollbars: "none",
  },
  {
    id: "focus-links",
    section: "Keyboard",
    title: "Focusable content",
    note: "Tab reaches the links; the viewport is no tab stop.",
    options: { type: "auto" },
    content: "links",
    scrollbars: "vertical",
  },
  {
    id: "focus-text",
    section: "Keyboard",
    title: "Text only",
    note: "The viewport is the tab stop.",
    options: { type: "auto" },
    content: "text",
    scrollbars: "vertical",
  },
  {
    id: "stick-chat",
    section: "Sticking to the end",
    title: "stickToEnd",
    note: "Stream adds words; scroll up to let go.",
    options: { stickToEnd: true, type: "auto" },
    content: "chat",
    scrollbars: "vertical",
    jump: true,
    controller: true,
  },
  {
    id: "stick-smooth",
    section: "Sticking to the end",
    title: "With scroll-behavior: smooth",
    options: { stickToEnd: true, type: "auto" },
    content: "chat",
    scrollbars: "vertical",
    smooth: true,
    jump: true,
  },
  {
    id: "stick-native",
    section: "Sticking to the end",
    title: "Native scrollbars",
    options: { stickToEnd: true },
    content: "chat",
    scrollbars: "none",
    jump: true,
  },
  {
    id: "place-rtl",
    section: "Placement",
    title: "Right to left",
    options: { type: "auto" },
    content: "grid",
    scrollbars: "both",
    place: "rtl",
  },
  {
    id: "place-max-height",
    section: "Placement",
    title: "max-height on the root",
    options: { type: "auto" },
    content: "text",
    scrollbars: "vertical",
    place: "max-height",
  },
  {
    id: "place-scaled",
    section: "Placement",
    title: "Inside scale(1.5)",
    note: "Drags follow the pointer.",
    options: { type: "auto" },
    content: "text",
    scrollbars: "vertical",
    place: "scaled",
  },
  {
    id: "content-snap",
    section: "Content",
    title: "Scroll snapping",
    note: "Snapping pauses while dragging the thumb.",
    options: { type: "auto" },
    content: "snap",
    scrollbars: "vertical",
  },
  {
    id: "content-fade",
    section: "Content",
    title: "Edge fades",
    note: "From --scroll-area-overflow-y-start and -end.",
    options: { type: "hover" },
    content: "text",
    scrollbars: "vertical",
    fade: true,
  },
  {
    id: "content-nested",
    section: "Content",
    title: "Nested",
    note: "A wheel over the inner area scrolls it first.",
    options: { type: "auto" },
    content: "nested",
    scrollbars: "vertical",
  },
  {
    id: "controller",
    section: "Controller",
    title: "createScrollAreaController()",
    options: { type: "auto" },
    content: "text",
    scrollbars: "vertical",
    controller: true,
  },
]

// What the props chips show.
function chipsOf(variant: Variant) {
  return {
    ...variant.options,
    ...(variant.scrollbars !== "vertical" && {
      scrollbars: variant.scrollbars,
    }),
    ...(variant.place && { place: variant.place }),
  }
}

const paragraphs = Array.from(
  { length: 24 },
  (_, index) =>
    `Line ${index + 1}: a scroll area keeps the browser's own scrolling and draws its own scrollbars.`
)

// Fills a variant's content element with plain DOM, the same in every framework.
function fillContent(el: HTMLElement, variant: Variant) {
  const add = (tag: string, text: string, className = "") => {
    const child = document.createElement(tag)
    child.textContent = text
    if (className) {
      child.className = className
    }
    el.append(child)
    return child
  }
  if (variant.content === "short") {
    add("p", "Two lines.")
  }
  if (variant.content === "text") {
    for (const line of paragraphs) {
      add("p", line, "py-1")
    }
  }
  if (variant.content === "links") {
    for (let index = 1; index <= 20; index++) {
      const link = add("a", `Link ${index}`, "block py-1 underline")
      link.setAttribute("href", `#link-${index}`)
    }
  }
  if (variant.content === "wide") {
    el.className += " flex w-max gap-2"
    for (let index = 1; index <= 12; index++) {
      add(
        "div",
        `Card ${index}`,
        "grid h-32 w-28 place-items-center rounded bg-neutral-100"
      )
    }
  }
  if (variant.content === "grid") {
    el.className += " grid w-max grid-cols-[repeat(8,6rem)] gap-2"
    for (let index = 1; index <= 48; index++) {
      add(
        "div",
        `${index}`,
        "grid h-16 place-items-center rounded bg-neutral-100"
      )
    }
  }
  if (variant.content === "chat") {
    for (let index = 1; index <= 12; index++) {
      add("p", `Message ${index}`, "my-1 rounded bg-neutral-100 px-2 py-1")
    }
  }
  if (variant.content === "snap") {
    for (let index = 1; index <= 12; index++) {
      add(
        "div",
        `Slide ${index}`,
        "grid h-44 snap-start place-items-center border-b"
      )
    }
  }
  if (variant.content === "nested") {
    for (const line of paragraphs.slice(0, 6)) {
      add("p", line, "py-1")
    }
    const inner = add("div", "", "my-2 h-24 overflow-auto rounded border p-2")
    for (const line of paragraphs.slice(0, 10)) {
      const child = document.createElement("p")
      child.textContent = line
      inner.append(child)
    }
    for (const line of paragraphs.slice(6, 14)) {
      add("p", line, "py-1")
    }
  }
}

// Words streamed into the last message of a chat variant.
function streamInto(el: HTMLElement) {
  const last = el.lastElementChild
  if (!last) {
    return
  }
  last.append(" and more words while the answer streams in")
}

function addMessage(el: HTMLElement) {
  const message = document.createElement("p")
  message.className = "my-1 rounded bg-neutral-100 px-2 py-1"
  message.textContent = `Message ${el.children.length + 1}`
  el.append(message)
}

export { addMessage, chipsOf, fillContent, streamInto, type Variant, variants }
