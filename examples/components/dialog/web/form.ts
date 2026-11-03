import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button type="submit">New article</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>New article</ui-dialog-title>
          <ui-dialog-description>Save it as a draft or publish it now.</ui-dialog-description>
        </div>
        <form data-slot="stack" method="dialog">
          <label data-slot="label">
            Title
            <input required value="Hello, world" />
          </label>
          <div data-slot="row">
            <button type="submit" value="draft">Save draft</button>
            <button data-variant="solid" type="submit" value="published">Publish</button>
          </div>
        </form>
      </ui-dialog-content>
    </ui-dialog>
    <output data-slot="output"></output>
  `
  const output = root.querySelector("output")!
  root.querySelector("ui-dialog")!.addEventListener("openchange", (event) => {
    const { value, reason, returnValue } = (
      event as CustomEvent<{ value: boolean; reason: string; returnValue?: string }>
    ).detail
    if (!value) output.textContent = returnValue ? `Saved as ${returnValue}` : `Closed with ${reason}`
  })
}

export { mount }
