import "@ui-sdk/web/field"

function register(email: string) {
  return new Promise<string | null>((resolve) =>
    setTimeout(() => resolve(email === "ada@example.com" ? "This email is already registered." : null), 400),
  )
}

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field name="email">
        <ui-field-label>Email</ui-field-label>
        <input type="email" required value="ada@example.com" />
        <ui-field-description>We'll email you a sign-in link.</ui-field-description>
        <div data-error-space><ui-field-error match="valueMissing">Enter your email address.</ui-field-error>
        <ui-field-error match="typeMismatch">Enter an email address like m@example.com.</ui-field-error>
      </div></ui-field>
      <button type="submit">Create account</button>
      <output data-slot="output"></output>
    </form>
  `
  const form = root.querySelector("form")!
  const field = root.querySelector("ui-field")!
  const input = field.querySelector("input")!
  const button = root.querySelector("button")!
  const output = root.querySelector("output")!
  let serverError: HTMLElement | null = null

  const clear = () => {
    field.removeAttribute("invalid")
    serverError?.remove()
    serverError = null
  }
  input.addEventListener("input", clear)

  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    const email = String(new FormData(form).get("email"))
    input.readOnly = true
    button.disabled = true
    button.textContent = "Creating…"
    const message = await register(email)
    input.readOnly = false
    button.disabled = false
    button.textContent = "Create account"
    clear()
    output.textContent = message ? "" : `Account created for ${email}.`
    if (!message) return
    field.setAttribute("invalid", "")
    serverError = document.createElement("ui-field-error")
    serverError.setAttribute("match", "")
    serverError.textContent = message
    field.querySelector("[data-error-space]")!.append(serverError)
  })
}
