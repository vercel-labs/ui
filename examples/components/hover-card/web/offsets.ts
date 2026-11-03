import "@ui-sdk/web/hover-card"

const controls = [
  { name: "side-offset", label: "sideOffset", values: ["4", "12", "24"], current: "4" },
  { name: "align-offset", label: "alignOffset", values: ["-16", "0", "16"], current: "0" },
  { name: "collision-padding", label: "collisionPadding", values: ["8", "48"], current: "8" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="grid">
        ${controls
          .map(
            ({ name, label, values, current }) => `
        <span data-slot="hint">${label}</span>
        <div data-slot="row" role="group" aria-label="${label}" data-attribute="${name}">
          ${values.map((value) => `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === current}">${value}</button>`).join("")}
        </div>`,
          )
          .join("")}
      </div>
      <ui-hover-card>
        <ui-hover-card-trigger><a href="https://example.com/offsets">Offsets</a></ui-hover-card-trigger>
        <ui-hover-card-content align="start" side-offset="4" align-offset="0" collision-padding="8">
          <p>Offsets</p>
          <p data-slot="hint"></p>
        </ui-hover-card-content>
      </ui-hover-card>
    </div>
  `
  const content = root.querySelector("ui-hover-card-content")!
  const describe = () =>
    (content.querySelector("p + p")!.textContent =
      `${content.getAttribute("side-offset")}px from the link, shifted ${content.getAttribute("align-offset")}px, ${content.getAttribute("collision-padding")}px from the edges.`)
  describe()
  for (const group of root.querySelectorAll<HTMLElement>("[data-attribute]"))
    group.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest("button")
      if (!button) return
      content.setAttribute(group.dataset.attribute!, button.value)
      for (const other of group.querySelectorAll("button"))
        other.setAttribute("aria-pressed", String(other === button))
      describe()
    })
}

export { mount }
