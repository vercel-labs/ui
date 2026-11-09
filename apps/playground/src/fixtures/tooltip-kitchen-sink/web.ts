import type { TooltipController } from "@ui-sdk/core/tooltip"
import "@ui-sdk/web/popover"
import "@ui-sdk/web/tooltip"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { rows, toolbar, type Variant } from "./variants"

type TooltipElement = HTMLElement & {
  controller?: TooltipController<string>
  api?: { open: () => void; close: () => void; getPayload: () => unknown }
}

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const attributes = (record: Record<string, unknown>) =>
  Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${kebab(name)}="${value}"`)
    .join(" ")

function rootAttributes(
  variant: Variant,
  env: Env,
  extra: Record<string, unknown> = {}
) {
  return attributes({
    ...variant.options,
    ...(env.container && { container: `#${env.container.id}` }),
    ...extra,
  })
}

function content(
  variant: Variant,
  env: Env,
  text: string,
  shortcut = !!(variant.options?.shortcut || variant.partShortcut)
) {
  const props = attributes({
    sideOffset: 6,
    ...variant.content,
    ...(env.anchor && { anchor: `#${env.anchor.id}` }),
  })
  return `
    <ui-tooltip-content class="${classes.content(variant.animation)}" ${props}>
      ${variant.arrow !== false ? `<ui-tooltip-arrow class="${classes.arrow}"></ui-tooltip-arrow>` : ""}
      <span data-text>${text}</span>
      ${shortcut ? `<ui-tooltip-shortcut class="${classes.shortcut}" ${attributes({ shortcut: variant.partShortcut })}></ui-tooltip-shortcut>` : ""}
    </ui-tooltip-content>`
}

function trigger(variant: Variant) {
  if (variant.compose === "link") {
    return `<ui-tooltip-trigger><a href="#docs" class="${classes.link}">${variant.trigger}</a></ui-tooltip-trigger>`
  }
  if (variant.compose === "popover-trigger") {
    return `<ui-tooltip-trigger><ui-popover-trigger><button class="${classes.trigger}">${variant.trigger}</button></ui-popover-trigger></ui-tooltip-trigger>`
  }
  const button = attributes({
    class: variant.icon ? classes.iconTrigger : classes.trigger,
    "aria-label": variant.label,
    "aria-disabled": variant.ariaDisabled || undefined,
  })
  const label = variant.icon
    ? `<span aria-hidden="true">${variant.trigger}</span>`
    : (variant.trigger ?? "Hover me")
  return `<ui-tooltip-trigger><button ${button}>${label}</button></ui-tooltip-trigger>`
}

