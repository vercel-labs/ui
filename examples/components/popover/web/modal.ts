import "@ui-sdk/web/popover"

const modes = [
  { label: "Non-modal", modal: "false" },
  { label: "Trap focus", modal: "trap-focus" },
  { label: "Modal", modal: "true" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        ${modes
          .map(
            (mode) => `
        <ui-popover modal="${mode.modal}">
          <ui-popover-trigger><button>${mode.label}</button></ui-popover-trigger>
          <ui-popover-content>
            <ui-popover-title>${mode.label}</ui-popover-title>
            <ui-popover-description>Press Tab, then click the box below.</ui-popover-description>
            <ui-popover-close><button>Close</button></ui-popover-close>
          </ui-popover-content>
        </ui-popover>`,
          )
          .join("")}
      </div>
      <button type="button" data-counter>Clicked 0 times. Open a popover, then click here.</button>
    </div>
  `
  let clicks = 0
  const counter = root.querySelector("[data-counter]")!
  counter.addEventListener("click", () => {
    clicks++
    counter.textContent = `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}. Open a popover, then click here.`
  })
}

export { mount }
