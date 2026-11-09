// Web components bind whatever element they wrap, so a span is the toggle.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-password-input class="password-input">
        <input class="input" aria-label="Password">
        <ui-password-input-toggle><span class="password-toggle" aria-label="Show password"><span aria-hidden="true">Show</span></span></ui-password-input-toggle>
      </ui-password-input>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/password-input")
  root.addEventListener(
    "visiblechange",
    (event) => {
      root.querySelector("output")!.textContent =
        `visible: ${(event as CustomEvent<{ value: boolean }>).detail.value}`
    },
    { capture: true }
  )
}

export { mount }
