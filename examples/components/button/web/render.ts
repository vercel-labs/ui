import "@ui-sdk/web/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">
        <input type="checkbox" />
        Make saving fail
      </label>
      <div data-slot="stack">
        <ui-button><button>Save changes</button></ui-button>
        <p data-slot="output" role="alert"></p>
      </div>
    </div>
  `
  const fail = root.querySelector("input")!
  const save = root.querySelector("ui-button")!
  const button = save.querySelector("button")!
  const message = root.querySelector("p")!
  save.addEventListener("action", (event) => {
    message.textContent = ""
    button.textContent = "Saving…"
    const saving = wait(1000).then(() => {
      if (fail.checked) {
        throw new Error("Couldn't save. Check your connection and try again.")
      }
    })
    event.detail.waitUntil(saving)
    saving.then(
      () => {
        button.textContent = "Save changes"
      },
      (error: Error) => {
        button.textContent = "Try again"
        message.textContent = error.message
      },
    )
  })
}

export { mount }
