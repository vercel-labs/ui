import { menubarFixture as f, menubarOptions } from "tests/fixtures/menubar.ts"

const items = (
  list: {
    value: string
    label: string
    disabled?: boolean
    shortcut?: string
  }[]
) =>
  list
    .map(
      (item) =>
        `<ui-menu-item class="item" value="${item.value}" ${item.disabled ? "disabled" : ""} ${item.shortcut ? `shortcut="${item.shortcut}"` : ""}>${item.label}</ui-menu-item>`
    )
    .join("")

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-menubar class="menubar" aria-label="${f.label}">
      <ui-menu>
        <ui-menu-trigger><button>${f.file.trigger}</button></ui-menu-trigger>
        <ui-menu-content class="popup">
          ${items(f.file.items)}
          <ui-menu-sub>
            <ui-menu-sub-trigger class="item">${f.file.share.trigger}</ui-menu-sub-trigger>
            <ui-menu-sub-content class="popup">${items(f.file.share.items)}</ui-menu-sub-content>
          </ui-menu-sub>
          <ui-menu-separator class="separator"></ui-menu-separator>
          ${items([f.file.print])}
        </ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger><button>${f.edit.trigger}</button></ui-menu-trigger>
        <ui-menu-content class="popup">${items(f.edit.items)}</ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger shortcut="${f.view.shortcut}"><button>${f.view.trigger}</button></ui-menu-trigger>
        <ui-menu-content class="popup">
          ${f.view.checkboxes
            .map(
              (item) =>
                `<ui-menu-checkbox-item class="item" value="${item.value}" ${item.defaultChecked ? "default-checked" : ""}>${item.label}</ui-menu-checkbox-item>`
            )
            .join("")}
        </ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger><button>${f.profiles.trigger}</button></ui-menu-trigger>
        <ui-menu-content class="popup">
          <ui-menu-radio-group default-value="${f.profiles.defaultValue}">
            ${f.profiles.items.map((item) => `<ui-menu-radio-item class="item" value="${item.value}">${item.label}</ui-menu-radio-item>`).join("")}
          </ui-menu-radio-group>
        </ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger disabled><button>${f.help.trigger}</button></ui-menu-trigger>
        <ui-menu-content class="popup">${items(f.help.items)}</ui-menu-content>
      </ui-menu>
    </ui-menubar>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const menubar = root.querySelector("ui-menubar")!
  const options = menubarOptions()
  if (options.orientation) {
    menubar.setAttribute("orientation", options.orientation)
  }
  if (options.loop === false) {
    menubar.setAttribute("loop", "false")
  }
  if (options.disabled) {
    menubar.setAttribute("disabled", "")
  }
  if (options.modal !== undefined) {
    menubar.setAttribute("modal", String(options.modal))
  }
  // The menubar first, so menus find it as they upgrade. With ?menus-first,
  // the menus upgrade and bind first, like a menubar loaded later, and join
  // the menubar once it upgrades.
  if (new URLSearchParams(location.search).has("menus-first")) {
    await import("@ui-sdk/web/menu")
    setTimeout(() => import("@ui-sdk/web/menubar"))
  } else {
    await import("@ui-sdk/web/menubar")
    await import("@ui-sdk/web/menu")
  }
  ;(window as unknown as { __menubar: unknown }).__menubar = menubar.api
  const output = root.querySelector("output")!
  root.addEventListener(
    "action",
    (event) => {
      output.textContent = (
        event as CustomEvent<{ value: string }>
      ).detail.value
    },
    { capture: true }
  )
  root.addEventListener(
    "checkedchange",
    (event) => {
      const value = (event.target as HTMLElement).getAttribute("value")
      if ((event.target as HTMLElement).localName !== "ui-menu-checkbox-item") {
        return
      }
      output.textContent = `${value}: ${(event as CustomEvent<{ value: boolean }>).detail.value ? "on" : "off"}`
    },
    { capture: true }
  )
  root.addEventListener(
    "valuechange",
    (event) => {
      if ((event.target as HTMLElement).localName !== "ui-menu-radio-group") {
        return
      }
      output.textContent = `profile: ${(event as CustomEvent<{ value: string }>).detail.value}`
    },
    { capture: true }
  )
}

export { mount }
