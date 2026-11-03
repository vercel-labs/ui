import "@ui-sdk/web/menubar"
import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menubar>
        <ui-menu>
          <ui-menu-trigger>
            <button>File</button>
          </ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item>New File</ui-menu-item>
            <ui-menu-item disabled>Revert File</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
        <ui-menu>
          <ui-menu-trigger disabled>
            <button>Share</button>
          </ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item>Email link</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
      </ui-menubar>
      <ui-menubar disabled>
        ${["Edit", "View"]
          .map(
            (label) => `
              <ui-menu>
                <ui-menu-trigger>
                  <button>${label}</button>
                </ui-menu-trigger>
                <ui-menu-content>
                  <ui-menu-item>Unavailable</ui-menu-item>
                </ui-menu-content>
              </ui-menu>
            `,
          )
          .join("")}
      </ui-menubar>
    </div>
  `
}

export { mount }
