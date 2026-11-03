import "@ui-sdk/web/tooltip"

const sides = [
  { side: "left", label: "Left" },
  { side: "top", label: "Top" },
  { side: "bottom", label: "Bottom" },
  { side: "right", label: "Right" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${sides
        .map(
          ({ side, label }) => `
        <ui-tooltip>
          <ui-tooltip-trigger><button>${label}</button></ui-tooltip-trigger>
          <ui-tooltip-content side="${side}">Add to library</ui-tooltip-content>
        </ui-tooltip>`,
        )
        .join("")}
    </div>
  `
}

export { mount }
