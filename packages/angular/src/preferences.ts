import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  untracked,
} from "@angular/core"
import { preferencesScript, type PreferenceLike } from "@ui-sdk/core"

// The script the server put first in the element, which a server DOM finds
// without selectors.
const scriptIn = (el: HTMLElement) => {
  const first = el.firstElementChild
  return first?.localName === "script" && first.hasAttribute("data-preferences")
    ? first
    : undefined
}

/**
 * Shows preferences on `data-*` attributes, so CSS styles by them from the
 * first paint: global ones on `<html>`, the rest on its own element. Put it on
 * an element around your app, like `<div uiPreferences [preferences]="[theme]">`;
 * it gets `display: contents`. On the server it renders one inline script as
 * its first child, which puts every saved value on its attribute as the page
 * loads, before hydration. Content that reads a preference, through
 * `usePreference`, catches up after hydration.
 * @experimental
 */
@Directive({
  selector: "[uiPreferences]",
  exportAs: "uiPreferences",
  host: { "data-slot": "preferences", style: "display: contents" },
})
class Preferences {
  /** The preferences to show, from `createPreference` or `createColorScheme`. */
  readonly preferences = input.required<readonly PreferenceLike[]>()
  /** The nonce your Content Security Policy gives inline scripts. */
  readonly nonce = input<string>()

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    if (inject(PLATFORM_ID) === "server") {
      // The server renders the defaults, and the script that shows what was saved.
      effect(() => {
        const list = this.preferences()
        for (const preference of list) {
          if (!preference.global) {
            el.setAttribute(preference.attribute, preference.initialState.value)
          }
        }
        untracked(() => {
          scriptIn(el)?.remove()
          const script = el.ownerDocument.createElement("script")
          script.setAttribute("data-preferences", "")
          const nonce = this.nonce()
          if (nonce) {
            script.setAttribute("nonce", nonce)
          }
          script.textContent = preferencesScript(list)
          el.insertBefore(script, el.firstChild)
        })
      })
      return
    }
    // The script has run by now. Taking it out before the content hydrates
    // leaves the element's children as the server's view had them.
    scriptIn(el)?.remove()
    let stop = () => {}
    inject(DestroyRef).onDestroy(() => stop())
    const rendered = signal(false)
    afterNextRender(() => rendered.set(true))
    // Only a different preference starts over, since a template's inline
    // list is a new array each time it's read.
    let following: readonly PreferenceLike[] = []
    effect(() => {
      const list = this.preferences()
      if (
        !rendered() ||
        (list.length === following.length &&
          list.every((preference, index) => preference === following[index]))
      ) {
        return
      }
      following = list
      stop()
      const write = () => {
        for (const preference of list) {
          ;(preference.global
            ? el.ownerDocument.documentElement
            : el
          ).setAttribute(preference.attribute, preference.get().value)
        }
      }
      // Subscribing first reads back what was saved.
      const stops = list.map((preference) => preference.subscribe(write))
      write()
      stop = () => stops.forEach((each) => each())
    })
  }
}

/**
 * A preference's state, like `{ value: "dark" }`, or a color scheme's, as a
 * signal. It's the server's until the page renders, so the page hydrates
 * without a mismatch, and the saved value right after. Call it in a field
 * initializer.
 * @experimental
 */
function usePreference<State>(preference: {
  get: () => State
  initialState: State
  subscribe: (listener: () => void) => () => void
}) {
  const state = signal(preference.initialState)
  let stop = () => {}
  afterNextRender(() => {
    // Subscribing first reads back what was saved.
    stop = preference.subscribe(() => state.set(preference.get()))
    state.set(preference.get())
  })
  inject(DestroyRef).onDestroy(() => stop())
  return state.asReadonly()
}

export { Preferences, usePreference }
