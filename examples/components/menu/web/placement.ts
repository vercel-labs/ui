import "@ui-sdk/web/menu"

const sides = ["top", "right", "bottom", "left"]
const aligns = ["start", "center", "end"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="row" role="group" aria-label="Side">
          ${sides
            .map(
              (value) =>
                `<button data-size="sm" name="side" value="${value}" aria-pressed="${value === "bottom"}">${value}</button>`,
            )
            .join("")}
        </div>
        <div data-slot="row" role="group" aria-label="Align">
          ${aligns
            .map(
              (value) =>
                `<button data-size="sm" name="align" value="${value}" aria-pressed="${value === "start"}">${value}</button>`,
            )
            .join("")}
        </div>
      </div>
      <ui-menu>
        <ui-menu-trigger>
          <button>Placement</button>
        </ui-menu-trigger>
        <ui-menu-content side="bottom" align="start">
          <ui-menu-item>Cut</ui-menu-item>
          <ui-menu-item>Copy</ui-menu-item>
          <ui-menu-item>Paste</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
    </div>
  `
  const popup = root.querySelector("ui-menu-content")!
  for (const name of ["side", "align"]) {
    const buttons = root.querySelectorAll<HTMLButtonElement>(`button[name=${name}]`)
    for (const button of buttons)
      button.addEventListener("click", () => {
        popup.setAttribute(name, button.value)
        for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
      })
  }
}

export { mount }
