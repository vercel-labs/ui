import "@ui-sdk/web/hover-card"
import type { UiHoverCardElement } from "@ui-sdk/web/hover-card"

const people = [
  {
    handle: "ada",
    name: "Ada Lovelace",
    initials: "AL",
    bio: "Wrote the first published program, for the Analytical Engine.",
  },
  {
    handle: "grace",
    name: "Grace Hopper",
    initials: "GH",
    bio: "Built the first compiler and popularized the word “debugging”.",
  },
  {
    handle: "alan",
    name: "Alan Turing",
    initials: "AT",
    bio: "Described the universal machine every computer descends from.",
  },
]

type Person = (typeof people)[number]

function mount(root: HTMLElement) {
  const id = `hover-card-${crypto.randomUUID()}`
  root.innerHTML = `
    <ul></ul>
    <ui-hover-card id="${id}">
      <ui-hover-card-content align="start">
        <div data-slot="row">
          <div data-slot="avatar" aria-hidden="true" data-initials></div>
          <div data-slot="stack">
            <p data-name></p>
            <p data-bio></p>
            <a data-profile>View profile</a>
          </div>
        </div>
      </ui-hover-card-content>
    </ui-hover-card>
  `
  const list = root.querySelector("ul")!
  for (const person of people) {
    const item = document.createElement("li")
    item.dataset.slot = "row"
    const trigger = Object.assign(document.createElement("ui-hover-card-trigger"), { payload: person })
    trigger.setAttribute("for", id)
    trigger.innerHTML = `<a href="https://example.com/people/${person.handle}">${person.name}</a>`
    item.append(trigger)
    item.insertAdjacentHTML("beforeend", `<span data-slot="hint">@${person.handle}</span>`)
    list.append(item)
  }
  const card = root.querySelector<UiHoverCardElement<Person>>("ui-hover-card")!
  card.addEventListener("payloadchange", (event) => {
    const person = event.detail.value
    if (!person) {
      return
    }
    card.querySelector("[data-initials]")!.textContent = person.initials
    card.querySelector("[data-name]")!.textContent = person.name
    card.querySelector("[data-bio]")!.textContent = person.bio
    card.querySelector("[data-profile]")!.setAttribute("href", `https://example.com/people/${person.handle}`)
  })
}

export { mount }
