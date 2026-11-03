import "@ui-sdk/web/tooltip"

const controls = [
  { name: "align", values: ["start", "center", "end"], current: "start" },
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
        <span data-slot="hint">${label ?? name}</span>
        <div data-slot="row" role="group" aria-label="${label ?? name}" data-attribute="${name}">
          ${values.map((value) => `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === current}">${value}</button>`).join("")}
        </div>`,
          )
          .join("")}
      </div>
      <ui-tooltip>
        <ui-tooltip-trigger><button>Offsets</button></ui-tooltip-trigger>
        <ui-tooltip-content align="start" side-offset="4" align-offset="0" collision-padding="8"></ui-tooltip-content>
      </ui-tooltip>
    </div>
  `
  const content = root.querySelector("ui-tooltip-content")!
  const describe = () =>
    (content.textContent = `${content.getAttribute("align")}, ${content.getAttribute("side-offset")}px away, shifted ${content.getAttribute("align-offset")}px`)
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
