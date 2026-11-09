const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-toolbar class="toolbar" aria-label="Tools">
      <ui-toolbar-button><span data-action="span">Span tool</span></ui-toolbar-button>
      <ui-toolbar-button><button data-action="cut">Cut</button></ui-toolbar-button>
      <ui-toolbar-button><button data-action="copy">Copy</button></ui-toolbar-button>
      <ui-toolbar-separator as-child><hr class="rule" /></ui-toolbar-separator>
      <ui-toolbar-button disabled><a href="#old">Old docs</a></ui-toolbar-button>
    </ui-toolbar>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  await import("@ui-sdk/web/toolbar")
  root.addEventListener("click", (event) => {
    const action = (event.target as HTMLElement)
      .closest("[data-action]")
      ?.getAttribute("data-action")
    if (action) {
      root.querySelector("output")!.textContent = action
    }
  })
}

export { mount }
