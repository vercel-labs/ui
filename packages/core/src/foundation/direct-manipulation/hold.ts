// Press and hold: a long press that opens a context menu on a touch screen, a
// stepper's button that repeats while held, a button held to confirm, a key
// held to talk. A short press clicks as usual; a press that's held doesn't.
import { swallowNextClick } from "../drag-and-drop/pointer"
import { on } from "../kernel/events"

/**
 * What pressed: a pointer's type, or `keyboard` for a key.
 * @experimental
 */
type HoldInput = "mouse" | "touch" | "pen" | "keyboard"

/**
 * What `bindHold`'s callbacks receive.
 * @experimental
 */
type HoldDetails = {
  /** The event that started the press: its `pointerdown` or `keydown`. */
  event: PointerEvent | KeyboardEvent
  /** What pressed. */
  input: HoldInput
}

/**
 * What `bindHold` reports when a press ends.
 * @experimental
 */
type HoldEndDetails = {
  /** The event that ended the press. */
  event: Event
  /** What pressed. */
  input: HoldInput
  /** Whether the press lasted past `delay`. */
  held: boolean
  /**
   * Whether it ended without a release: the pointer moved past `tolerance`, a
   * finger started to scroll, Escape was pressed, or focus left.
   */
  canceled: boolean
}

/**
 * How `bindHold` treats a press.
 * @experimental
 */
type BindHoldOptions = {
  /** How long a press lasts before it's held, in milliseconds. @defaultValue 500 */
  delay?: number
  /**
   * Runs `onHold` again this often while held, in milliseconds, like a
   * stepper's button. Without it, `onHold` runs once.
   */
  repeat?: number
  /**
   * How far a pointer can move before it's held, in pixels, before the press
   * is canceled, like when a finger starts to scroll. @defaultValue 10
   */
  tolerance?: number
  /**
   * The keys that press it while it has focus. A short press clicks it, as a
   * pointer's does. An empty list leaves keys alone. @defaultValue [" ", "Enter"]
   */
  keys?: string[]
  /** Whether a press can't start, and a held one stops repeating. */
  disabled?: () => boolean
  /** Runs as a press starts. Return `false` to ignore it, like a mouse press where only touch holds. */
  onPress?: (details: HoldDetails) => boolean | void
  /**
   * Runs once the press is held, then every `repeat` milliseconds. Return
   * `false` to stop repeating, like at a bound; the press goes on until it ends.
   */
  onHold?: (details: HoldDetails & { count: number }) => boolean | void
  /** Runs once when the press ends, released or canceled. */
  onEnd?: (details: HoldEndDetails) => void
}

type Press = {
  input: HoldInput
  held: boolean
  timer?: number
  unlisten: () => void
}

/**
 * Makes `el` respond to a press that's held: after `delay`, `onHold` runs, and
 * runs again every `repeat` milliseconds when set. Works with a mouse, touch,
 * a pen, and Space or Enter while `el` has focus. A press that was held
 * doesn't click; a short one does, so a held button keeps its click.
 *
 * While pressed, `el` has `data-holding`, and `data-held` once held, and
 * `--hold-delay` is `delay`, so CSS can fill a hold-to-confirm button over it.
 * It turns off iOS's long-press callout on `el`, and the context menu a
 * long press opens while a finger or pen presses. Returns a cleanup that
 * stops a press under way without calling `onEnd`.
 *
 * ```ts
 * bindHold(button, {
 *   delay: 1000,
 *   onHold: () => deleteProject(),
 * })
 * ```
 * @experimental
 */
function bindHold(el: HTMLElement, options: BindHoldOptions = {}) {
  const doc = el.ownerDocument
  const view = doc.defaultView ?? window
  const { delay = 500, tolerance = 10, keys = [" ", "Enter"] } = options
  let press: Press | undefined

  el.style.setProperty("--hold-delay", `${delay}ms`)
  el.style.setProperty("-webkit-touch-callout", "none")

  function start(details: HoldDetails, listen: () => (() => void)[]) {
    if (press || options.disabled?.() || options.onPress?.(details) === false) return false
    let count = 0
    const tick = () => {
      if (!press || options.disabled?.()) return
      press.held = true
      el.setAttribute("data-held", "")
      const repeats = options.onHold?.({ ...details, count: ++count }) !== false
      if (repeats && options.repeat) press.timer = view.setTimeout(tick, options.repeat)
    }
    const listeners = listen()
    press = {
      input: details.input,
      held: false,
      timer: view.setTimeout(tick, delay),
      unlisten: () => listeners.forEach((remove) => remove()),
    }
    el.setAttribute("data-holding", "")
    return true
  }

  function stop() {
    const current = press
    press = undefined
    if (!current) return
    view.clearTimeout(current.timer)
    current.unlisten()
    el.removeAttribute("data-holding")
    el.removeAttribute("data-held")
    return current
  }

  function end(event: Event, canceled: boolean) {
    const current = stop()
    if (!current) return
    const { input, held } = current
    if (held && !canceled && input !== "keyboard") swallowNextClick(doc)
    options.onEnd?.({ event, input, held, canceled })
    if (input === "keyboard" && !held && !canceled) el.click()
  }

  // Escape cancels a press without reaching a popup or dialog around it.
  const onEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    event.preventDefault()
    event.stopPropagation()
    end(event, true)
  }

  const onPointerDown = (event: PointerEvent) => {
    // A mouse is always primary; a second finger or pen joins no press.
    const secondary = !event.isPrimary && event.pointerType !== "mouse"
    if (event.button !== 0 || secondary || event.defaultPrevented) return
    const input = (event.pointerType || "mouse") as HoldInput
    const ours = (move: PointerEvent) => move.pointerId === event.pointerId
    start({ event, input }, () => [
      on(doc, "pointermove", (move) => {
        if (!ours(move)) return
        // A mouse released outside a frame that missed the pointerup.
        if (move.pointerType === "mouse" && move.buttons === 0) return end(move, false)
        const distance = Math.hypot(move.clientX - event.clientX, move.clientY - event.clientY)
        if (!press?.held && distance > tolerance) end(move, true)
      }),
      on(doc, "pointerup", (up) => ours(up) && end(up, false)),
      on(doc, "pointercancel", (cancel) => ours(cancel) && end(cancel, true)),
      on(doc, "contextmenu", (menu) => input !== "mouse" && menu.preventDefault()),
      on(doc, "keydown", onEscape, { capture: true }),
      on(view, "blur", (blur) => end(blur, true)),
    ])
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target !== el || !keys.includes(event.key)) return
    // The keyboard's own repeats would click a button again and again.
    if (press?.input === "keyboard") return event.preventDefault()
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
    const started = start({ event, input: "keyboard" }, () => [
      on(el, "keyup", (up) => {
        if (up.key !== event.key) return
        up.preventDefault()
        end(up, false)
      }),
      on(el, "blur", (blur) => end(blur, true)),
      on(doc, "keydown", onEscape, { capture: true }),
    ])
    if (started) event.preventDefault()
  }

  const listeners = [on(el, "pointerdown", onPointerDown), on(el, "keydown", onKeyDown)]
  return () => {
    stop()
    listeners.forEach((remove) => remove())
    el.style.removeProperty("--hold-delay")
    el.style.removeProperty("-webkit-touch-callout")
  }
}

export { bindHold, type BindHoldOptions, type HoldDetails, type HoldEndDetails, type HoldInput }
