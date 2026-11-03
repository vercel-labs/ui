import "@ui-sdk/web/drawer"
import type { SnapPoint } from "@ui-sdk/web"

type DrawerElement = HTMLElement & { snapPoint: SnapPoint | null }

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-drawer snap-points="0.5,1">
      <ui-drawer-trigger shortcut="mod+j">
        <button>
          <span>View details</span><span>Viewing</span>
          <ui-drawer-shortcut></ui-drawer-shortcut>
        </button>
      </ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <ui-drawer-handle><button aria-label="Resize"></button></ui-drawer-handle>
        <div data-slot="stack">
          <ui-drawer-title as-child><h3>Details</h3></ui-drawer-title>
          <ui-drawer-description></ui-drawer-description>
        </div>
        <div data-slot="stack">
          <ui-drawer-close><a data-variant="solid" href="https://example.com/details">Open the full page</a></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `
  const drawer = root.querySelector<DrawerElement>("ui-drawer")!
  const content = root.querySelector<HTMLElement>("ui-drawer-content")!
  const description = root.querySelector("ui-drawer-description")!
  const describe = () => {
    if (drawer.snapPoint === null) return
    description.textContent = content.hasAttribute("data-dragging")
      ? "Dragging."
      : content.hasAttribute("data-expanded")
        ? "Expanded to its largest snap point."
        : `Resting at ${drawer.snapPoint}, from the ${content.dataset.side}.`
  }
  new MutationObserver(describe).observe(content, {
    attributes: true,
    attributeFilter: ["data-dragging", "data-expanded", "data-snap-point", "data-side"],
  })
}
