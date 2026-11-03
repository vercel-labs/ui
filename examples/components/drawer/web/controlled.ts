import "@ui-sdk/web/drawer"
import type { SnapPoint } from "@ui-sdk/web/drawer"

const snapPoints: SnapPoint[] = [0.25, 0.5, 1]

let count = 0

function mount(root: HTMLElement) {
  const name = `controlled-snap-point-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <label data-slot="label"><input type="checkbox" data-open />open</label>
        <fieldset data-slot="row">
          <legend>snapPoint</legend>
          ${snapPoints.map((point) => `<label data-slot="label"><input type="radio" name="${name}" value="${point}" />${point}</label>`).join("")}
        </fieldset>
      </div>
      <ui-drawer snap-points="${snapPoints.join(",")}" snap-point="0.5">
        <ui-drawer-trigger><button>Open</button></ui-drawer-trigger>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <ui-drawer-handle><button aria-label="Resize"></button></ui-drawer-handle>
          <div data-slot="stack">
            <ui-drawer-title>Controlled</ui-drawer-title>
            <ui-drawer-description></ui-drawer-description>
          </div>
          <div data-slot="row">
            ${snapPoints.map((point) => `<button type="button" data-snap="${point}">${point}</button>`).join("")}
            <ui-drawer-close><button data-variant="solid">Close</button></ui-drawer-close>
          </div>
        </ui-drawer-content>
      </ui-drawer>
      <p data-slot="hint" data-state></p>
      <ol data-slot="log"></ol>
    </div>
  `
  const drawer = root.querySelector("ui-drawer")!
  const checkbox = root.querySelector<HTMLInputElement>("[data-open]")!
  const radios = [...root.querySelectorAll<HTMLInputElement>('input[type="radio"]')]
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-snap]")]
  const description = root.querySelector("ui-drawer-description")!
  const state = root.querySelector("[data-state]")!
  const log = root.querySelector("ol")!
  let snapPoint: SnapPoint = 0.5

  const write = (line: string) => {
    log.prepend(Object.assign(document.createElement("li"), { textContent: line }))
    while (log.children.length > 8) log.lastElementChild!.remove()
  }
  const show = () => {
    const open = drawer.open
    checkbox.checked = open
    for (const radio of radios) radio.checked = radio.value === String(snapPoint)
    for (const button of buttons)
      button.setAttribute("aria-pressed", String(button.dataset.snap === String(snapPoint)))
    description.textContent = `Open at ${snapPoint}. Drag it, or pick a size, and watch the log.`
    state.textContent = `open: ${open}, snapPoint: ${snapPoint}`
  }
  const moveTo = (point: SnapPoint) => {
    drawer.snapPoint = point
    snapPoint = drawer.snapPoint ?? point
    show()
  }

  checkbox.addEventListener("change", () => (drawer.open = checkbox.checked))
  for (const radio of radios) radio.addEventListener("change", () => moveTo(Number(radio.value)))
  for (const button of buttons) button.addEventListener("click", () => moveTo(Number(button.dataset.snap)))
  drawer.addEventListener("openchange", (event) => {
    const { value, reason } = event.detail
    write(`openchange(${value}, "${reason}")`)
    queueMicrotask(() => {
      if (value) snapPoint = drawer.snapPoint ?? snapPoint
      show()
    })
  })
  drawer.addEventListener("openchangecomplete", (event) => write(`openchangecomplete(${event.detail.value})`))
  drawer.addEventListener("snappointchange", (event) => {
    const { value, reason } = event.detail
    write(`snappointchange(${value}, "${reason}")`)
    snapPoint = value
    queueMicrotask(show)
  })
  show()
}

export { mount }
