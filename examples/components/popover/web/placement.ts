import "@ui-sdk/web/popover"

const sides = ["top", "right", "bottom", "left"]
const aligns = ["start", "center", "end"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="row" role="group" aria-label="Side" data-attribute="side">
          ${sides
            .map(
              (value) =>
                `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === "bottom"}">${value}</button>`,
            )
            .join("")}
        </div>
        <div data-slot="row" role="group" aria-label="Align" data-attribute="align">
          ${aligns
            .map(
              (value) =>
                `<button type="button" data-size="sm" value="${value}" aria-pressed="${value === "center"}">${value}</button>`,
            )
            .join("")}
        </div>
      </div>
      <div data-slot="stack">
<label data-slot="label">
  Side offset<span data-slot="hint">8px</span>
  <input type="range" data-setting="side-offset" min="0" max="32" value="8" />
</label>
<label data-slot="label">
  Align offset<span data-slot="hint">0px</span>
  <input type="range" data-setting="align-offset" min="-24" max="24" value="0" />
</label>
<label data-slot="label">
  Collision padding<span data-slot="hint">8px</span>
  <input type="range" data-setting="collision-padding" min="0" max="48" value="8" />
</label>
</div>
<ui-popover>
        <ui-popover-trigger><button>Placement</button></ui-popover-trigger>
        <ui-popover-content side="bottom" align="center" side-offset="8" align-offset="0" collision-padding="8">
          <ui-popover-arrow></ui-popover-arrow>
          <ui-popover-title>bottom center</ui-popover-title>
          <ui-popover-description>Choose a side, alignment, and offsets above.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>
    </div>
  `
  const content = root.querySelector("ui-popover-content")!
  for (const input of root.querySelectorAll<HTMLInputElement>("input[data-setting]")) {
    input.addEventListener("input", () => {
      content.setAttribute(input.dataset.setting!, input.value)
      input.closest("label")!.querySelector("span")!.textContent = `${input.value}px`
    })
  }
  for (const group of root.querySelectorAll<HTMLElement>("[data-attribute]"))
    group.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest("button")
      if (!button) return
      content.setAttribute(group.dataset.attribute!, button.value)
      for (const other of group.querySelectorAll("button"))
        other.setAttribute("aria-pressed", String(other === button))
      root.querySelector("ui-popover-title")!.textContent =
        `${content.getAttribute("side")} ${content.getAttribute("align")}`
    })
}

export { mount }
