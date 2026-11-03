import "@ui-sdk/web/button"

function mount(root: HTMLElement) {
  const hintId = `publish-hint-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">Title<input /></label>
      <div data-slot="row">
        <ui-button disabled focusable-when-disabled>
          <button aria-describedby="${hintId}">Publish</button>
        </ui-button>
        <p id="${hintId}">Add a title to publish.</p>
      </div>
    </div>
  `
  const title = root.querySelector("input")!
  const publish = root.querySelector("ui-button")!
  const hint = root.querySelector("p")!
  title.addEventListener("input", () => {
    const ready = title.value.trim() !== ""
    publish.disabled = !ready
    hint.textContent = ready ? "Ready to publish." : "Add a title to publish."
  })
  publish.addEventListener("action", () => {
    hint.textContent = "Published."
  })
}

export { mount }
