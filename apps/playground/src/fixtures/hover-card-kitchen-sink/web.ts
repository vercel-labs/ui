import type { HoverCardController } from "@ui-sdk/core/hover-card"
import "@ui-sdk/web/hover-card"
import "@ui-sdk/web/tooltip"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { authors, type Variant } from "./variants"

type HoverCardElement = HTMLElement & {
  controller?: HoverCardController<string>
  api?: { open: () => void; close: () => void; getPayload: () => unknown }
}

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const attributes = (record: Record<string, unknown>) =>
  Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${kebab(name)}="${value}"`)
    .join(" ")

// The name shows in elements marked `data-name`, so a controller's payload can change it.
function body(variant: Variant, name: string) {
  const heading = `
    <div class="flex items-center gap-3">
      <div class="${classes.avatar}" aria-hidden="true" data-name="initial">${name.slice(0, 1).toUpperCase()}</div>
      <div>
        <div class="${classes.name}" data-name="name">${name}</div>
        <div class="${classes.handle}" data-name="handle">@${name}</div>
      </div>
    </div>`
  const bio = `<p class="${classes.bio}">${variant.note ?? "Writes about headless components."}</p>`
  if (variant.body === "text") {
    return heading + bio
  }
  if (variant.body === "long") {
    return (
      heading +
      Array.from({ length: 30 }, (_, index) => `<p>Line ${index + 1}</p>`).join(
        ""
      )
    )
  }
  if (variant.body === "tooltip") {
    return `${heading}${bio}
      <div class="mt-3">
        <ui-tooltip delay="100">
          <ui-tooltip-trigger><button class="${classes.button}">Follow</button></ui-tooltip-trigger>
          <ui-tooltip-content class="${classes.tooltip}" side-offset="6">Get updates from @${name}</ui-tooltip-content>
        </ui-tooltip>
      </div>`
  }
  return `${heading}${bio}
    <div class="mt-3 flex items-center gap-3">
      <a href="#${name}" class="${classes.link}">View profile</a>
      <button class="${classes.button}">Follow</button>
    </div>`
}

function markup(variant: Variant, env: Env) {
  const root = attributes({
    ...variant.options,
    ...(env.container && { container: `#${env.container.id}` }),
  })
  const props = attributes({
    sideOffset: 8,
    ...variant.content,
    ...(env.anchor && { anchor: `#${env.anchor.id}` }),
  })
  const card = (name: string) => `
    <ui-hover-card-content class="${classes.content(variant.animation, variant.body === "long")}" ${props}>
      ${variant.arrow !== false ? `<ui-hover-card-arrow class="${classes.arrow}"></ui-hover-card-arrow>` : ""}
      ${body(variant, name)}
    </ui-hover-card-content>`

  // The card comes first, so links that name it with `for` find it.
  if (variant.controller) {
    return `
      <div class="flex gap-3">
        <ui-hover-card id="hover-card-${variant.id}" ${root}>${card("nobody")}</ui-hover-card>
        ${authors
          .map(
            (author) =>
              `<ui-hover-card-trigger for="hover-card-${variant.id}" data-author="${author}"><a href="#${author}" class="${classes.trigger}">@${author}</a></ui-hover-card-trigger>`
          )
          .join("")}
      </div>`
  }

  return `
    <ui-hover-card ${root}>
      <ui-hover-card-trigger><a href="#${variant.id}" class="${classes.trigger}">${variant.trigger ?? `@${variant.id}`}</a></ui-hover-card-trigger>
      ${card(variant.id)}
    </ui-hover-card>`
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
    const card = wrapper.querySelector<HoverCardElement>("ui-hover-card")!

    // Shows the payload of the link that opened the card last.
    const showPayload = () => {
      if (!variant.controller) {
        return
      }
      const name = String(card.api?.getPayload() ?? "nobody")
      for (const el of card.querySelectorAll<HTMLElement>("[data-name]")) {
        el.textContent =
          el.dataset.name === "initial"
            ? name.slice(0, 1).toUpperCase()
            : el.dataset.name === "handle"
              ? `@${name}`
              : name
      }
    }

    // Callbacks are DOM events on the element. A nested tooltip's bubble through it.
    card.addEventListener("openchange", (event) => {
      if (event.target !== card) {
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
    card.addEventListener("openchangecomplete", (event) => {
      if (event.target !== card) {
        return
      }
      env.log(
        `openChangeComplete ${(event as CustomEvent<{ value: boolean }>).detail.value}`
      )
    })
    // Moving to another link while open hands the card over with a payload change, and no open change.
    card.addEventListener(
      "payloadchange",
      (event) => event.target === card && showPayload()
    )
    if (env.controller) {
      card.controller = env.controller
    }
    for (const link of wrapper.querySelectorAll<
      HTMLElement & { payload?: string }
    >("[data-author]")) {
      link.payload = link.dataset.author
    }

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
          card.api?.open()
        } else {
          card.api?.close()
        }
      })
    }
  })
}

export { mount }
