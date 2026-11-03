import "@ui-sdk/web/popover"

const aligns = ["start", "center", "end"]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${aligns
        .map(
          (align) => `
      <ui-popover>
        <ui-popover-trigger><button>Align ${align}</button></ui-popover-trigger>
        <ui-popover-content align="${align}">
          <ui-popover-title>Aligned to the ${align}</ui-popover-title>
          <ui-popover-description>The popover lines up with the trigger's ${align}.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>`,
        )
        .join("")}
    </div>
  `
}
