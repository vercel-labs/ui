import {
  createScrollAreaController,
  type ScrollAreaController,
} from "@ui-sdk/core/scroll-area"
import * as classes from "./classes"
import {
  fadeBottom,
  fadeBottomStyle,
  fadeTop,
  fadeTopStyle,
  kitchenSink,
  rootClass,
  variantControls,
  viewportClass,
} from "./shell"
import { fillContent, type Variant } from "./variants"

// Options as attributes.
function attributes(options: Variant["options"]) {
  return Object.entries(options)
    .map(
      ([name, value]) =>
        ` ${name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}="${value}"`
    )
    .join("")
}

const scrollbar = (orientation: string) => `
  <ui-scroll-area-scrollbar class="${classes.scrollbar}" orientation="${orientation}">
    <ui-scroll-area-thumb class="${classes.thumb}"></ui-scroll-area-thumb>
  </ui-scroll-area-scrollbar>`

function markup(variant: Variant) {
  const { scrollbars } = variant
  return `<ui-scroll-area class="${rootClass(variant)}"${attributes(variant.options)}>
    <ui-scroll-area-viewport class="${viewportClass(variant)}">
      <ui-scroll-area-content class="${classes.content}"></ui-scroll-area-content>
    </ui-scroll-area-viewport>
    ${variant.fade ? `<div class="${fadeTop}" style="${fadeTopStyle}"></div><div class="${fadeBottom}" style="${fadeBottomStyle}"></div>` : ""}
    ${scrollbars === "vertical" || scrollbars === "both" ? scrollbar("vertical") : ""}
    ${scrollbars === "horizontal" || scrollbars === "both" ? scrollbar("horizontal") : ""}
    ${scrollbars === "both" ? `<ui-scroll-area-corner class="${classes.corner}"></ui-scroll-area-corner>` : ""}
    ${variant.jump ? `<ui-scroll-area-scroll-to-end><button class="${classes.jump}">Jump to latest</button></ui-scroll-area-scroll-to-end>` : ""}
  </ui-scroll-area>`
}

async function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = markup(variant)
    // Set as a property before the element upgrades, which happens once the card is in the page.
    const area = slot.firstElementChild as HTMLElement & {
      controller?: ScrollAreaController
    }
    const controller = createScrollAreaController()
    area.controller = controller
    const content = slot.querySelector<HTMLElement>("ui-scroll-area-content")!
    fillContent(content, variant)
    variantControls(variant, content, controller, env)
  })
  await import("@ui-sdk/web/scroll-area")
}

export { mount }
