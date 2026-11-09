import { exposeLayers, leakComponent, perfItems } from "tests/fixtures/perf.ts"

// One component for the leak specs, picked with ?component=, and a button
// that mounts and unmounts it. Each mount inserts new elements. The scroll
// area hides its scrollbars soon after the pointer leaves, so the spec sees
// them show and hide without waiting long.
const items = perfItems(3)
const list = (tag: string) =>
  items
    .map(
      (item) =>
        `<${tag} class="item" value="${item.value}" label="${item.label}">${item.label}</${tag}>`
    )
    .join("")
const each = (
  render: (item: { value: string; label: string }) => string,
  from = items
) => from.map(render).join("")

const components = {
  menu: `
    <ui-menu>
      <ui-menu-trigger><button>Open</button></ui-menu-trigger>
      <ui-menu-content class="popup">${list("ui-menu-item")}</ui-menu-content>
    </ui-menu>`,
  select: `
    <ui-select default-value="${items[0].value}">
      <ui-select-trigger><button class="trigger" aria-label="Open"><ui-select-value></ui-select-value></button></ui-select-trigger>
      <ui-select-content class="popup list-popup">${list("ui-select-item")}</ui-select-content>
    </ui-select>`,
  combobox: `
    <ui-combobox>
      <ui-combobox-input><input class="input" aria-label="Open" /></ui-combobox-input>
      <ui-combobox-content class="popup list-popup">
        <ui-combobox-list>${list("ui-combobox-item")}</ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>`,
  popover: `
    <ui-popover>
      <ui-popover-trigger><button>Open</button></ui-popover-trigger>
      <ui-popover-content class="popup" aria-label="Details">
        Details.
        <ui-popover-close><button>Close</button></ui-popover-close>
      </ui-popover-content>
    </ui-popover>`,
  dialog: `
    <ui-dialog>
      <ui-dialog-trigger><button>Open</button></ui-dialog-trigger>
      <ui-dialog-content class="dialog">
        <ui-dialog-title class="title">Delete it?</ui-dialog-title>
        <ui-dialog-description class="description">This can't be undone.</ui-dialog-description>
        <ui-dialog-close><button>Cancel</button></ui-dialog-close>
      </ui-dialog-content>
    </ui-dialog>`,
  tooltip: `
    <ui-tooltip>
      <ui-tooltip-trigger><button>Open</button></ui-tooltip-trigger>
      <ui-tooltip-content class="tooltip">A hint.</ui-tooltip-content>
    </ui-tooltip>`,
  slider: `
    <ui-slider name="volume" default-value="50">
      <ui-slider-control class="slider-control">
        <ui-slider-track class="slider-track">
          <ui-slider-indicator class="slider-indicator"></ui-slider-indicator>
          <ui-slider-thumb class="slider-thumb" aria-label="Volume"></ui-slider-thumb>
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>`,
  accordion: `
    <ui-accordion>
      <ui-accordion-item value="first">
        <ui-accordion-header>
          <h3><ui-accordion-trigger><button class="accordion-trigger">Open</button></ui-accordion-trigger></h3>
        </ui-accordion-header>
        <ui-accordion-panel class="accordion-panel">An answer.</ui-accordion-panel>
      </ui-accordion-item>
      <ui-accordion-item value="second">
        <ui-accordion-header>
          <h3><ui-accordion-trigger><button class="accordion-trigger">Second</button></ui-accordion-trigger></h3>
        </ui-accordion-header>
        <ui-accordion-panel class="accordion-panel">Another answer.</ui-accordion-panel>
      </ui-accordion-item>
    </ui-accordion>`,
  collapsible: `
    <ui-collapsible>
      <ui-collapsible-trigger><button>Open</button></ui-collapsible-trigger>
      <ui-collapsible-panel class="collapsible-panel">Details.</ui-collapsible-panel>
    </ui-collapsible>`,
  tabs: `
    <ui-tabs class="tabs" default-value="${items[0].value}">
      <ui-tabs-list class="tablist" aria-label="Pages">
        ${each((item) => `<ui-tabs-tab value="${item.value}"><button class="tab">${item.label}</button></ui-tabs-tab>`)}
        <ui-tabs-indicator class="indicator"></ui-tabs-indicator>
      </ui-tabs-list>
      ${each((item) => `<ui-tabs-panel class="panel" value="${item.value}">${item.label} content.</ui-tabs-panel>`)}
    </ui-tabs>`,
  toolbar: `
    <ui-toolbar class="toolbar" aria-label="Formatting">
      ${each((item) => `<ui-toolbar-button><button>${item.label}</button></ui-toolbar-button>`)}
    </ui-toolbar>`,
  tree: `
    <ui-tree class="tree" aria-label="Files">
      ${each(
        (item) => `
          <ui-tree-item value="${item.value}">
            <ui-tree-item-label>${item.label}</ui-tree-item-label>
            <ui-tree-group>
              <ui-tree-item value="${item.value}-file"><ui-tree-item-label>${item.label} file</ui-tree-item-label></ui-tree-item>
            </ui-tree-group>
          </ui-tree-item>`
      )}
    </ui-tree>`,
  resizable: `
    <ui-resizable class="resizable">
      <ui-resizable-panel id="first" default-size="50" class="resizable-panel"></ui-resizable-panel>
      <ui-resizable-handle class="resizable-handle" aria-label="Handle"></ui-resizable-handle>
      <ui-resizable-panel id="second" default-size="50" class="resizable-panel"></ui-resizable-panel>
    </ui-resizable>`,
  "scroll-area": `
    <ui-scroll-area class="scroll-area" scroll-hide-delay="50">
      <ui-scroll-area-viewport class="scroll-area-viewport" role="region" aria-label="Items">
        <ui-scroll-area-content>
          ${each((line) => `<p class="scroll-area-item">${line.label}</p>`, perfItems(30))}
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <ui-scroll-area-scrollbar class="scroll-area-scrollbar">
        <ui-scroll-area-thumb class="scroll-area-thumb"></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
    </ui-scroll-area>`,
}

async function mount(root: HTMLElement) {
  exposeLayers()
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <div class="slot" style="display: contents"></div>
      <button>Toggle</button>
    </div>
  `
  const slot = root.querySelector<HTMLElement>(".slot")!
  const markup = components[leakComponent()]
  const insert = () => (slot.innerHTML = markup)
  insert()
  root
    .querySelector(".fixture > button:last-child")!
    .addEventListener("click", () => {
      if (slot.firstElementChild) {
        slot.replaceChildren()
      } else {
        insert()
      }
    })
  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/select")
  await import("@ui-sdk/web/combobox")
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/tooltip")
  await import("@ui-sdk/web/slider")
  await import("@ui-sdk/web/accordion")
  await import("@ui-sdk/web/collapsible")
  await import("@ui-sdk/web/tree")
  await import("@ui-sdk/web/tabs")
  await import("@ui-sdk/web/toolbar")
  await import("@ui-sdk/web/resizable")
  await import("@ui-sdk/web/scroll-area")
}

export { mount }
