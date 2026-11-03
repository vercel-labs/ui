import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-popover>
      <ui-popover-trigger><button>Edit profile</button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title>Profile</ui-popover-title>
        <ui-popover-description>Your name appears on your posts.</ui-popover-description>
        <form data-slot="stack">
          <label data-slot="label">
            Name
            <input name="name" value="Ada Lovelace" />
          </label>
          <button type="submit" data-variant="solid">Save</button>
        </form>
      </ui-popover-content>
    </ui-popover>
    <output data-slot="output">Not saved yet</output>
  `
  const popover = root.querySelector("ui-popover")!
  root.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault()
    const name = new FormData(event.target as HTMLFormElement).get("name")
    root.querySelector("output")!.textContent = `Saved ${name}`
    popover.api.close()
  })
}

export { mount }
