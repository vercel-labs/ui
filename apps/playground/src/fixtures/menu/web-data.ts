import { menuOptions } from "tests/fixtures/page.ts"
import { menuData } from "./data"

async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <span id="slot"></span>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    <button id="controller">Open with controller</button>
    </div>
  `
  const menu = document.createElement("ui-menu") as HTMLElement & {
    items: unknown
  }
  menu.items = menuData
  menu.innerHTML = `<ui-menu-trigger><button>File</button></ui-menu-trigger>`
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
  root.querySelector("#slot")!.replaceWith(menu)
  await import("@ui-sdk/web/menu")
  root
    .querySelector("#controller")!
    .addEventListener("click", () =>
      (
        menu as unknown as { api?: { open: (options: object) => void } }
      ).api?.open({ focus: "first" })
    )
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
