import "@ui-sdk/web/button"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-button>
      <button data-variant="ghost">
        Ghost
      </button>
    </ui-button>
  `
}
