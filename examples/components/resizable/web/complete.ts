import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-resizable>
        <ui-resizable-panel default-size="40">Files</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize files"></ui-resizable-handle>
        <ui-resizable-panel>Editor</ui-resizable-panel>
      </ui-resizable>
      <output data-slot="output">0 changes, saved nothing yet</output>
    </div>
  `
  const group = root.querySelector("ui-resizable")!
  const output = root.querySelector("output")!
  let moves = 0
  let saved = "nothing yet"
  const show = () => (output.textContent = `${moves} changes, saved ${saved}`)
  group.addEventListener("layoutchange", () => {
    moves++
    show()
  })
  group.addEventListener("layoutcommit", (event) => {
    saved = `${event.detail.value.map(Math.round).join(" / ")} after ${event.detail.reason}`
    show()
  })
}

export { mount }
