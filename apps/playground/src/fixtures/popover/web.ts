import {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
  recordPopover,
} from "tests/fixtures/popover.ts"

const parts = popoverParts()

const nested = `
  <ui-popover>
    <ui-popover-trigger><button>${popoverFixture.nested.trigger}</button></ui-popover-trigger>
    <ui-popover-content class="popup">
      <ui-popover-title class="title">${popoverFixture.nested.title}</ui-popover-title>
      <button id="archive">${popoverFixture.nested.action}</button>
    </ui-popover-content>
  </ui-popover>
`

const menu = `
  <ui-menu>
    <ui-menu-trigger><button>${popoverFixture.menu.trigger}</button></ui-menu-trigger>
    <ui-menu-content class="popup">
      ${popoverFixture.menu.items.map((item) => `<ui-menu-item class="item" value="${item.value}">${item.label}</ui-menu-item>`).join("")}
    </ui-menu-content>
  </ui-menu>
`

const { shortcut } = popoverFixture

const remoteTrigger = `
  <ui-popover-trigger for="fixture-popover" shortcut="${shortcut.remote.keys}">
    <button>${shortcut.remote.trigger} <ui-popover-shortcut></ui-popover-shortcut></button>
  </ui-popover-trigger>
`

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-popover id="fixture-popover">
      <ui-popover-trigger ${parts.shortcut ? `shortcut="${shortcut.trigger}"` : ""}>
        <button>${popoverFixture.trigger}${parts.shortcut ? " <ui-popover-shortcut></ui-popover-shortcut>" : ""}</button>
      </ui-popover-trigger>
      <ui-popover-content class="popup" side-offset="8">
        <ui-popover-arrow class="arrow"></ui-popover-arrow>
        ${parts.title ? `<ui-popover-title class="title">${popoverFixture.title}</ui-popover-title>` : ""}
        <ui-popover-description class="description">${popoverFixture.description}</ui-popover-description>
        <label class="field">
          ${popoverFixture.field}
          <input value="${popoverFixture.defaultValue}" />
        </label>
        <div class="actions">
          <button id="save">${popoverFixture.action}${parts.shortcut ? ` <ui-popover-shortcut shortcut="${shortcut.save}"></ui-popover-shortcut>` : ""}</button>
          <ui-popover-close><button>${popoverFixture.close}</button></ui-popover-close>
          ${parts.removable ? `<button id="remove">${popoverFixture.remove}</button>` : ""}
        </div>
        ${parts.nested ? nested : ""}
        ${parts.menu ? menu : ""}
      </ui-popover-content>
    </ui-popover>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <button id="controller">Open with controller</button>
    ${parts.shortcut ? remoteTrigger : ""}
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const popover = root.querySelector<
    HTMLElement & { api?: { open: () => void } }
  >(".fixture > ui-popover")!
  const content = popover.querySelector("ui-popover-content")!
  const options = popoverOptions()
  if (options.defaultOpen) {
    popover.setAttribute("default-open", "")
  }
  if (options.modal !== undefined) {
    popover.setAttribute("modal", String(options.modal))
  }
  if (options.openOnHover) {
    popover.setAttribute("open-on-hover", "")
  }
  if (options.delay !== undefined) {
    popover.setAttribute("delay", String(options.delay))
  }
  if (options.closeDelay !== undefined) {
    popover.setAttribute("close-delay", String(options.closeDelay))
  }
  if (options.presentation) {
    popover.setAttribute("presentation", options.presentation)
  }
  if (options.dismissible === false) {
    popover.setAttribute("dismissible", "false")
    popover.addEventListener("dismissattempt", (event) =>
      recordPopover(
        `attempt:${(event as CustomEvent<{ reason: string }>).detail.reason}`
      )
    )
  }
  if (options.container) {
    popover.setAttribute("container", `#${options.container.id}`)
    popover
      .querySelector("ui-menu")
      ?.setAttribute("container", `#${options.container.id}`)
  }
  for (const [name, value] of Object.entries(popoverContentOptions())) {
    content.setAttribute(
      name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
      value
    )
  }
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/menu")
  root
    .querySelector("#remove")
    ?.addEventListener("click", () =>
      root.querySelector("ui-popover-trigger")?.remove()
    )
  popover.querySelector("ui-menu")?.addEventListener("action", (event) => {
    root.querySelector("output")!.textContent = (
      event as CustomEvent<{ value: string }>
    ).detail.value
  })
  root
    .querySelector("#controller")!
    .addEventListener("click", () => popover.api?.open())
  for (const action of ["save", "archive"]) {
    root.querySelector(`#${action}`)?.addEventListener("click", () => {
      root.querySelector("output")!.textContent = action
    })
  }
}

export { mount }
