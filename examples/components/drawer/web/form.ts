import "@ui-sdk/web/drawer"

let count = 0

function mount(root: HTMLElement) {
  const id = `drawer-form-profile-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <div id="${id}" tabindex="-1">
        <div data-name>Pedro Duarte</div>
        <div data-slot="hint" data-username>@peduarte</div>
      </div>
      <ui-drawer>
        <ui-drawer-trigger><button>Edit profile</button></ui-drawer-trigger>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content keep-mounted final-focus="#${id}">
          <div data-slot="grip" aria-hidden="true"></div>
          <div data-slot="stack">
            <ui-drawer-title>Edit profile</ui-drawer-title>
            <ui-drawer-description>Make changes to your profile here. Save when you're done.</ui-drawer-description>
          </div>
          <form data-slot="stack">
            <label data-slot="label">
              Name
              <input name="name" value="Pedro Duarte" />
            </label>
            <label data-slot="label">
              Username
              <input name="username" value="@peduarte" />
            </label>
          </form>
          <div data-slot="stack">
            <ui-drawer-close action value="save"><button data-variant="solid">Save changes</button></ui-drawer-close>
            <ui-drawer-close><button>Cancel</button></ui-drawer-close>
          </div>
        </ui-drawer-content>
      </ui-drawer>
    </div>
  `
  const drawer = root.querySelector("ui-drawer")!
  const form = root.querySelector("form")!
  const close = root.querySelector("ui-drawer-close")!
  const button = close.querySelector("button")!
  let tries = 0
  form.addEventListener("submit", (event) => event.preventDefault())

  async function save() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    tries++
    if (tries === 1) throw new Error("The server didn't answer.")
    const data = new FormData(form)
    root.querySelector("[data-name]")!.textContent = String(data.get("name"))
    root.querySelector("[data-username]")!.textContent = String(data.get("username"))
  }

  close.addEventListener("action", (event) => {
    button.textContent = "Saving…"
    const run = save()
    const { waitUntil } = (event as CustomEvent<{ waitUntil: (promise: Promise<unknown>) => void }>).detail
    waitUntil(run)
    run.then(
      () => (button.textContent = "Save changes"),
      () => (button.textContent = "Couldn't save. Try again"),
    )
  })
  drawer.addEventListener("openchange", (event) => {
    if (event.detail.value) button.textContent = "Save changes"
  })
}

export { mount }
