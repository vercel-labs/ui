import "@ui-sdk/web/menu"
import { renderMenuItems } from "../../../../../packages/web/src/menu"
import * as classes from "./classes"
import { kitchenSink } from "./shell"

// The parts the menu copies for its items, at every level.
function menuTemplate(animation?: classes.Animation) {
  const template = document.createElement("template")
  template.innerHTML = `
    <ui-menu-content class="${classes.content(animation)}"></ui-menu-content>
    <ui-menu-item class="${classes.item}"></ui-menu-item>
    <ui-menu-checkbox-item class="${classes.item}"><ui-menu-item-indicator class="${classes.indicator}">✓</ui-menu-item-indicator></ui-menu-checkbox-item>
    <ui-menu-radio-item class="${classes.item}"><ui-menu-item-indicator class="${classes.indicator}">•</ui-menu-item-indicator></ui-menu-radio-item>
    <ui-menu-group-label class="${classes.groupLabel}"></ui-menu-group-label>
    <ui-menu-separator class="${classes.separator}"></ui-menu-separator>
    <ui-menu-sub-trigger class="${classes.item}"><span aria-hidden="true" class="${classes.chevron}">›</span></ui-menu-sub-trigger>
    <ui-menu-sub-content class="${classes.content(animation)}"></ui-menu-sub-content>
  `
  return template
}

const attributes: Record<string, string> = {
  modal: "modal",
  presentation: "presentation",
  loop: "loop",
  delay: "delay",
  itemShortcuts: "item-shortcuts",
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const template = menuTemplate(variant.animation)
    const menu = document.createElement("ui-menu") as HTMLElement & {
      items?: unknown
      controller?: unknown
      api?: { open: (options: object) => void; close: () => void }
    }
    for (const [option, value] of Object.entries(variant.options ?? {})) {
      if (attributes[option]) {
        menu.setAttribute(attributes[option], String(value))
      }
    }
    if (env.container) {
      menu.setAttribute("container", `#${env.container.id}`)
    }

    const button = Object.assign(document.createElement("button"), {
      className: classes.trigger,
      textContent: variant.trigger ?? "Open",
    })
    const menuTrigger = document.createElement("ui-menu-trigger")
    menuTrigger.append(button)
    menu.append(menuTrigger)

    if (variant.mode === "data") {
      menu.append(template)
      menu.items = variant.items
    } else {
      const content = Object.assign(document.createElement("ui-menu-content"), {
        className: classes.content(variant.animation),
      })
      // Positioning props are attributes on the content element.
      for (const [prop, value] of Object.entries(variant.content ?? {})) {
        content.setAttribute(
          prop.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
          String(value)
        )
      }
      content.append(...renderMenuItems(variant.items, template))
      menu.append(content)
    }

    const wrapper = Object.assign(document.createElement("div"), {
      className: "flex items-center gap-3",
    })
    wrapper.append(menu)
    slot.append(wrapper)

    // Callbacks are DOM events on the element.
    menu.addEventListener("openchange", (event) => {
      const { value, reason } = (
        event as CustomEvent<{ value: boolean; reason: string }>
      ).detail
      env.log(`openChange ${value} (${reason})`)
      if (variant.controlled) {
        checkbox.checked = value
      }
    })
    menu.addEventListener("action", (event) =>
      env.log(
        `action ${(event as CustomEvent<{ value: string }>).detail.value}`
      )
    )
    menu.controller = env.controller

    // Web components have no controlled prop. The checkbox drives the element's api instead.
    const checkbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
    })
    if (variant.controlled) {
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      wrapper.append(label)
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          menu.api?.open({ focus: "first" })
        } else {
          menu.api?.close()
        }
      })
    }
  })
}

export { mount }
