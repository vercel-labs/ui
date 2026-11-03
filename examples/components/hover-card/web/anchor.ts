import "@ui-sdk/web/hover-card"

const ada = {
  handle: "ada",
  name: "Ada Lovelace",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
}

function mount(root: HTMLElement) {
  const id = `hover-card-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="card" id="${id}">
      <div data-slot="avatar" aria-hidden="true">${ada.initials}</div>
      <div data-slot="row">
        <ui-hover-card>
          <ui-hover-card-trigger><a href="https://example.com/people/ada">${ada.name}</a></ui-hover-card-trigger>
          <ui-hover-card-content anchor="#${id}" align="start">
            <p>@${ada.handle}</p>
            <p>${ada.bio}</p>
          </ui-hover-card-content>
        </ui-hover-card>
        <span data-slot="hint">committed “Fix the loop”</span>
      </div>
      <span data-slot="hint">2h ago</span>
    </div>
  `
}

export { mount }
