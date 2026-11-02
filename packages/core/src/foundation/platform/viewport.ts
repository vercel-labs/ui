// What a phone's screen leaves for the page: the on-screen keyboard over the
// layout viewport's bottom, the visual viewport iOS pans to keep a field in
// view, and the safe areas around a notch or home indicator.

import { keyboardHeight, keyboardInset, measureViewport } from "./keyboard"

/**
 * What `bindViewport` reports, in CSS pixels.
 * @experimental
 */
type ViewportState = {
  /** The on-screen keyboard's height while a field has focus, zoomed in or not. 0 without one. */
  keyboard: number
  /** How much of the layout viewport's bottom the keyboard covers: less while iOS pans the page, and 0 when the browser resizes the page instead. */
  keyboardInset: number
  /** The visual viewport's width: what's on screen. */
  width: number
  /** The visual viewport's height: what's on screen, above the keyboard. */
  height: number
  /** How far the visual viewport is scrolled down the layout viewport, like when iOS pans a focused field into view. */
  offsetTop: number
  /** How far the visual viewport is scrolled across the layout viewport. */
  offsetLeft: number
  /** The pinch-zoom scale, 1 when not zoomed. */
  scale: number
  /** The safe-area insets around a notch, rounded corners or a home indicator. All 0 without `viewport-fit=cover`. */
  safeArea: { top: number; right: number; bottom: number; left: number }
}

const sides = ["top", "right", "bottom", "left"] as const

// `env()` can't be read from script, so a hidden element pads itself with it.
function safeAreaProbe(doc: Document) {
  const probe = doc.createElement("div")
  probe.setAttribute("aria-hidden", "true")
  probe.style.cssText = `position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;${sides
    .map((side) => `padding-${side}:env(safe-area-inset-${side},0px)`)
    .join(";")}`
  doc.body.append(probe)
  return probe
}

// The visual viewport, or the window where a browser has none.
function sizeOf(view: Window) {
  const visual = view.visualViewport
  if (visual) return measureViewport(view, visual)
  return {
    width: view.innerWidth,
    layoutHeight: view.innerHeight,
    height: view.innerHeight,
    offsetTop: 0,
    scale: 1,
  }
}

function measure(
  view: Window,
  probe: HTMLElement,
  keyboard: ReturnType<typeof keyboardHeight>,
  event?: Event,
) {
  const size = sizeOf(view)
  const height = keyboard(size, event)
  const style = view.getComputedStyle(probe)
  const inset = (side: (typeof sides)[number]) =>
    Math.round(Number.parseFloat(style.getPropertyValue(`padding-${side}`)) || 0)
  return {
    keyboard: height,
    keyboardInset: keyboardInset(view, size, height),
    width: Math.round(size.width),
    height: Math.round(size.height),
    offsetTop: Math.round(size.offsetTop),
    offsetLeft: Math.round(view.visualViewport?.offsetLeft ?? 0),
    scale: size.scale,
    safeArea: { top: inset("top"), right: inset("right"), bottom: inset("bottom"), left: inset("left") },
  }
}

/**
 * Follows the viewport on `el`: `--keyboard-inset`, `--visual-viewport-width`,
 * `--visual-viewport-height` and `--visual-viewport-top`, plus `data-keyboard`
 * while the keyboard covers part of the page. `onChange` hears every change,
 * and once at the start. Returns a cleanup that removes what it wrote.
 * @experimental
 */
