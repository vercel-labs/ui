import { on } from "../kernel/events"
import { bindHold, type HoldDetails, type HoldInput } from "./hold"

/**
 * What `bindRepeat`'s `onStep` receives.
 * @experimental
 */
type RepeatDetails = {
  /**
   * The event behind the step: the press's `pointerdown` or `keydown`, the
   * `pointerup` of a tap, or a `click`.
   */
  event: MouseEvent | KeyboardEvent
  /**
   * What pressed. `click` is a click with no pointer press behind it, like a
   * screen reader's, Enter or Space when `keys` is empty, or `el.click()`.
   */
  input: HoldInput | "click"
  /** Which step of the press this is, starting at 1. */
  count: number
}

/**
 * What `bindRepeat`'s `onEnd` receives.
 * @experimental
 */
type RepeatEndDetails = {
  /** The event that ended the press. */
  event: Event
  /** What pressed. */
  input: HoldInput | "click"
  /** How many times the press stepped. */
  count: number
}

/**
 * How `bindRepeat` treats a press.
 * @experimental
 */
type BindRepeatOptions = {
  /** How long a press lasts before it starts repeating, in milliseconds. @defaultValue 400 */
  delay?: number
  /** How often it steps again while held, in milliseconds. @defaultValue 60 */
  repeat?: number
  /**
   * The keys that press it while it has focus. An empty list leaves keys to
   * the browser, which clicks a button once per key press. @defaultValue [" ", "Enter"]
   */
  keys?: string[]
  /** Whether a press can't start, and a held one stops repeating. */
  disabled?: () => boolean
  /** Runs as a press starts. Return `false` to ignore it. */
  onPress?: (details: HoldDetails) => boolean | void
  /**
   * Runs once for each press, then every `repeat` milliseconds while it's
   * held. Return `false` to stop repeating, like at a bound.
   */
  onStep?: (details: RepeatDetails) => boolean | void
  /** Runs once when a press ends, released or canceled, and after a click's step. */
  onEnd?: (details: RepeatEndDetails) => void
}

// Presses without the click listener, for a part that takes clicks through
// its slot's `on`, where a user's handler runs first and can cancel the step.
function bindRepeatPresses(el: HTMLElement, options: BindRepeatOptions) {
  const { delay = 400, repeat = 60, keys = [" ", "Enter"] } = options
  let count = 0
  let stopped = false
  let inside = true
  let unfollow: (() => void) | undefined

  function step(event: RepeatDetails["event"], input: HoldInput) {
    if (stopped) {
      return false
    }
    count += 1
    stopped = options.onStep?.({ event, input, count }) === false
    return !stopped
  }

  function follow(down: PointerEvent) {
    const bounds = el.getBoundingClientRect()
    unfollow = on(el.ownerDocument, "pointermove", (move) => {
      if (move.pointerId !== down.pointerId) {
        return
      }
      inside =
        move.clientX >= bounds.left &&
        move.clientX <= bounds.right &&
        move.clientY >= bounds.top &&
        move.clientY <= bounds.bottom
    })
  }

  function reset() {
    unfollow?.()
    unfollow = undefined
    inside = true
  }

  const unbindHold = bindHold(el, {
    delay,
    repeat,
    keys,
    tolerance: Infinity,
    disabled: options.disabled,
    onPress: (press) => {
      if (options.onPress?.(press) === false) {
        return false
      }
      count = 0
      stopped = false
      if (press.input !== "keyboard") {
        follow(press.event as PointerEvent)
      }
      if (press.input === "mouse" || press.input === "keyboard") {
        step(press.event, press.input)
      }
    },
    onHold: ({ event, input }) => !inside || step(event, input),
    onEnd: ({ event, input, held, canceled }) => {
      const tapped =
        (input === "touch" || input === "pen") &&
        !held &&
        !canceled &&
        inside &&
        !options.disabled?.()
      reset()
      if (tapped) {
        step(event as PointerEvent, input)
      }
      options.onEnd?.({ event, input, count })
    },
  })

  return () => {
    unbindHold()
    reset()
  }
}

/**
 * Makes `el` step once when pressed, then keep stepping while held, like a
 * stepper's arrows or a remote's volume button. A mouse or a key steps as it
 * goes down. A finger or a pen steps on release, or once held, so a scroll
 * that starts on `el` never steps. Repeats wait while the pointer is off `el`
 * and go on when it comes back. A click with no press behind it steps once,
 * and the click that follows a press doesn't step again. Returns a cleanup.
 *
 * ```ts
 * bindRepeat(button, { onStep: () => zoomBy(5) })
 * ```
 * @experimental
 */
function bindRepeat(el: HTMLElement, options: BindRepeatOptions = {}) {
  let afterKey = false
  const unbindPresses = bindRepeatPresses(el, {
    ...options,
    onEnd: (details) => {
      // `bindHold` clicks after a short key press, which stepped on keydown.
      if (details.input === "keyboard") {
        afterKey = true
        queueMicrotask(() => (afterKey = false))
      }
      options.onEnd?.(details)
    },
  })
  const unlistenClick = on(el, "click", (event) => {
    if (
      event.detail !== 0 ||
      event.defaultPrevented ||
      afterKey ||
      options.disabled?.()
    ) {
      return
    }
    options.onStep?.({ event, input: "click", count: 1 })
    options.onEnd?.({ event, input: "click", count: 1 })
  })
  return () => {
    unbindPresses()
    unlistenClick()
  }
}

export {
  bindRepeat,
  bindRepeatPresses,
  type BindRepeatOptions,
  type RepeatDetails,
  type RepeatEndDetails,
}
