import "@ui-sdk/web/popover"

const choices: Record<string, number[]> = {
  "side-offset": [0, 8, 24],
  "align-offset": [-16, 0, 16],
  "collision-padding": [8, 48],
}
const initial: Record<string, number> = { "side-offset": 8, "align-offset": 0, "collision-padding": 8 }

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        ${Object.entries(choices)
          .map(
            ([name, values]) => `
        <div data-slot="row" role="group" aria-label="${name}" data-attribute="${name}">
          ${values
            .map(
              (value) =>
                `<button type="button" data-size="sm" value="${value}" aria-pressed="${initial[name] === value}">${name} ${value}</button>`,
            )
            .join("")}
        </div>`,
          )
          .join("")}
      </div>
      <ui-popover>
        <ui-popover-trigger><button>Offsets</button></ui-popover-trigger>
        <ui-popover-content align="start" side-offset="8" align-offset="0" collision-padding="8">
          <ui-popover-title>Offsets</ui-popover-title>
          <ui-popover-description></ui-popover-description>
        </ui-popover-content>
      </ui-popover>
    </div>
  `
  const content = root.querySelector("ui-popover-content")!
  const description = root.querySelector("ui-popover-description")!
  const describe = () => {
    const [side, align, padding] = ["side-offset", "align-offset", "collision-padding"].map((name) =>
      content.getAttribute(name),
    )
    description.textContent = `${side}px from the trigger, shifted ${align}px, ${padding}px from the edges.`
  }
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