function bindViewport(el: HTMLElement, { onChange }: { onChange?: (viewport: ViewportState) => void } = {}) {
  const doc = el.ownerDocument
  const view = doc.defaultView
  if (!view) return () => {}
  const probe = safeAreaProbe(doc)
  const keyboard = keyboardHeight(view)
  let last = ""
  const update = (event?: Event) => {
    const viewport = measure(view, probe, keyboard, event)
    el.style.setProperty("--keyboard-inset", `${viewport.keyboardInset}px`)
    el.style.setProperty("--visual-viewport-width", `${viewport.width}px`)
    el.style.setProperty("--visual-viewport-height", `${viewport.height}px`)
    el.style.setProperty("--visual-viewport-top", `${viewport.offsetTop}px`)
    el.toggleAttribute("data-keyboard", viewport.keyboard > 0)
    const key = JSON.stringify(viewport)
    if (key === last) return
    last = key
    onChange?.(viewport)
  }
  update()
  const visual = view.visualViewport
  visual?.addEventListener("resize", update)
  visual?.addEventListener("scroll", update)
  view.addEventListener("resize", update)
  doc.addEventListener("focusin", update)
  doc.addEventListener("focusout", update)
  return () => {
    visual?.removeEventListener("resize", update)
    visual?.removeEventListener("scroll", update)
    view.removeEventListener("resize", update)
    doc.removeEventListener("focusin", update)
    doc.removeEventListener("focusout", update)
    probe.remove()
    for (const name of [
      "--keyboard-inset",
      "--visual-viewport-width",
      "--visual-viewport-height",
      "--visual-viewport-top",
    ])
      el.style.removeProperty(name)
    el.removeAttribute("data-keyboard")
  }
}

/**
 * Keeps `el` above the on-screen keyboard, like a chat composer or a toolbar
 * at the bottom of the screen: while the keyboard is open, it lifts `el` by as
 * much of it as lies below what's on screen, through its `translate`, and sets
 * `data-keyboard`. An element below the layout viewport stays put. Returns a
 * cleanup that puts `el`'s own `translate` back.
 * @experimental
 */
function bindAvoidKeyboard(el: HTMLElement) {
  const view = el.ownerDocument.defaultView
  const visual = view?.visualViewport
  if (!view || !visual) return () => {}
  const own = el.style.translate
  // The translate el has now, as shown: mid-transition, part of the way to the lift.
  const shown = () => {
    const [x = "0", y = "0"] = view.getComputedStyle(el).translate.split(" ")
    return { x: Number.parseFloat(x) || 0, y: Number.parseFloat(y) || 0 }
  }
  const rest = shown()
  // iOS measures boxes from the visual viewport while it's panned, others from
  // the layout viewport. A fixed element at the top is where the layout starts.
  const origin = el.ownerDocument.createElement("div")
  origin.setAttribute("aria-hidden", "true")
  origin.setAttribute("data-viewport-origin", "")
  origin.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none"
  el.ownerDocument.body.append(origin)
  const keyboardOpen = keyboardHeight(view)
  let lifted = 0
  const update = (event?: Event) => {
    const keyboard = keyboardOpen(sizeOf(view), event)
    // Where el would be without the lift, in the layout viewport the keyboard
    // covers, against where the visible part of the page ends.
    const box = el.getBoundingClientRect()
    const shift = shown().y - rest.y + origin.getBoundingClientRect().top
    const bottom = Math.min(box.bottom - shift, view.innerHeight)
    const covered = box.top - shift < view.innerHeight ? bottom - visual.offsetTop - visual.height : 0
    const next = keyboard ? Math.round(Math.max(0, covered)) : 0
    el.toggleAttribute("data-keyboard", keyboard > 0)
    if (next === lifted) return
    lifted = next
    el.style.translate = lifted ? `${rest.x}px ${rest.y - lifted}px` : own
  }
  update()
  // Scrolling reports late and often, so it measures once a frame, as the page paints.
  let frame = 0
  const scrolled = () => {
    view.cancelAnimationFrame(frame)
    frame = view.requestAnimationFrame(() => update())
  }
  visual.addEventListener("resize", update)
  visual.addEventListener("scroll", scrolled)
  view.addEventListener("scroll", scrolled, { passive: true })
  el.ownerDocument.addEventListener("focusin", update)
  el.ownerDocument.addEventListener("focusout", update)
  return () => {
    view.cancelAnimationFrame(frame)
    visual.removeEventListener("resize", update)
    visual.removeEventListener("scroll", scrolled)
    view.removeEventListener("scroll", scrolled)
    el.ownerDocument.removeEventListener("focusin", update)
    el.ownerDocument.removeEventListener("focusout", update)
    origin.remove()
    el.style.translate = own
    el.removeAttribute("data-keyboard")
  }
}

export { bindAvoidKeyboard, bindViewport, type ViewportState }
