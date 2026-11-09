import type { CollapsibleApi } from "@ui-sdk/core/collapsible"
import "@ui-sdk/web/collapsible"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import { content, tree, type TreeNode, type Variant } from "./variants"

type CollapsibleElement = HTMLElement & {
  api?: CollapsibleApi
  controller?: unknown
  open?: boolean
}

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Boolean attributes for every option or prop that is on.
function attributes(props: Record<string, unknown> = {}) {
  return Object.entries(props)
    .map(([name, value]) => (value ? ` ${kebab(name)}` : ""))
    .join("")
}

// What the panel holds.
function body(variant: Variant) {
  if (variant.body === "long") {
    return Array.from(
      { length: 20 },
      (_, index) => `<p>Line ${index + 1}</p>`
    ).join("")
  }
  if (variant.body === "form") {
    return `<label class="flex flex-col">${content.text}<input class="${classes.input}" value="Ada" aria-label="Name" /></label>`
  }
  if (variant.body === "grow") {
    return `<p>Line 1</p><button data-grow class="${classes.button} self-start">Add a line</button>`
  }
  return content.text
}

// A folder is a collapsible holding its children. Files are plain rows.
function folder(node: TreeNode) {
  if (!node.children) {
    return `<div class="${classes.treeFile}">${node.name}</div>`
  }
  // Typed, so the recursion doesn't need this function's return type.
  const children: string[] = node.children.map(folder)
  return `
    <ui-collapsible data-name="${node.name}">
      <ui-collapsible-trigger>
        <button class="${classes.treeTrigger}"><span aria-hidden="true" class="${classes.treeChevron}">▸</span>${node.name}/</button>
      </ui-collapsible-trigger>
      <ui-collapsible-panel class="${classes.treePanel}">${children.join("")}</ui-collapsible-panel>
    </ui-collapsible>`
}

function markup(variant: Variant) {
  if (variant.body === "tree") {
    return `<div class="w-full rounded-lg border border-neutral-200 bg-white p-2">${folder(tree)}</div>`
  }
  const label = `${content.trigger}<span aria-hidden="true" class="${classes.chevron}">▾</span>`
  const trigger =
    variant.render?.trigger === "div"
      ? `<div class="${classes.trigger}">${label}</div>`
      : variant.render?.trigger === "link"
        ? `<a href="#collapsible-link" class="${classes.trigger}">${label}</a>`
        : `<button class="${classes.trigger}">${label}</button>`
  const inner = `<div class="${classes.inner}">${body(variant)}</div>`
  // With as-child, the section is the panel and the element only wraps it.
  const panel =
    variant.render?.panel === "section"
      ? `<ui-collapsible-panel as-child${attributes(variant.panel)}><section class="${classes.panel(variant.animation)}">${inner}</section></ui-collapsible-panel>`
      : `<ui-collapsible-panel class="${classes.panel(variant.animation)}"${attributes(variant.panel)}>${inner}</ui-collapsible-panel>`
  return `
    <ui-collapsible class="${classes.root}"${attributes(variant.options)}>
      <ui-collapsible-trigger>${trigger}</ui-collapsible-trigger>
      ${panel}
    </ui-collapsible>`
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const wrapper = Object.assign(document.createElement("div"), {
      className: "flex w-full flex-col gap-2",
    })
    wrapper.innerHTML = markup(variant)
    slot.append(wrapper)
    const collapsible =
      wrapper.querySelector<CollapsibleElement>("ui-collapsible")!

    // Callbacks are DOM events on the elements, and nested ones bubble, so one
    // listener logs them all. Folders log their name.
    wrapper.addEventListener(
      "openchange",
      (event) => {
        const target = event.target as HTMLElement
        if (target.localName !== "ui-collapsible") {
          return
        }
        const name = target.dataset.name ? `${target.dataset.name} ` : ""
        const detail = (
          event as CustomEvent<{ value: boolean; reason: string }>
        ).detail
        if (variant.cancel === (detail.value ? "open" : "close")) {
          event.preventDefault()
          env.log(`${name}openChange ${detail.value} canceled`)
          return
        }
        env.log(`${name}openChange ${detail.value} (${detail.reason})`)
      },
      { capture: true }
    )
    wrapper.addEventListener(
      "openchangecomplete",
      (event) => {
        const target = event.target as HTMLElement
        if (target.localName !== "ui-collapsible") {
          return
        }
        const name = target.dataset.name ? `${target.dataset.name} ` : ""
        env.log(
          `${name}openChangeComplete ${(event as CustomEvent<{ value: boolean }>).detail.value}`
        )
      },
      { capture: true }
    )

    const grow = wrapper.querySelector<HTMLButtonElement>("[data-grow]")
    grow?.addEventListener("click", () =>
      grow.before(
        Object.assign(document.createElement("p"), {
          textContent: `Line ${grow.parentElement!.querySelectorAll("p").length + 1}`,
        })
      )
    )

    collapsible.controller = env.controller

    // Web components have no controlled prop. These set the live `open` property instead.
    if (variant.controlled) {
      const buttons = Object.assign(document.createElement("div"), {
        className: "flex items-center gap-2 text-xs",
      })
      const state = Object.assign(document.createElement("code"), {
        className: "text-neutral-500",
        textContent: "open=false",
      })
      buttons.append(state)
      collapsible.addEventListener("openchange", () =>
        queueMicrotask(() => (state.textContent = `open=${collapsible.open}`))
      )
      for (const [label, run] of [
        ["Open", () => (collapsible.open = true)],
        ["Close", () => (collapsible.open = false)],
        ["Toggle", () => (collapsible.open = !collapsible.open)],
      ] as const) {
        const button = Object.assign(document.createElement("button"), {
          className: classes.button,
          textContent: label,
        })
        button.addEventListener("click", run)
        buttons.append(button)
      }
      wrapper.append(buttons)
    }
  })
}

export { mount }
