// @vitest-environment jsdom
// An open popup binds again when a framework brings its element back, like a
// page a <KeepAlive> cached or a hidden <Activity> shows again, and when
// React's StrictMode binds it twice.
import { afterEach, expect, test } from "vitest"
import { createStore } from "../src/foundation/kernel/store"
import {
  createPopupLayer,
  modalTriple,
  type Modal,
} from "../src/foundation/popups/popup"

Element.prototype.getAnimations ??= () => []
// No top layer here, and the DOM's own styles would keep the popup hidden,
// where nothing inside can take focus.
document.head.append(
  Object.assign(document.createElement("style"), {
    textContent: "[popover] { display: block !important }",
  })
)
// jsdom keeps `inert` as a plain property, where a browser reflects it to the
// attribute that tells what a modal made unusable.
Object.defineProperty(HTMLElement.prototype, "inert", {
  configurable: true,
  get(this: HTMLElement) {
    return this.hasAttribute("inert")
  },
  set(this: HTMLElement, value: boolean) {
    this.toggleAttribute("inert", value)
  },
})

afterEach(() => {
  document.body.replaceChildren()
  document.documentElement.removeAttribute("style")
})

const settle = () => new Promise((done) => setTimeout(done))

// A popup opened from the keyboard, with a field it focuses first and a
// button after it, and a button on the page outside it.
async function openPopup(preset: "dialog" | "popover", modal: Modal) {
  const outside = document.body.appendChild(document.createElement("button"))
  const trigger = document.body.appendChild(document.createElement("button"))
  const el = document.body.appendChild(document.createElement("div"))
  const field = el.appendChild(document.createElement("input"))
  const button = el.appendChild(document.createElement("button"))
  const store = createStore({ open: false, mounted: false }, [])
  const popup = createPopupLayer({
    preset,
    store,
    trigger: () => trigger,
    close: () => store.set({ open: false }),
    modal: () => modalTriple(modal),
  })
  const bind = () => popup.bind(el, { initialFocus: () => field })
  const unbind = bind()
  popup.opening("keyboard")
  store.set({ open: true })
  await settle()
  return { bind, unbind, outside, field, button }
}

test("an open modal that binds again while focus is on the body takes focus back", async () => {
  const { bind, unbind, field } = await openPopup("dialog", true)
  expect(document.activeElement).toBe(field)
  unbind()
  field.blur()
  bind()
  await settle()
  expect(document.activeElement).toBe(field)
})

test("an open modal that binds again takes focus from what its return made inert", async () => {
  const { bind, unbind, outside, field } = await openPopup("dialog", true)
  unbind()
  outside.focus()
  bind()
  await settle()
  expect(document.activeElement).toBe(field)
})

test("an open modal that binds again with focus inside leaves it there, as StrictMode does", async () => {
  const { bind, unbind, button } = await openPopup("dialog", true)
  button.focus()
  unbind()
  bind()
  await settle()
  expect(document.activeElement).toBe(button)
})

test("a non-modal popover that binds again leaves focus where it is", async () => {
  const { bind, unbind, field } = await openPopup("popover", false)
  expect(document.activeElement).toBe(field)
  unbind()
  field.blur()
  bind()
  await settle()
  expect(document.activeElement).toBe(document.body)
})
