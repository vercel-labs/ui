import "@ui-sdk/web/popover"

const dimensions = [
  { label: "Width", value: "100%" },
  { label: "Max. width", value: "300px" },
  { label: "Height", value: "25px" },
  { label: "Max. height", value: "none" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-popover presentation="sheet">
      <ui-popover-trigger><button>Dimensions</button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title>Dimensions</ui-popover-title>
        <ui-popover-description>Set the dimensions for the layer.</ui-popover-description>
        <div data-slot="stack">
          ${dimensions
            .map(
              (dimension) => `
          <label data-slot="label">
            ${dimension.label}
            <input value="${dimension.value}" />
          </label>`,
            )
            .join("")}
        </div>
      </ui-popover-content>
    </ui-popover>
  `
}

export { mount }
