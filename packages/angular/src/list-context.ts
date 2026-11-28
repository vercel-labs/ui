import {
  afterNextRender,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
} from "@angular/core"
import type { ListData, ListItem } from "@ui-sdk/core"

// A data entry in one shape, for a template to switch on: a plain string
// becomes an item, and every item says it's one.
function listEntry<T, Item extends ListItem<T>>(
  entry: ListData<T, Item>[number]
) {
  if (typeof entry === "string") {
    const item: ListItem<unknown> = { value: entry, label: entry }
    return { type: "item" as const, ...(item as Item) }
  }
  return "type" in entry ? entry : { type: "item" as const, ...entry }
}

// An item's text, with what a search matched in `<mark>`. `text` is the
// element's own text once it's in the page. `show` puts a marked copy in its
// place while a match shows, and always in an element left empty.
function useMarkedText() {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  const text = signal<string | undefined>(undefined)
  let blank: boolean | undefined
  let own: Node[] | undefined
  const destroyed = inject(DestroyRef)
  const write = (nodes: Node[]) => {
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
    nodes.forEach((node) => el.appendChild(node))
  }
  afterNextRender(() => {
    if (blank) {
      return
    }
    const read = () => {
      if (own) {
        return
      }
      const plain = !el.querySelector("*")
      text.set(
        plain ? (el.textContent ?? "").replace(/\s+/g, " ").trim() : undefined
      )
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(el, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    destroyed.onDestroy(() => observer.disconnect())
  })
  const show = (
    segments: () => readonly { text: string; match: boolean }[]
  ) => {
    effect(() => {
      const parts = segments()
      if (blank === undefined) {
        blank = el.hasAttribute("data-text") || !el.childNodes.length
        if (blank) {
          el.setAttribute("data-text", "")
        }
      }
      const searching = text() !== undefined && parts.some((part) => part.match)
      if (blank || searching) {
        own ??= [...el.childNodes]
        write(
          parts.map((part) => {
            if (!part.match) {
              return el.ownerDocument.createTextNode(part.text)
            }
            const mark = el.ownerDocument.createElement("mark")
            mark.textContent = part.text
            return mark
          })
        )
      } else if (own) {
        write(own)
        own = undefined
      }
    })
  }
  return { show, text: text.asReadonly() }
}

// An empty message's content waits outside the page while there's something
// to show, which core does once the part binds. Until then, like in the
// server's HTML, the element is hidden instead.
function useEmptyMessage(empty: () => boolean) {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  let bound = false
  effect(() => {
    if (!bound) {
      el.toggleAttribute("hidden", !empty())
    }
  })
  afterNextRender(() => {
    bound = true
    el.removeAttribute("hidden")
  })
}

export { listEntry, useEmptyMessage, useMarkedText }
