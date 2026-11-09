import {
  hoverCardContentOptions,
  hoverCardFixture as fixture,
  hoverCardOptions,
} from "tests/fixtures/hover-card.ts"

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-hover-card>
      <ui-hover-card-trigger><a href="${fixture.href}">${fixture.trigger}</a></ui-hover-card-trigger>
      <ui-hover-card-content class="hover-card">
        <ui-hover-card-arrow class="arrow"></ui-hover-card-arrow>
        <p><strong>${fixture.name}</strong></p>
        <p>${fixture.bio}</p>
        <a href="${fixture.linkHref}">${fixture.link}</a>
      </ui-hover-card-content>
    </ui-hover-card>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
`

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  const card = root.querySelector("ui-hover-card")!
  for (const [name, value] of Object.entries(hoverCardOptions())) {
    if (name === "container") {
      card.setAttribute("container", `#${(value as HTMLElement).id}`)
    } else if (value === true) {
      card.setAttribute(kebab(name), "")
    } else {
      card.setAttribute(kebab(name), String(value))
    }
  }
  for (const [name, value] of Object.entries(hoverCardContentOptions())) {
    card.querySelector("ui-hover-card-content")!.setAttribute(name, value)
  }
  await import("@ui-sdk/web/hover-card")
  card.addEventListener("openchange", (event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: boolean; reason: string }>
    ).detail
    root.querySelector("output")!.textContent =
      `${value ? "open" : "close"}: ${reason}`
  })
}

export { mount }
