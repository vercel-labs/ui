import "@ui-sdk/web/drawer"
import { sheetPhysics, type SheetPhysics } from "@ui-sdk/web"

const presets: { label: string; physics: Partial<SheetPhysics> }[] = [
  { label: "iOS", physics: sheetPhysics.ios },
  { label: "Bouncy", physics: { dampingRatio: 0.6, momentumDampingRatio: 0.5 } },
  { label: "Slow", physics: { response: 0.7 } },
  { label: "Loose", physics: { rubberBand: 0.6, rubberBandDimension: null } },
]

let count = 0

function mount(root: HTMLElement) {
  const name = `drawer-physics-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <fieldset data-slot="row">
        <legend>physics</legend>
        ${presets.map((preset, index) => `<label data-slot="label"><input type="radio" name="${name}" value="${index}" ${index === 1 ? "checked" : ""} />${preset.label}</label>`).join("")}
      </fieldset>
      <ui-drawer snap-points="0.4,1" driver="pointer">
        <ui-drawer-trigger><button>Try the physics</button></ui-drawer-trigger>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <ui-drawer-handle><button aria-label="Resize"></button></ui-drawer-handle>
          <div data-slot="stack">
            <ui-drawer-title></ui-drawer-title>
            <ui-drawer-description>Fling it up and down, and pull it past the top.</ui-drawer-description>
          </div>
          <pre data-slot="log"></pre>
        </ui-drawer-content>
      </ui-drawer>
    </div>
  `
  const drawer = root.querySelector<HTMLElement & { physics?: Partial<SheetPhysics> }>("ui-drawer")!
  const select = (preset: (typeof presets)[number]) => {
    drawer.physics = preset.physics
    root.querySelector("ui-drawer-title")!.textContent = preset.label
    root.querySelector("pre")!.textContent = JSON.stringify(
      { ...sheetPhysics.ios, ...preset.physics },
      null,
      2,
    )
  }
  for (const radio of root.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
    radio.addEventListener("change", () => select(presets[Number(radio.value)]))
  select(presets[1])
}

export { mount }
