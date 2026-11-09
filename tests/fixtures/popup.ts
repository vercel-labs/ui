import type { Locator, Page } from "@playwright/test"

// Helpers for behavior every popup shares, like Menu and Popover.

// A scroll box with a scrollbar at the bottom left of the page. Returns a point
// on its scrollbar, or nothing when the browser draws no scrollbars.
async function addScroller(page: Page) {
  return page.evaluate(() => {
    const style = document.createElement("style")
    style.textContent =
      "#scroller::-webkit-scrollbar { width: 16px; background: #ccc } #scroller::-webkit-scrollbar-thumb { background: #666 }"
    document.head.append(style)
    const el = document.createElement("div")
    el.id = "scroller"
    el.style.cssText =
      "position: fixed; left: 0; bottom: 0; width: 200px; height: 100px; overflow-y: scroll"
    el.innerHTML = '<div style="height: 400px"></div>'
    document.body.append(el)
    const width = el.offsetWidth - el.clientWidth
    const rect = el.getBoundingClientRect()
    return width > 0
      ? { x: rect.left + el.clientWidth + width / 2, y: rect.top + 50 }
      : undefined
  })
}

// Presses Escape on the focused element while an input method composes text,
// like a Japanese candidate list that Escape should close first.
async function composingEscape(page: Page) {
  await page.evaluate(() =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        isComposing: true,
        bubbles: true,
        cancelable: true,
      })
    )
  )
}

// Puts a custom element before `el` whose open shadow root holds a button
// named "Shadow", like a design system's button inside a popup.
async function addShadowButton(el: Locator) {
  await el.evaluate((el) => {
    if (!customElements.get("shadow-button")) {
      customElements.define(
        "shadow-button",
        class extends HTMLElement {
          connectedCallback() {
            if (!this.shadowRoot) {
              this.attachShadow({ mode: "open" }).innerHTML =
                "<button>Shadow</button>"
            }
          }
        }
      )
    }
    el.before(document.createElement("shadow-button"))
  })
}

// Moves `el` into the open shadow root of an element that takes its place,
// like a component rendered inside a design system's custom element.
async function moveIntoShadowRoot(el: Locator) {
  await el.evaluate((el) => {
    const host = document.createElement("div")
    el.before(host)
    host.attachShadow({ mode: "open" }).append(el)
  })
}

// Clips a list's popup to a few items, scrolling either the content or the list
// inside it, the two ways authors style a scrolling list.
async function scrollIn(listbox: Locator, part: "content" | "list") {
  await listbox.evaluate((list, part) => {
    const content = list.closest<HTMLElement>(".list-popup")!
    if (part === "list") {
      Object.assign(content.style, { maxHeight: "none", overflowY: "visible" })
    }
    Object.assign((part === "list" ? list : content).style, {
      maxHeight: "80px",
      overflowY: "auto",
    })
  }, part)
}

// Whether an element shows whole inside the ancestor that scrolls it.
async function scrolledIntoView(el: Locator) {
  return el.evaluate((el) => {
    let node = el.parentElement
    while (
      node &&
      !(
        /(auto|scroll)/.test(getComputedStyle(node).overflowY) &&
        node.scrollHeight > node.clientHeight
      )
    ) {
      node = node.parentElement
    }
    if (!node) {
      return false
    }
    const box = el.getBoundingClientRect()
    const view = node.getBoundingClientRect()
    return box.top >= view.top - 1 && box.bottom <= view.bottom + 1
  })
}

export {
  addScroller,
  addShadowButton,
  composingEscape,
  moveIntoShadowRoot,
  scrollIn,
  scrolledIntoView,
}
