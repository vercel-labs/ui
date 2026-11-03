import "@ui-sdk/web/listbox"
import { createElement, ExternalLink } from "lucide"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-listbox default-value="next" activation="manual" aria-label="Framework docs">
      ${frameworks
        .map(
          (framework) => `
            <ui-listbox-item value="${framework.value}" label="${framework.label}" as-child>
              <a href="#${framework.value}">
                ${framework.label}
                ${createElement(ExternalLink, { "aria-hidden": "true" }).outerHTML}
              </a>
            </ui-listbox-item>`,
        )
        .join("")}
    </ui-listbox>
  `
}

export { mount }
