import "@ui-sdk/web/drawer"
import type { SnapPoint } from "@ui-sdk/web/drawer"
import { ArrowDown, ArrowUp, createElement } from "lucide"

const snapPoints: SnapPoint[] = [160, "20rem", 1]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-drawer snap-points="${snapPoints.join(",")}">
      <ui-drawer-trigger><button>Resize with the handle</button></ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <ui-drawer-handle>
          <button aria-label="Resize">
            <span data-slot="grip"></span>
            <span data-slot="row">
              ${createElement(ArrowUp, { "aria-hidden": "true", "data-expand": "" }).outerHTML}
              <span data-snap-point></span>
              ${createElement(ArrowDown, { "aria-hidden": "true", "data-collapse": "" }).outerHTML}
            </span>
          </button>
        </ui-drawer-handle>
        <div data-slot="stack">
          <ui-drawer-title>Handle</ui-drawer-title>
          <ui-drawer-description>Focus the handle with Tab, then use the keys below.</ui-drawer-description>
        </div>
        <dl>
          <dt>Press</dt>
          <dd>The next snap point, then back to the first</dd>
          <dt>↑ ↓</dt>
          <dd>One snap point larger or smaller</dd>
          <dt>Home End</dt>
          <dd>The smallest or the largest</dd>
        </dl>
        <div data-slot="stack">
          <ui-drawer-close><button>Close</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `
  const drawer = root.querySelector("ui-drawer")!
  const expand = root.querySelector<SVGElement>("[data-expand]")!
  const collapse = root.querySelector<SVGElement>("[data-collapse]")!
  const label = root.querySelector<HTMLElement>("[data-snap-point]")!
  const show = () => {
    const index = snapPoints.findIndex((point) => point === drawer.snapPoint)
    label.textContent = String(drawer.snapPoint)
    expand.toggleAttribute("data-disabled", index === snapPoints.length - 1)
    collapse.toggleAttribute("data-disabled", index <= 0)
  }
  drawer.addEventListener("openchange", () => queueMicrotask(show))
  drawer.addEventListener("snappointchange", () => queueMicrotask(show))
}

export { mount }
