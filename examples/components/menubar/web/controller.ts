import "@ui-sdk/web/menubar"
import "@ui-sdk/web/menu"
import { registerShortcut } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menubar>
        ${["File", "Edit"]
          .map(
            (label) => `
              <ui-menu>
                <ui-menu-trigger>
                  <button>${label}</button>
                </ui-menu-trigger>
                <ui-menu-content>
                  <ui-menu-item value="close" close-on-select="false">Close from the controller</ui-menu-item>
                </ui-menu-content>
              </ui-menu>
            `,
          )
          .join("")}
      </ui-menubar>
      <div data-slot="row">
        <button type="button" data-action="focus">Focus menubar</button>
        <output data-slot="output">Open: none · Alt+M focuses it too</output>
      </div>
    </div>
  `
  const menubar = root.querySelector("ui-menubar")!
  const output = root.querySelector("output")!
  const off = registerShortcut("alt+m", () => menubar.api.focus())
  root.querySelector("[data-action=focus]")!.addEventListener("click", () => menubar.api.focus())
  menubar.addEventListener("action", () => menubar.api.close(), { capture: true })
  root.querySelectorAll("ui-menu").forEach((menu) => {
    const label = menu.querySelector("button")!.textContent!.trim()
    menu.addEventListener("openchange", (event) => {
      output.textContent = `Open: ${event.detail.value ? label : "none"} · Alt+M focuses it too`
    })
  })
  return off
}

export { mount }
