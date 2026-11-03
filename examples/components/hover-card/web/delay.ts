import "@ui-sdk/web/hover-card"

const timings = [
  { label: "Instant", delay: 0, closeDelay: 0 },
  { label: "Default", delay: 600, closeDelay: 300 },
  { label: "Patient", delay: 1200, closeDelay: 600 },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        ${timings
          .map(
            (timing) => `
        <ui-hover-card delay="${timing.delay}" close-delay="${timing.closeDelay}">
          <ui-hover-card-trigger><a href="https://example.com/${timing.label.toLowerCase()}">${timing.label}</a></ui-hover-card-trigger>
          <ui-hover-card-content>
            <p>${timing.label}</p>
            <p data-slot="hint">Opens after ${timing.delay}ms and closes ${timing.closeDelay}ms after the pointer leaves.</p>
          </ui-hover-card-content>
        </ui-hover-card>`,
          )
          .join("")}
      </div>
      <label data-slot="label"><input type="checkbox" checked /> Show cards</label>
    </div>
  `
  const show = root.querySelector("input")!
  show.addEventListener("change", () => {
    for (const card of root.querySelectorAll("ui-hover-card")) card.toggleAttribute("disabled", !show.checked)
  })
}

export { mount }
