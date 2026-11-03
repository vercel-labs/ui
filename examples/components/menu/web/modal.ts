import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  let clicks = 0
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-menu modal="pointer">
          <ui-menu-trigger>
            <button>Default</button>
          </ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item>Rename</ui-menu-item>
            <ui-menu-item>Duplicate</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
        <ui-menu modal>
          <ui-menu-trigger>
            <button>Modal</button>
          </ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item>Rename</ui-menu-item>
            <ui-menu-item>Duplicate</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
        <ui-menu modal="false">
          <ui-menu-trigger>
            <button>Non-modal</button>
          </ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item>Rename</ui-menu-item>
            <ui-menu-item>Duplicate</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
      </div>
      <button>Clicked 0 times. Open a menu, then click here.</button>
    </div>
  `
  const button = root.querySelector<HTMLButtonElement>(':scope > [data-slot="stack"] > button')!
  button.addEventListener("click", () => {
    clicks += 1
    button.textContent = `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}. Open a menu, then click here.`
  })
}

export { mount }
