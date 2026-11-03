import "@ui-sdk/web/tooltip"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <input placeholder="Post title" aria-label="Post title" />
      <div data-slot="row">
        <ui-tooltip>
          <ui-tooltip-trigger><button aria-disabled="true">Publish</button></ui-tooltip-trigger>
          <ui-tooltip-content>Add a title to publish</ui-tooltip-content>
        </ui-tooltip>
        <output data-slot="output">Draft</output>
      </div>
    </div>
  `
  const input = root.querySelector("input")!
  const button = root.querySelector("button")!
  const tooltip = root.querySelector("ui-tooltip")!
  input.addEventListener("input", () => {
    const blocked = !input.value.trim()
    if (blocked) button.setAttribute("aria-disabled", "true")
    else button.removeAttribute("aria-disabled")
    tooltip.toggleAttribute("disabled", !blocked)
  })
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-disabled") === "true") return
    root.querySelector("output")!.textContent = `Published “${input.value.trim()}”`
  })
}

export { mount }
