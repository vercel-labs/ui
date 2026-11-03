import "@ui-sdk/web/menu"
import { ChevronRight, createElement } from "lucide"

const menus = [
  { name: "Instant", delay: 0 },
  { name: "Default", delay: 100 },
  { name: "Slow", delay: 500 },
]

const submenus = [
  { label: "Open recent", items: ["report.pdf", "notes.md"] },
  { label: "Share", items: ["Email", "Copy link"] },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${menus
        .map(
          ({ name, delay }) => `
            <ui-menu delay="${delay}">
              <ui-menu-trigger>
                <button>${name}</button>
              </ui-menu-trigger>
              <ui-menu-content>
                <ui-menu-item>New file</ui-menu-item>
                ${submenus
                  .map(
                    (submenu) => `
                      <ui-menu-sub>
                        <ui-menu-sub-trigger>
                          ${submenu.label}
                          ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
                        </ui-menu-sub-trigger>
                        <ui-menu-sub-content>
                          ${submenu.items.map((label) => `<ui-menu-item>${label}</ui-menu-item>`).join("")}
                        </ui-menu-sub-content>
                      </ui-menu-sub>
                    `,
                  )
                  .join("")}
                <ui-menu-item>Close</ui-menu-item>
              </ui-menu-content>
            </ui-menu>
          `,
        )
        .join("")}
    </div>
  `
}

export { mount }
