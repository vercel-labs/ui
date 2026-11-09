async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-collapsible class="collapsible">
        <ui-collapsible-trigger><div class="collapsible-trigger">Files</div></ui-collapsible-trigger>
        <ui-collapsible-panel as-child><section class="collapsible-panel">The files panel.</section></ui-collapsible-panel>
      </ui-collapsible>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/collapsible")
  root.addEventListener(
    "openchange",
    (event) => {
      root.querySelector("output")!.textContent = (
        event as CustomEvent<{ value: boolean }>
      ).detail.value
        ? "open"
        : "closed"
    },
    { capture: true }
  )
}

export { mount }
