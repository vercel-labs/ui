import "@ui-sdk/web/toggle"

const weights = [
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "bold", label: "Bold" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toggle-group default-value="normal" deselectable="false" aria-label="Font weight">
        ${weights
          .map(
            (item) => `
              <ui-toggle value="${item.value}">
                <button data-variant="${item.value}">${item.label}</button>
              </ui-toggle>
            `,
          )
          .join("")}
      </ui-toggle-group>
      <p data-variant="normal">The quick brown fox jumps over the lazy dog.</p>
    </div>
  `
  const preview = root.querySelector("p")!
  root.querySelector("ui-toggle-group")!.addEventListener("valuechange", (event) => {
    preview.dataset.variant = event.detail.value[0] ?? "normal"
  })
}

export { mount }
