import { effect, ElementRef, inject, signal, TemplateRef } from "@angular/core"

// Fills an element the author left empty with its part's text, like a field
// error's browser message. `marker` says the text is ours, so hydration keeps
// updating it. The `*` form fills the element `rendered` reads.
function useText(
  text: () => string | undefined,
  marker = "data-text",
  rendered?: () => HTMLElement | null
) {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  const template = inject(TemplateRef, { optional: true })
  if (
    template ? !rendered : host.nodeType !== 1 || host.localName === "input"
  ) {
    return
  }
  effect(() => {
    const el = template ? rendered?.() : host
    const next = text() ?? ""
    if (!el) {
      return
    }
    if (!el.hasAttribute(marker)) {
      if (el.childNodes.length) {
        return
      }
      el.setAttribute(marker, "")
    }
    if (el.textContent !== next) {
      el.textContent = next
    }
  })
}

// Whether the author left the element empty, for a part whose text core
// writes then. Known once the element's content is in the page.
function useBlank() {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  const blank = signal(false)
  if (el.nodeType === 1) {
    effect(() => blank.set(!el.childNodes.length))
  }
  return blank.asReadonly()
}

// Takes attributes the author wrote on a part that belong on an element
// inside it, like a slider thumb's `aria-label`, which names its input.
function moveAttributes(names: readonly string[]) {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  const moved: Record<string, string> = {}
  for (const name of names) {
    const value = el.getAttribute(name)
    if (value !== null) {
      moved[name] = value
      el.removeAttribute(name)
    }
  }
  return moved
}

// Keeps names the author bound on a part, like `[aria-label]`, on an element
// inside it. `skip` leaves a name to whatever else writes it, like a field.
function bindAttributes(
  el: HTMLElement,
  attributes: () => Record<string, string | undefined>,
  skip: (name: string) => boolean
) {
  const written = new Set<string>()
  effect(() => {
    for (const [name, value] of Object.entries(attributes())) {
      if (skip(name)) {
        continue
      }
      if (value !== undefined) {
        el.setAttribute(name, value)
        written.add(name)
      } else if (written.delete(name)) {
        el.removeAttribute(name)
      }
    }
  })
}

export { bindAttributes, moveAttributes, useBlank, useText }
