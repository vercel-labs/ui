import "@ui-sdk/web/toolbar"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toolbar loop="false" aria-label="Pages">
      ${["First", "Previous", "Next", "Last"]
        .map(
          (label) => `
            <ui-toolbar-button>
              <button data-variant="secondary">${label}</button>
            </ui-toolbar-button>
          `,
        )
        .join("")}
    </ui-toolbar>
  `
}

export { mount }