function markup(variant: Variant, env: Env) {
  if (variant.compose === "toolbar") {
    return `
      <div role="toolbar" aria-label="Formatting" class="${classes.toolbar}">
        ${toolbar
          .map(
            (item) => `
          <ui-tooltip ${rootAttributes(variant, env, { shortcut: item.shortcut })}>
            <ui-tooltip-trigger><button class="${classes.toolbarButton}"><span aria-hidden="true">${item.icon}</span></button></ui-tooltip-trigger>
            ${content(variant, env, item.text, !!item.shortcut)}
          </ui-tooltip>`
          )
          .join("")}
      </div>`
  }

  // The tooltip comes first, so triggers that name it with `for` find it.
  if (variant.controller) {
    return `
      <div class="flex gap-2">
        <ui-tooltip id="tooltip-${variant.id}" ${rootAttributes(variant, env)}>
          ${content(variant, env, "Open nothing")}
        </ui-tooltip>
        ${rows
          .map(
            (row) =>
              `<ui-tooltip-trigger for="tooltip-${variant.id}" data-row="${row}"><button class="${classes.trigger}">${row}</button></ui-tooltip-trigger>`
          )
          .join("")}
      </div>`
  }

  if (variant.compose === "in-popover") {
    return `
      <ui-popover>
        <ui-popover-trigger><button class="${classes.trigger}">${variant.trigger}</button></ui-popover-trigger>
        <ui-popover-content class="${classes.popover}" side-offset="8">
          <ui-popover-title class="${classes.popoverTitle}">Formatting</ui-popover-title>
          <div class="flex gap-2">
            <ui-tooltip ${rootAttributes(variant, env)}>
              <ui-tooltip-trigger><button class="${classes.button}">Help</button></ui-tooltip-trigger>
              ${content(variant, env, "Opens the help center")}
            </ui-tooltip>
            <ui-popover-close><button class="${classes.button}">Close</button></ui-popover-close>
          </div>
        </ui-popover-content>
      </ui-popover>`
  }

  const tooltip = `
    <ui-tooltip ${rootAttributes(variant, env)}>
      ${trigger(variant)}
      ${content(variant, env, variant.text ?? variant.title)}
    </ui-tooltip>`
  if (variant.compose !== "popover-trigger") {
    return tooltip
  }
  return `
    <ui-popover ${env.container ? `container="#${env.container.id}"` : ""}>
      ${tooltip}
      <ui-popover-content class="${classes.popover}" side-offset="8">
        <ui-popover-title class="${classes.popoverTitle}">Profile settings</ui-popover-title>
        <ui-popover-close><button class="${classes.button}">Close</button></ui-popover-close>
      </ui-popover-content>
    </ui-popover>`
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    if (env.anchor) {
      env.anchor.id = `anchor-${variant.id}`
    }
    const wrapper = Object.assign(document.createElement("div"), {
      className: "flex items-center gap-3",
    })
    wrapper.innerHTML = markup(variant, env)
    slot.append(wrapper)

    // Callbacks are DOM events on the element. A tooltip's bubble through the popover around it.
    for (const tooltip of wrapper.querySelectorAll<TooltipElement>(
      "ui-tooltip"
    )) {
      const text = tooltip.querySelector<HTMLElement>("[data-text]")!
      const initial = text.textContent
      // Shows the payload of the trigger that opened it last.
      const showPayload = () => {
        if (variant.controller) {
          text.textContent = `Open ${tooltip.api?.getPayload() ?? "nothing"}`
        }
      }
      tooltip.addEventListener("openchange", (event) => {
        if (event.target !== tooltip) {
          return
        }
        const { value, reason } = (
          event as CustomEvent<{ value: boolean; reason: string }>
        ).detail
        env.log(`openChange ${value} (${reason})`)
        showPayload()
        if (variant.controlled) {
          checkbox.checked = value
        }
      })
      tooltip.addEventListener("openchangecomplete", (event) => {
        if (event.target !== tooltip) {
          return
        }
        const { value } = (event as CustomEvent<{ value: boolean }>).detail
        if (!value) {
          text.textContent = initial
        }
        showPayload()
        env.log(`openChangeComplete ${value}`)
      })
      // Moving to another trigger while open hands the tooltip over with a payload change, and no open change.
      tooltip.addEventListener(
        "payloadchange",
        (event) => event.target === tooltip && showPayload()
      )
      if (env.controller) {
        tooltip.controller = env.controller
      }
      if (variant.controller) {
        for (const row of wrapper.querySelectorAll<
          HTMLElement & { payload?: string }
        >("[data-row]")) {
          row.payload = row.dataset.row
        }
      }
    }

    const button = wrapper.querySelector<HTMLElement>(
      "ui-tooltip-trigger > button, ui-tooltip-trigger > a"
    )
    button?.addEventListener("click", () => {
      if (variant.ariaDisabled) {
        return env.log("press ignored, aria-disabled")
      }
      if (variant.copy) {
        wrapper.querySelector("[data-text]")!.textContent = "Copied"
      }
      env.log("press")
    })
    wrapper
      .querySelector("ui-popover")
      ?.addEventListener("openchange", (event) => {
        if ((event.target as HTMLElement).localName !== "ui-popover") {
          return
        }
        const { value, reason } = (
          event as CustomEvent<{ value: boolean; reason: string }>
        ).detail
        env.log(`popover openChange ${value} (${reason})`)
      })

    // Web components have no controlled prop. The checkbox drives the element's api instead.
    const checkbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
    })
    if (variant.controlled) {
      const tooltip = wrapper.querySelector<TooltipElement>("ui-tooltip")!
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      wrapper.append(label)
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          tooltip.api?.open()
        } else {
          tooltip.api?.close()
        }
      })
    }
  })
}

export { mount }
