import "@ui-sdk/web/listbox"
import { Check, createElement } from "lucide"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-listbox activation="manual" aria-label="Framework">
        ${frameworks
          .map(
            (framework) => `
              <ui-listbox-item value="${framework.value}">
                ${framework.label}
                <ui-listbox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-listbox-item-indicator>
              </ui-listbox-item>`,
          )
          .join("")}
      </ui-listbox>
      <output data-slot="output">Value: none</output>
    </div>
  `
  const output = root.querySelector("output")!
  root.querySelector("ui-listbox")!.addEventListener("valuechange", (event) => {
    output.textContent = `Value: ${event.detail.value ?? "none"}`
  })
}

export { mount }
