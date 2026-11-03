import "@ui-sdk/web/menubar"
import "@ui-sdk/web/menu"
import { Check, ChevronRight, createElement } from "lucide"

const profiles = [
  { value: "hollis", label: "Hollis" },
  { value: "ines", label: "Inès" },
  { value: "kofi", label: "Kofi" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-menubar>
      <ui-menu>
        <ui-menu-trigger>
          <button>File</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item shortcut="mod+t">New Tab</ui-menu-item>
          <ui-menu-item shortcut="mod+n">New Window</ui-menu-item>
          <ui-menu-item disabled>New Incognito Window</ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-sub>
            <ui-menu-sub-trigger>
              Share
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-sub-trigger>
            <ui-menu-sub-content>
              <ui-menu-item>Email link</ui-menu-item>
              <ui-menu-item>Messages</ui-menu-item>
              <ui-menu-item>Notes</ui-menu-item>
            </ui-menu-sub-content>
          </ui-menu-sub>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item shortcut="mod+p">Print…</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger>
          <button>Edit</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item shortcut="mod+z">Undo</ui-menu-item>
          <ui-menu-item shortcut="mod+shift+z">Redo</ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item>Cut</ui-menu-item>
          <ui-menu-item>Copy</ui-menu-item>
          <ui-menu-item>Paste</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger>
          <button>View</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-checkbox-item value="bookmarks">
            <ui-menu-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
            Always Show Bookmarks Bar
          </ui-menu-checkbox-item>
          <ui-menu-checkbox-item value="urls" default-checked>
            <ui-menu-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
            Always Show Full URLs
          </ui-menu-checkbox-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item shortcut="mod+r">Reload</ui-menu-item>
          <ui-menu-item>Toggle Fullscreen</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <ui-menu>
        <ui-menu-trigger>
          <button>Profiles</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-radio-group default-value="ines">
            ${profiles
              .map(
                (profile) => `
                  <ui-menu-radio-item value="${profile.value}">
                    <ui-menu-item-indicator>
                    </ui-menu-item-indicator>
                    ${profile.label}
                  </ui-menu-radio-item>
                `,
              )
              .join("")}
          </ui-menu-radio-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item>Edit…</ui-menu-item>
          <ui-menu-item>Add Profile…</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
    </ui-menubar>
  `
}

export { mount }
