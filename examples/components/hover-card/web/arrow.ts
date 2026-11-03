import "@ui-sdk/web/hover-card"

const alan = {
  handle: "alan",
  name: "Alan Turing",
  bio: "Described the universal machine every computer descends from.",
}
const groups = [
  { name: "side", values: ["top", "right", "bottom", "left"], current: "bottom" },
  { name: "align", values: ["start", "center", "end"], current: "center" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="grid">
        ${groups
          .map(
            ({ name, values, current }) => `
        <span data-slot="hint">${name}</span>
        <div data-slot="row" role="group" aria-label="${name}" data-attribute="${name}">
          ${values.map((value) => `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === current}">${value}</button>`).join("")}
        </div>`,
          )
          .join("")}
      </div>
      <ui-hover-card>
        <ui-hover-card-trigger><a href="https://example.com/people/alan">@${alan.handle}</a></ui-hover-card-trigger>
        <ui-hover-card-content side="bottom" align="center" side-offset="10" arrow-padding="12">
          <ui-hover-card-arrow></ui-hover-card-arrow>
          <p>${alan.name}</p>
          <p>${alan.bio}</p>
        </ui-hover-card-content>
      </ui-hover-card>
    </div>
  `
  const content = root.querySelector("ui-hover-card-content")!
  for (const group of root.querySelectorAll<HTMLElement>("[data-attribute]"))
    group.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest("button")
      if (!button) return
      content.setAttribute(group.dataset.attribute!, button.value)
      for (const other of group.querySelectorAll("button"))
        other.setAttribute("aria-pressed", String(other === button))
    })
}

export { mount }
