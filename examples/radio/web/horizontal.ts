import "@ui-sdk/web/radio"

const sizes = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <span id="size-heading">Size</span>
      <ui-radio-group data-variant="segmented" default-value="m" aria-labelledby="size-heading">
        ${sizes
          .map(
            (size) => `
              <ui-radio value="${size.value}">${size.label}</ui-radio>`,
          )
          .join("")}
      </ui-radio-group>
    </div>
  `
}
