import "@ui-sdk/web/listbox"
import { createElement, File } from "lucide"

const files = [
  { value: "readme", label: "README.md" },
  { value: "package", label: "package.json" },
  { value: "tsconfig", label: "tsconfig.json" },
  { value: "index", label: "index.ts" },
  { value: "styles", label: "styles.css" },
  { value: "logo", label: "logo.svg" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-listbox multiple activation="automatic" default-value="readme" aria-label="Files">
        ${files
          .map(
            (file) => `
              <ui-listbox-item value="${file.value}">
                <ui-listbox-item-icon>${createElement(File, { "aria-hidden": "true" }).outerHTML}</ui-listbox-item-icon>
                ${file.label}
              </ui-listbox-item>`,
          )
          .join("")}
      </ui-listbox>
      <output data-slot="output">1 selected</output>
    </div>
  `
  const output = root.querySelector("output")!
  root.querySelector("ui-listbox")!.addEventListener("valuechange", (event) => {
    output.textContent = `${(event.detail.value as string[]).length} selected`
  })
}

export { mount }
