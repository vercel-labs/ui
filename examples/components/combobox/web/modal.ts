import "@ui-sdk/web/combobox"
import { Check, ChevronDown, createElement } from "lucide"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "solidstart", label: "SolidStart" },
  { value: "qwik", label: "Qwik City" },
]

const modes = [
  { value: "false", label: "Non-modal" },
  { value: "pointer", label: "Pointer" },
  { value: "true", label: "Modal" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div role="group" aria-label="Modal" data-slot="row">
        ${modes
          .map(
            (mode) => `
              <button type="button" data-mode="${mode.value}" aria-pressed="${mode.value === "false"}">
                ${mode.label}
              </button>
            `,
          )
          .join("")}
      </div>
      <ui-combobox modal="false">
        <div data-slot="stack">
          <ui-combobox-label>Framework</ui-combobox-label>
          <div data-slot="row">
            <ui-combobox-input>
              <input placeholder="Select a framework" />
            </ui-combobox-input>
            <ui-combobox-trigger>
              <button aria-label="Show frameworks">${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}</button>
            </ui-combobox-trigger>
          </div>
        </div>
        <ui-combobox-content>
          <ui-combobox-empty>No frameworks found.</ui-combobox-empty>
          <ui-combobox-list>
            ${frameworks
              .map(
                (framework) => `
                  <ui-combobox-item value="${framework.value}" label="${framework.label}">
                    ${framework.label}
                    <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                  </ui-combobox-item>
                `,
              )
              .join("")}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
      <button type="button" data-press>Pressed 0 times</button>
    </div>
  `
  const combobox = root.querySelector("ui-combobox")!
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-mode]")
  for (const button of buttons)
    button.addEventListener("click", () => {
      combobox.setAttribute("modal", button.dataset.mode!)
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
    })
  let presses = 0
  const press = root.querySelector<HTMLButtonElement>("[data-press]")!
  press.addEventListener("click", () => (press.textContent = `Pressed ${++presses} times`))
}
