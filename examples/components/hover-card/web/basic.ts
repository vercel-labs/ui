import "@ui-sdk/web/hover-card"

const ada = {
  handle: "ada",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
  joined: "Joined December 1842",
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-hover-card>
      <ui-hover-card-trigger><a href="https://example.com/people/ada">@${ada.handle}</a></ui-hover-card-trigger>
      <ui-hover-card-content>
        <div data-slot="row">
          <div data-slot="avatar" aria-hidden="true">${ada.initials}</div>
          <div data-slot="stack">
            <p>@${ada.handle}</p>
            <p>${ada.bio}</p>
            <p data-slot="hint">${ada.joined}</p>
          </div>
        </div>
      </ui-hover-card-content>
    </ui-hover-card>
  `
}

export { mount }
