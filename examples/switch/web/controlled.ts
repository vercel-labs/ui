import "@ui-sdk/web/switch"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <label data-slot="label">
        <ui-switch default-checked>
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        Wi-Fi
      </label>
      <button type="button">Toggle from outside</button>
      <output data-slot="output">Wi-Fi: on</output>
    </div>
  `
  const wifi = root.querySelector("ui-switch")!
  root.querySelector("button")!.addEventListener("click", () => wifi.api.toggle())

  wifi.addEventListener("checkedchange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent = `Wi-Fi: ${value ? "on" : "off"}, last change: ${reason}`
  })
}

export { mount }
