import "@ui-sdk/web/button"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-button><button>Button</button></ui-button>
      <output data-slot="output">Pressed 0 times</output>
    </div>
  `
  const button = root.querySelector("ui-button")!
  const output = root.querySelector("output")!
  let count = 0
  button.addEventListener("action", () => {
    count++
    output.textContent = `Pressed ${count} ${count === 1 ? "time" : "times"}`
  })
}

export { mount }
