import "@ui-sdk/web/menubar"
import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-menubar modal>
      ${["File", "Edit", "View"]
        .map(
          (label) => `
            <ui-menu>
              <ui-menu-trigger>
                <button>${label}</button>
              </ui-menu-trigger>
              <ui-menu-content>
                <ui-menu-item>${label} settings</ui-menu-item>
              </ui-menu-content>
            </ui-menu>
          `,
        )
        .join("")}
    </ui-menubar>
  `
}

export { mount }
