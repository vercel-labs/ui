import "@ui-sdk/web/combobox"
import { Check, createElement } from "lucide"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "solidstart", label: "SolidStart" },
  { value: "qwik", label: "Qwik City" },
]

const sides = ["top", "right", "bottom", "left"]
const aligns = ["start", "center", "end"]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <div role="group" aria-label="Side" data-slot="row">
          ${sides
            .map(
              (value) => `
                <button type="button" data-side="${value}" aria-pressed="${value === "bottom"}">
                  ${value}
                </button>
              `,
            )
            .join("")}
        </div>
        <div role="group" aria-label="Align" data-slot="row">
          ${aligns
            .map(
              (value) => `
                <button type="button" data-align="${value}" aria-pressed="${value === "start"}">
                  ${value}
                </button>
              `,
            )
            .join("")}
        </div>
        <label data-slot="label">
          <input type="checkbox" />
          Anchor to the box
        </label>
      </div>
      <div id="combobox-positioning-box" data-slot="card">
        <ui-combobox>
          <ui-combobox-input>
            <input aria-label="Framework" placeholder="Framework" />
          </ui-combobox-input>
          <ui-combobox-content side="bottom" align="start" side-offset="10" align-offset="0" collision-padding="16">
            <ui-combobox-arrow></ui-combobox-arrow>
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
      </div>
    </div>
  `
  const content = root.querySelector("ui-combobox-content")!
  for (const name of ["side", "align"]) {
    const buttons = root.querySelectorAll<HTMLButtonElement>(`[data-${name}]`)
    for (const button of buttons)
      button.addEventListener("click", () => {
        content.setAttribute(name, button.getAttribute(`data-${name}`)!)
        for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
      })
  }
  const anchored = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!
  anchored.addEventListener("change", () => {
    if (anchored.checked) content.setAttribute("anchor", "#combobox-positioning-box")
    else content.removeAttribute("anchor")
  })
}
