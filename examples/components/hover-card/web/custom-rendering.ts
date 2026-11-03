import "@ui-sdk/web/hover-card"

const ada = {
  handle: "ada",
  name: "Ada Lovelace",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-hover-card>
      <ui-hover-card-trigger>
        <a href="https://example.com/people/ada">
          <span data-slot="avatar" aria-hidden="true">${ada.initials}</span>
          ${ada.name}
        </a>
      </ui-hover-card-trigger>
      <ui-hover-card-content>
        <p>@${ada.handle}</p>
        <p>${ada.bio}</p>
      </ui-hover-card-content>
    </ui-hover-card>
  `
}

export { mount }
