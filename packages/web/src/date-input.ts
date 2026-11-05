import type { PrimitiveInstance } from "@ui-sdk/core"
import { dateInput, type DateInputApi, type DateInputState } from "@ui-sdk/core/date-input"
import { partState } from "@ui-sdk/core/renderer"
import { timeInput } from "@ui-sdk/core/time-input"
import { createParts } from "./define-element"
import { copy } from "./list"

const rendered = new WeakMap<Element, string>()

// The value each element last reported, until the task ends. Frameworks write
// it back within that task, and that write mustn't clear a partly typed date.
const echoes = new WeakMap<DateInputApi, string | null>()

// Made again only when the locale, the clock or the granularity changes the
// segments. Each copies the <template>'s segment, so authors can style them.
function renderSegments(el: HTMLElement, instance: PrimitiveInstance, tag: string) {
  const { segments } = partState(instance.part("root", {})) as DateInputState
  const signature = segments
    .map((segment) => (segment.editable ? segment.key : `${segment.key}:${segment.text}`))
    .join("|")
  if (rendered.get(el) === signature) return
  rendered.set(el, signature)
  const template = el.querySelector<HTMLTemplateElement>(":scope > template")
  for (const child of Array.from(el.querySelectorAll(`:scope > ${tag}-segment`))) child.remove()
  for (const segment of segments) {
    const part = copy(template, `${tag}-segment`)
    part.setAttribute("segment", segment.key)
    if (!segment.editable) part.textContent = segment.text
    else if (!part.querySelector("input")) part.append(document.createElement("input"))
    el.append(part)
  }
}

function defineSegmented(primitive: typeof dateInput, tag: string, dates: boolean) {
  createParts(primitive, {
    root: {
      tag,
      display: "block",
      formAssociated: true,
      // `unavailable` as a property takes any matcher, like `{ weekday: [0, 6] }`.
      properties: dates ? ["unavailable"] : [],
      state: {
        value: {
          get: (api: DateInputApi) => api.getValue(),
          set: (api: DateInputApi, value: string | null) => {
            const next = value || null
            if (!echoes.has(api) || echoes.get(api) !== next) api.setValue(next)
          },
        },
      },
      api: ["getValue", "setValue", "clear", "focus"],
      render(el, instance) {
        const api = instance.api as DateInputApi
        let last = api.getValue()
        const update = () => {
          renderSegments(el, instance, tag)
          const value = api.getValue()
          if (value === last) return
          last = value
          echoes.set(api, value)
          setTimeout(() => echoes.get(api) === value && echoes.delete(api))
        }
        update()
        return instance.subscribe(update)
      },
    },
    segment: {
      tag: `${tag}-segment`,
      // A segment you type in binds its <input>; the text between segments is the element itself.
      target: (el) => el.querySelector("input") ?? el,
      context: (el) => {
        const key = el.getAttribute("segment") ?? ""
        return { segment: { key }, id: key }
      },
      rebind: ["segment"],
    },
  })
}

// <ui-date-input> is form-associated, so it submits the ISO value under its
// name with no hidden input.
function defineDateInputElements() {
  defineSegmented(dateInput, "ui-date-input", true)
}

function defineTimeInputElements() {
  defineSegmented(timeInput as unknown as typeof dateInput, "ui-time-input", false)
}

export { defineDateInputElements, defineTimeInputElements }
