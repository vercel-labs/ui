import "@ui-sdk/web/button"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <label data-slot="label">Email<input name="email" type="email" value="ada@example.com" /></label>
      <div data-slot="row">
        <ui-button><button type="submit">Subscribe</button></ui-button>
        <ui-button><button type="reset">Reset</button></ui-button>
      </div>
      <output data-slot="output"></output>
    </form>
  `
  const form = root.querySelector("form")!
  const output = root.querySelector("output")!
  let count = 0
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    count++
    output.textContent = `Submitted: ${new FormData(form).get("email")} (${count} ${count === 1 ? "time" : "times"})`
  })
  form.addEventListener("reset", () => {
    count = 0
    output.textContent = ""
  })
}

export { mount }
