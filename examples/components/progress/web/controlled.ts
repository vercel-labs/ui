import "@ui-sdk/web/progress"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-progress value="20">
        <ui-progress-label>Uploading files</ui-progress-label>
        <ui-progress-value></ui-progress-value>
        <ui-progress-track>
          <ui-progress-indicator></ui-progress-indicator>
        </ui-progress-track>
      </ui-progress>
      <div data-slot="row">
        <button data-variant="secondary" type="button" aria-disabled="false">Upload more</button>
        <button data-variant="secondary" type="button">Reset</button>
      </div>
    </div>
  `
  const progress = root.querySelector("ui-progress")!
  const [more, reset] = root.querySelectorAll("button")
  const set = (value: number) => {
    progress.setAttribute("value", String(value))
    more.setAttribute("aria-disabled", String(value >= 100))
  }
  more.addEventListener("click", () => set(Math.min(100, Number(progress.getAttribute("value")) + 20)))
  reset.addEventListener("click", () => set(0))
}
