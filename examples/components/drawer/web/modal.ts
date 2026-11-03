import "@ui-sdk/web/drawer"

const modes = [
  {
    value: "true",
    label: "Modal",
    description: "The rest of the page is inert and doesn't scroll.",
  },
  {
    value: "trap-focus",
    label: "Trap focus",
    description: "Tab stays inside, and the page still scrolls and takes clicks.",
  },
  {
    value: "false",
    label: "Non-modal",
    description: "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
  },
]

let count = 0

function mount(root: HTMLElement) {
  const name = `drawer-modal-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <fieldset data-slot="row">
        <legend>modal</legend>
        ${modes.map((mode) => `<label data-slot="label"><input type="radio" name="${name}" value="${mode.value}" ${mode.value === "false" ? "checked" : ""} />${mode.label}</label>`).join("")}
        <label data-slot="label"><input type="checkbox" data-outside />closeOnOutsidePress</label>
      </fieldset>
      <ui-drawer modal="false" close-on-outside-press="false">
        <ui-drawer-trigger><button>Open notes</button></ui-drawer-trigger>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <ui-drawer-title>Notes</ui-drawer-title>
          <ui-drawer-description></ui-drawer-description>
          <textarea aria-label="Notes">Call the printer about the proofs.</textarea>
          <ui-drawer-close><button data-variant="solid">Done</button></ui-drawer-close>
        </ui-drawer-content>
      </ui-drawer>
    </div>
  `
  const drawer = root.querySelector("ui-drawer")!
  const backdrop = root.querySelector("ui-drawer-backdrop")!
  const description = root.querySelector("ui-drawer-description")!
  const select = (value: string) => {
    drawer.setAttribute("modal", value)
    backdrop.toggleAttribute("data-hidden", value !== "true")
    description.textContent = modes.find((mode) => mode.value === value)!.description
  }
  for (const radio of root.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
    radio.addEventListener("change", () => select(radio.value))
  const outside = root.querySelector<HTMLInputElement>("[data-outside]")!
  outside.addEventListener("change", () =>
    drawer.setAttribute("close-on-outside-press", String(outside.checked)),
  )
  select("false")
}

export { mount }
