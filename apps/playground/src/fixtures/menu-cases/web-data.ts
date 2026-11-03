import { casesData } from "./data"

async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <span id="slot"></span>
      <button id="align-right">Align right</button>
      <button id="journal">Add journal</button>
      <button id="shortcuts">Turn off shortcuts</button>
      <button>After</button>
      <input aria-label="Notes" />
      <ui-dialog>
        <ui-dialog-trigger><button>Open dialog</button></ui-dialog-trigger>
        <ui-dialog-content class="dialog">
          <ui-dialog-title class="title">Settings</ui-dialog-title>
          <ui-dialog-close><button>Close</button></ui-dialog-close>
        </ui-dialog-content>
      </ui-dialog>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  const state = { align: "left", journal: false }
  const menu = document.createElement("ui-menu") as HTMLElement & { items: unknown }
  menu.items = casesData(state)
  menu.innerHTML = `<ui-menu-trigger><button>Edit</button></ui-menu-trigger>`
  root.querySelector("#slot")!.replaceWith(menu)
  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/dialog")
  // Setting items again re-renders the menu and its shortcuts.
  const update = (patch: Partial<typeof state>) => {
    Object.assign(state, patch)
    menu.items = casesData(state)
  }
  root.querySelector("#align-right")!.addEventListener("click", () => update({ align: "right" }))
  root.querySelector("#journal")!.addEventListener("click", () => update({ journal: true }))
  root
    .querySelector("#shortcuts")!
    .addEventListener("click", () => menu.setAttribute("item-shortcuts", "false"))
  root.addEventListener(
    "action",
    (event) => {
      root.querySelector("output")!.textContent = (event as CustomEvent<{ value: string }>).detail.value
    },
    { capture: true },
  )
}

export { mount }
