import "@ui-sdk/web/hover-card"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-hover-card>
        <ui-hover-card-trigger><a href="https://example.com/people/grace">@${grace.handle}</a></ui-hover-card-trigger>
        <ui-hover-card-content keep-mounted>
          <p>${grace.name}</p>
          <p>${grace.bio}</p>
        </ui-hover-card-content>
      </ui-hover-card>
      <output data-slot="output">Closed</output>
    </div>
  `
  const card = root.querySelector("ui-hover-card")!
  const status = root.querySelector("output")!
  card.addEventListener("openchange", (event) => {
    status.textContent = event.detail.value ? "Opening" : "Closing"
  })
  card.addEventListener("openchangecomplete", (event) => {
    status.textContent = event.detail.value ? "Open" : "Closed"
  })
}

export { mount }
