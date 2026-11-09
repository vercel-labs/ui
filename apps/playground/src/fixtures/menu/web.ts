import { menuOptions } from "tests/fixtures/page.ts"

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-menu>
      <ui-menu-trigger><button>File</button></ui-menu-trigger>
      <ui-menu-content class="popup">
        <ui-menu-item class="item" value="new" shortcut="mod+n">New file</ui-menu-item>
        <ui-menu-item class="item" value="open" shortcut="mod+o">Open…</ui-menu-item>
        <ui-menu-item class="item" value="save" disabled>Save</ui-menu-item>
        <ui-menu-separator class="separator"></ui-menu-separator>
        <ui-menu-group>
          <ui-menu-group-label class="label">View</ui-menu-group-label>
          <ui-menu-checkbox-item class="item" value="sidebar" default-checked>Show sidebar</ui-menu-checkbox-item>
          <ui-menu-checkbox-item class="item" value="statusbar">Show status bar</ui-menu-checkbox-item>
        </ui-menu-group>
        <ui-menu-separator class="separator"></ui-menu-separator>
        <ui-menu-radio-group default-value="name">
          <ui-menu-group-label class="label">Sort by</ui-menu-group-label>
          <ui-menu-radio-item class="item" value="name">Name</ui-menu-radio-item>
          <ui-menu-radio-item class="item" value="date">Date</ui-menu-radio-item>
          <ui-menu-radio-item class="item" value="size">Size</ui-menu-radio-item>
        </ui-menu-radio-group>
        <ui-menu-separator class="separator"></ui-menu-separator>
        <ui-menu-sub>
          <ui-menu-sub-trigger class="item">Share</ui-menu-sub-trigger>
          <ui-menu-sub-content class="popup">
            <ui-menu-item class="item" value="email">Email</ui-menu-item>
            <ui-menu-item class="item" value="link">Copy link</ui-menu-item>
            <ui-menu-sub>
              <ui-menu-sub-trigger class="item">More</ui-menu-sub-trigger>
              <ui-menu-sub-content class="popup">
                <ui-menu-item class="item" value="embed">Embed</ui-menu-item>
              </ui-menu-sub-content>
            </ui-menu-sub>
          </ui-menu-sub-content>
        </ui-menu-sub>
        <ui-menu-item class="item" value="delete">Delete</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <button id="controller">Open with controller</button>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const menu = root.querySelector<
    HTMLElement & { api?: { open: (options: object) => void } }
  >("ui-menu")!
  const options = menuOptions()
  if (options.defaultOpen) {
    menu.setAttribute("default-open", "")
  }
  if (options.modal !== undefined) {
    menu.setAttribute("modal", String(options.modal))
  }
  if (options.presentation) {
    menu.setAttribute("presentation", options.presentation)
  }
  if (options.container) {
    menu.setAttribute("container", `#${options.container.id}`)
  }
  await import("@ui-sdk/web/menu")
  root
    .querySelector("#controller")!
    .addEventListener("click", () => menu.api?.open({ focus: "first" }))
  root.addEventListener(
    "action",
    (event) => {
      root.querySelector("output")!.textContent = (
        event as CustomEvent<{ value: string }>
      ).detail.value
    },
    { capture: true }
  )
}

export { mount }
