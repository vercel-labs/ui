import {
  tooltipContentOptions,
  tooltipFixture,
  tooltipOptions,
  tooltipParts,
} from "tests/fixtures/tooltip.ts"

const { save, toolbar, profile, info, publish, iconPopover } = tooltipFixture
const parts = tooltipParts()

const markup = `
  <div class="fixture tooltip-page">
    <button>Before</button>
    <ui-tooltip id="save" shortcut="${save.shortcut}">
      <ui-tooltip-trigger><button id="save-button">${save.trigger}</button></ui-tooltip-trigger>
      <ui-tooltip-content class="tooltip">
        <ui-tooltip-arrow class="arrow"></ui-tooltip-arrow>
        ${save.content}
        <ui-tooltip-shortcut></ui-tooltip-shortcut>
      </ui-tooltip-content>
    </ui-tooltip>
    <div class="toolbar" role="group" aria-label="Formatting">
      ${toolbar
        .map(
          (item) => `
        <ui-tooltip>
          <ui-tooltip-trigger><button><span aria-hidden="true">${item.icon}</span></button></ui-tooltip-trigger>
          <ui-tooltip-content class="tooltip">${item.content}</ui-tooltip-content>
        </ui-tooltip>`
        )
        .join("")}
    </div>
    <ui-popover>
      <ui-tooltip>
        <ui-tooltip-trigger>
          <ui-popover-trigger><button>${profile.trigger}</button></ui-popover-trigger>
        </ui-tooltip-trigger>
        <ui-tooltip-content class="tooltip">${profile.content}</ui-tooltip-content>
      </ui-tooltip>
      <ui-popover-content class="popup" side-offset="8">
        <ui-popover-title class="title">${profile.popover}</ui-popover-title>
        <div class="actions">
          <ui-tooltip>
            <ui-tooltip-trigger><button>${profile.help.trigger}</button></ui-tooltip-trigger>
            <ui-tooltip-content class="tooltip">${profile.help.content}</ui-tooltip-content>
          </ui-tooltip>
          <ui-popover-close><button>${profile.close}</button></ui-popover-close>
        </div>
      </ui-popover-content>
    </ui-popover>
    <ui-tooltip toggleable>
      <ui-tooltip-trigger><button aria-label="${info.trigger}"><span aria-hidden="true">i</span></button></ui-tooltip-trigger>
      <ui-tooltip-content class="tooltip">${info.content}</ui-tooltip-content>
    </ui-tooltip>
    ${
      parts.disabled
        ? `<ui-tooltip>
      <ui-tooltip-trigger><button id="publish" aria-disabled="true">${publish.trigger}</button></ui-tooltip-trigger>
      <ui-tooltip-content class="tooltip">${publish.content}</ui-tooltip-content>
    </ui-tooltip>`
        : ""
    }
    ${
      parts.iconPopover
        ? `<ui-popover>
      <ui-tooltip>
        <ui-tooltip-trigger>
          <ui-popover-trigger><button><span aria-hidden="true">${iconPopover.icon}</span></button></ui-popover-trigger>
        </ui-tooltip-trigger>
        <ui-tooltip-content class="tooltip">${iconPopover.content}</ui-tooltip-content>
      </ui-tooltip>
      <ui-popover-content class="popup">${iconPopover.popover}</ui-popover-content>
    </ui-popover>
    <ui-popover>
      <ui-popover-trigger><button><span aria-hidden="true">${iconPopover.unnamed}</span></button></ui-popover-trigger>
      <ui-popover-content class="popup">${iconPopover.popover}</ui-popover-content>
    </ui-popover>`
        : ""
    }
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <button id="controller">Open with controller</button>
    ${
      parts.shortcut
        ? `<ui-tooltip-trigger for="save">
      <button>${tooltipFixture.shortcut.trigger} <ui-tooltip-shortcut></ui-tooltip-shortcut></button>
    </ui-tooltip-trigger>`
        : ""
    }
  </div>
`

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

async function mount(root: HTMLElement) {
  // Defined before the markup goes in, so nested triggers upgrade inner first,
  // the order that once let one component's attributes wipe the other's.
  await import("@ui-sdk/web/tooltip")
  await import("@ui-sdk/web/popover")
  root.innerHTML = markup
  const options = tooltipOptions()
  for (const tooltip of root.querySelectorAll("ui-tooltip")) {
    for (const [name, value] of Object.entries(options)) {
      if (name === "container") {
        tooltip.setAttribute("container", `#${(value as HTMLElement).id}`)
      } else {
        tooltip.setAttribute(kebab(name), String(value))
      }
    }
  }
  if (options.container) {
    root
      .querySelector("ui-popover")!
      .setAttribute("container", `#${options.container.id}`)
  }
  const saveTooltip = root.querySelector<
    HTMLElement & { api?: { open: () => void } }
  >("#save")!
  if (parts.open) {
    saveTooltip.setAttribute("default-open", "")
  }
  if (parts.nativeDisabled) {
    root.querySelector("#save-button")!.setAttribute("disabled", "")
  }
  for (const [name, value] of Object.entries(tooltipContentOptions())) {
    saveTooltip.querySelector("ui-tooltip-content")!.setAttribute(name, value)
  }
  const output = root.querySelector("output")!
  root
    .querySelector("#save-button")!
    .addEventListener("click", () => (output.textContent = "save"))
  root.querySelector("#publish")?.addEventListener("click", (event) => {
    if (
      (event.currentTarget as HTMLElement).getAttribute("aria-disabled") !==
      "true"
    ) {
      output.textContent = publish.action
    }
  })
  root
    .querySelector("#controller")!
    .addEventListener("click", () => saveTooltip.api?.open())
}

export { mount }
