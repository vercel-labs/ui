import "@ui-sdk/web/button"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-button>
      <button>
        Outline
      </button>
    </ui-button>
  `
}
