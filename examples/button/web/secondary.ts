import "@ui-sdk/web/button"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-button>
      <button data-variant="secondary">
        Secondary
      </button>
    </ui-button>
  `
}
