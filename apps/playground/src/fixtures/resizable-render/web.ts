// Custom elements are the parts themselves, so they render as they are.
// Render functions are React and Vue only.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-resizable class="resizable">
        <ui-resizable-panel default-size="30" min-size="10" collapsible class="resizable-panel" role="group" aria-label="Files"></ui-resizable-panel>
        <ui-resizable-handle class="resizable-handle" aria-label="Resize files"></ui-resizable-handle>
        <ui-resizable-panel class="resizable-panel" role="group" aria-label="Editor"></ui-resizable-panel>
      </ui-resizable>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/resizable")
  const output = root.querySelector("output")!
  root.addEventListener(
    "layoutcommit",
    (event) => {
      output.textContent = `layout:${(event as CustomEvent<{ value: number[] }>).detail.value.map(Math.round)}`
    },
    { capture: true }
  )
}

export { mount }
