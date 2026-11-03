import "@ui-sdk/web/button"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row" role="group" aria-label="Message actions">
      <ui-button>
        <button>Archive</button>
      </ui-button>
      <ui-button>
        <button>Report</button>
      </ui-button>
      <ui-button>
        <button>Snooze</button>
      </ui-button>
    </div>
  `
}
