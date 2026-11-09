import "@ui-sdk/web/accordion"
import * as classes from "./classes"
import { itemsOf, kitchenSink } from "./shell"
import type { Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// An accordion in every item, two levels deep. Items carry their path for the event log.
function nested(path: string, depth = 1) {
  // Typed, so the recursion doesn't need this function's return type.
  const items: string[] = ["One", "Two"].map((label) => {
    const inner =
      depth < 2
        ? nested(`${path}/${label}`, depth + 1)
        : `Inside ${path}/${label}.`
    return `
      <ui-accordion-item value="${label}" data-path="${path}/${label}">
        <ui-accordion-header><h3 class="${classes.header}"><ui-accordion-trigger><button class="${classes.trigger}">Level ${depth}, ${label.toLowerCase()}</button></ui-accordion-trigger></h3></ui-accordion-header>
        <ui-accordion-panel class="${classes.panel()}"><div class="${classes.inner}">${inner}</div></ui-accordion-panel>
      </ui-accordion-item>`
  })
  return `<ui-accordion class="${classes.root}" multiple>${items.join("")}</ui-accordion>`
}

// What the second item's panel holds.
function body(variant: Variant, content: string) {
  if (variant.body === "long") {
    return Array.from(
      { length: 20 },
      (_, index) => `<p>Line ${index + 1}</p>`
    ).join("")
  }
  if (variant.body === "form") {
    return `<label class="flex flex-col">${content}<input class="${classes.input}" value="Ada" aria-label="Name" /></label>`
  }
  if (variant.body === "nested") {
    return `<ui-accordion class="${classes.root}">${["Nested one", "Nested two"]
      .map(
        (label) => `
        <ui-accordion-item value="${label}">
          <ui-accordion-header><h3 class="${classes.header}"><ui-accordion-trigger><button class="${classes.trigger}">${label}</button></ui-accordion-trigger></h3></ui-accordion-header>
          <ui-accordion-panel class="${classes.panel()}"><div class="${classes.inner}">Inside ${label.toLowerCase()}.</div></ui-accordion-panel>
        </ui-accordion-item>`
      )
      .join("")}</ui-accordion>`
  }
  if (variant.body === "nested-deep") {
    return nested("b")
  }
  if (variant.body === "grow") {
    return `<div class="flex flex-col gap-1"><p>Line 1</p><button data-grow class="${classes.button} self-start">Add a line</button></div>`
  }
  return content
}

type AccordionElement = HTMLElement & {
  controller?: unknown
  api?: { setValue: (value: string[]) => boolean }
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const accordion = document.createElement("ui-accordion") as AccordionElement
    accordion.className = classes.root
    for (const [option, value] of Object.entries(variant.options ?? {})) {
      if (option === "debug") {
        continue
      }
      accordion.setAttribute(
        kebab(option),
        Array.isArray(value) ? value.join(",") : String(value)
      )
    }
    const list = itemsOf(variant)
    accordion.innerHTML = list
      .map((item, index) => {
        const panel = index === 1 ? variant.panel : undefined
        const panelAttributes = Object.entries(panel ?? {})
          .map(([name, value]) => (value ? ` ${kebab(name)}` : ""))
          .join("")
        return `
          <ui-accordion-item class="${classes.item}${variant.index ? ` ${classes.itemIndex}` : ""}" value="${item.value}"${variant.disabledItems?.includes(item.value) ? " disabled" : ""}>
            <ui-accordion-header>
              <h3 class="${classes.header}">
                <ui-accordion-trigger${variant.disabledTriggers?.includes(item.value) ? " disabled" : ""}>
                  <button class="${classes.trigger}">${item.label}<span aria-hidden="true" class="${classes.chevron}">▾</span></button>
                </ui-accordion-trigger>
              </h3>
            </ui-accordion-header>
            <ui-accordion-panel class="${classes.panel(variant.animation)}"${panelAttributes}>
              <div class="${classes.inner}">${index === 1 ? body(variant, item.content) : item.content}</div>
            </ui-accordion-panel>
          </ui-accordion-item>`
      })
      .join("")
    const wrapper = Object.assign(document.createElement("div"), {
      className: "flex flex-col gap-2",
    })
    wrapper.append(accordion)
    slot.append(wrapper)

    // Callbacks are DOM events on the elements. Nested accordions bubble theirs too.
    accordion.addEventListener("valuechange", (event) => {
      if (event.target !== accordion) {
        return
      }
      const detail = (event as CustomEvent<{ value: string[]; reason: string }>)
        .detail
      if (variant.cancel && detail.value.includes(variant.cancel)) {
        event.preventDefault()
        env.log(`valueChange ${JSON.stringify(detail.value)} canceled`)
        return
      }
      env.log(`valueChange ${JSON.stringify(detail.value)} (${detail.reason})`)
    })
    accordion.addEventListener(
      "openchange",
      (event) => {
        const item = event.target as HTMLElement
        const detail = (event as CustomEvent<{ value: boolean }>).detail
        // Nested items log their path.
        if (item.parentElement !== accordion) {
          if (item.dataset.path) {
            env.log(`${item.dataset.path} openChange ${detail.value}`)
          }
          return
        }
        const value = item.getAttribute("value")
        if (variant.itemCancel === value) {
          event.preventDefault()
        }
        env.log(
          `${value} openChange ${detail.value}${variant.itemCancel === value ? " canceled" : ""}`
        )
      },
      { capture: true }
    )
    accordion.addEventListener(
      "openchangecomplete",
      (event) => {
        const item = event.target as HTMLElement
        const open = (event as CustomEvent<{ value: boolean }>).detail.value
        if (item.parentElement === accordion) {
          env.log(`${item.getAttribute("value")} openChangeComplete ${open}`)
        } else if (item.dataset.path) {
          env.log(`${item.dataset.path} openChangeComplete ${open}`)
        }
      },
      { capture: true }
    )

    const grow = accordion.querySelector<HTMLButtonElement>("[data-grow]")
    grow?.addEventListener("click", () =>
      grow.before(
        Object.assign(document.createElement("p"), {
          textContent: `Line ${grow.parentElement!.querySelectorAll("p").length + 1}`,
        })
      )
    )

    // Moving the items reconnects them, and data-index follows.
    if (variant.index) {
      const reverse = Object.assign(document.createElement("button"), {
        className: `${classes.button} self-start`,
        textContent: "Reverse items",
      })
      reverse.addEventListener("click", () =>
        accordion.append(
          ...[
            ...accordion.querySelectorAll(":scope > ui-accordion-item"),
          ].reverse()
        )
      )
      wrapper.append(reverse)
    }
    accordion.controller = env.controller

    // Web components have no controlled value. These drive the element's api instead.
    if (variant.controlled) {
      const buttons = Object.assign(document.createElement("div"), {
        className: "flex items-center gap-2 text-xs",
      })
      for (const [label, value] of [
        ["Collapse all", []],
        ["Expand all", list.map((item) => item.value)],
      ] as const) {
        const button = Object.assign(document.createElement("button"), {
          className: "rounded border border-neutral-200 px-2 py-1",
          textContent: label,
        })
        button.addEventListener("click", () =>
          accordion.api?.setValue([...value])
        )
        buttons.append(button)
      }
      wrapper.append(buttons)
    }
  })
}

export { mount }
