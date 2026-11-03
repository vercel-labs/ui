import "@ui-sdk/web/hover-card"

const sides = ["left", "top", "bottom", "right"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${sides
        .map(
          (side) => `
      <ui-hover-card>
        <ui-hover-card-trigger><a href="https://example.com/${side}">${side}</a></ui-hover-card-trigger>
        <ui-hover-card-content side="${side}">
          <p>${side}</p>
          <p data-slot="hint">The card opens on this side of the link.</p>
        </ui-hover-card-content>
      </ui-hover-card>`,
        )
        .join("")}
    </div>
  `
}

export { mount }
