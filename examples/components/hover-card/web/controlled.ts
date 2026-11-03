import "@ui-sdk/web/hover-card"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-hover-card>
          <ui-hover-card-trigger><a href="https://example.com/people/grace">@${grace.handle}</a></ui-hover-card-trigger>
          <ui-hover-card-content>
            <p>${grace.name}</p>
            <p>${grace.bio}</p>
          </ui-hover-card-content>
        </ui-hover-card>
        <button type="button" data-show>Show from elsewhere</button>
      </div>
      <output data-slot="output">Closed</output>
    </div>
  `
  const card = root.querySelector("ui-hover-card")!
  root.querySelector("[data-show]")!.addEventListener("click", () => card.api.open())
  card.addEventListener("openchange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent = `${value ? "Open" : "Closed"}, last change: ${reason}`
  })
}

export { mount }
