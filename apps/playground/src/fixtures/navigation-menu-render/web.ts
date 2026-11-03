async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-navigation-menu aria-label="Docs" class="nav-menu">
        <ui-navigation-menu-list class="nav-list">
          <ui-navigation-menu-item value="guides">
            <ui-navigation-menu-trigger><button class="nav-trigger">Guides</button></ui-navigation-menu-trigger>
            <ui-navigation-menu-content as-child>
              <section class="nav-content" aria-label="Guides panel">
                <ui-navigation-menu-link current><a href="#intro" data-router>Introduction</a></ui-navigation-menu-link>
                <ui-navigation-menu-link><a href="#install" data-router>Install</a></ui-navigation-menu-link>
              </section>
            </ui-navigation-menu-content>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
        <ui-navigation-menu-viewport class="nav-viewport"></ui-navigation-menu-viewport>
      </ui-navigation-menu>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  // A client-side router: links navigate without a page load.
  for (const link of root.querySelectorAll<HTMLAnchorElement>("a[data-router]"))
    link.addEventListener("click", (event) => {
      event.preventDefault()
      history.pushState(null, "", link.getAttribute("href"))
    })
  await import("@ui-sdk/web/navigation-menu")
  root.querySelector("ui-navigation-menu")!.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: string | null; reason: string }>).detail
    root.querySelector("output")!.textContent = `${value ?? "close"}: ${reason}`
  })
}

export { mount }
