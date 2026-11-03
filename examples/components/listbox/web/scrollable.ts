import "@ui-sdk/web/listbox"
import { Check, createElement } from "lucide"

const timezones = Array.from({ length: 27 }, (_, index) => {
  const offset = index - 12
  const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
  return { value: `utc${offset}`, label }
})

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-listbox default-value="utc9" aria-label="Time zone">
        ${timezones
          .map(
            (zone, index) => `
              <ui-listbox-item value="${zone.value}" index="${index}">
                ${zone.label}
                <ui-listbox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-listbox-item-indicator>
              </ui-listbox-item>`,
          )
          .join("")}
      </ui-listbox>
      <output data-slot="output">Focused: none</output>
    </div>
  `
  const output = root.querySelector("output")!
  root.querySelector("ui-listbox")!.addEventListener("highlight", (event) => {
    output.textContent = `Focused: ${event.detail.value ?? "none"}`
  })
}

export { mount }
