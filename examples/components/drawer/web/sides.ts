import "@ui-sdk/web/drawer"

const sides = [
  { side: "top", label: "Top" },
  { side: "right", label: "Right" },
  { side: "bottom", label: "Bottom" },
  { side: "left", label: "Left" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${sides
        .map(
          ({
            side,
            label,
          }) => `<ui-drawer side="${side}" ${side === "left" || side === "right" ? "prevent-edge-swipe" : ""}>
            <ui-drawer-trigger><button>${label}</button></ui-drawer-trigger>
            <ui-drawer-backdrop></ui-drawer-backdrop>
            <ui-drawer-content>
              <div data-slot="stack">
                <ui-drawer-title>Drawer from the ${side}</ui-drawer-title>
                <ui-drawer-description>Drag it back toward its edge, press outside it or press Escape to close it.</ui-drawer-description>
              </div>
              <ui-drawer-close><button data-variant="solid">Close</button></ui-drawer-close>
            </ui-drawer-content>
          </ui-drawer>`,
        )
        .join("")}
    </div>
  `
}

export { mount }
