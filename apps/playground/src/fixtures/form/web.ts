import type { UiInputElement } from "@ui-sdk/web"
import {
  formFixture as f,
  formOptions,
  messageOf,
  save,
  serializeData,
  without,
  type FormErrors,
} from "tests/fixtures/form.ts"

function markup(options: ReturnType<typeof formOptions>) {
  return `
    <div class="fixture">
      <button>Before</button>
      <form class="form" aria-label="${f.formLabel}">
          <ui-field-set${options.disabled ? " disabled" : ""}>
            <fieldset class="form">
              <legend>${f.profile.legend}</legend>
              <ui-field-description>${f.profile.description}</ui-field-description>
              <ui-field name="${f.username.name}">
                <ui-field-label class="label">${f.username.label}</ui-field-label>
                <ui-input id="username"><input class="input" required minlength="3" /></ui-input>
                <ui-field-description>${f.username.description}</ui-field-description>
                <ui-field-error class="field-error"></ui-field-error>
              </ui-field>
              <ui-field name="${f.bio.name}">
                <ui-field-label class="label">${f.bio.label}</ui-field-label>
                <ui-textarea auto-resize><textarea class="textarea"></textarea></ui-textarea>
                <ui-field-description>${f.bio.description}</ui-field-description>
                <ui-field-error class="field-error"></ui-field-error>
              </ui-field>
            </fieldset>
          </ui-field-set>
          <ui-field-set id="contact">
            <fieldset class="form">
              <legend>${f.contact.legend}</legend>
              <ui-field name="${f.email.name}">
                <ui-field-label class="label">${f.email.label}</ui-field-label>
                <ui-input id="email"><input class="input" type="email" value="${f.email.defaultValue}" /></ui-input>
                <ui-field-error class="field-error"></ui-field-error>
              </ui-field>
              <ui-field name="${f.website.name}">
                <ui-field-label class="label">${f.website.label}</ui-field-label>
                <ui-input-group class="input-group">
                  <span>${f.website.prefix}</span>
                  <ui-input id="website"><input class="input" /></ui-input>
                  <ui-input-clear><button aria-label="${f.website.clear}">×</button></ui-input-clear>
                </ui-input-group>
              </ui-field>
            </fieldset>
          </ui-field-set>
          <div class="row">
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
          </div>
      </form>
      <button type="button" id="toggle-contact">Toggle contact</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Submitted"></output>
    </div>
  `
}

// Shows the server's message on each field it names, through the field's
// `invalid`, and gives the others back to the browser's own validation. An
// error with text of its own keeps it; an empty one shows the browser's message.
function showErrors(root: HTMLElement, errors: FormErrors | undefined) {
  for (const field of Array.from(
    root.querySelectorAll<HTMLElement>("ui-field")
  )) {
    const name = field.getAttribute("name")!
    const message = messageOf(errors, name)
    field.toggleAttribute("invalid", !!message)
    const error = field.querySelector<HTMLElement>("ui-field-error")
    if (!error) {
      continue
    }
    if (message) {
      delete error.dataset.message
      error.textContent = message
    } else if (!("message" in error.dataset)) {
      error.textContent = ""
      error.dataset.message = ""
    }
  }
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/input")
  const options = formOptions()
  const template = document.createElement("template")
  template.innerHTML = markup(options)
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  if (options.submitShortcut) {
    template.content
      .querySelector("ui-textarea")!
      .setAttribute("submit-shortcut", options.submitShortcut)
  }
  root.replaceChildren(template.content)
  const form = root.querySelector("form")!
  const [lastAction, submitted] = Array.from(root.querySelectorAll("output"))
  let errors = options.errors
  const setErrors = (next: FormErrors | undefined) => {
    errors = next
    showErrors(root, errors)
  }
  setErrors(errors)

  let pending = false
  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (pending) {
      return
    }
    const data = new FormData(form)
    pending = true
    try {
      const result = await save(data, options.action)
      setErrors(result)
      if (!result) {
        submitted.textContent = serializeData(data)
      }
    } catch {
      // The fake server failed. The page keeps what it showed.
    } finally {
      pending = false
    }
  })
  form.addEventListener("reset", () => setErrors(undefined))

  const report = (name: string) => (event: Event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: string; reason: string }>
    ).detail
    if (name === f.username.name && options.noDigits && /\d/.test(value)) {
      return event.preventDefault()
    }
    lastAction.textContent = `${name}:${value}:${reason}`
    setErrors(without(errors, name))
  }
  ;(root.querySelector("#username") as UiInputElement).addEventListener(
    "valuechange",
    report(f.username.name)
  )
  ;(root.querySelector("#email") as UiInputElement).addEventListener(
    "valuechange",
    report(f.email.name)
  )
  ;(root.querySelector("#website") as UiInputElement).addEventListener(
    "valuechange",
    report(f.website.name)
  )
  root.querySelector("#toggle-contact")!.addEventListener("click", () => {
    root.querySelector("#contact")!.toggleAttribute("disabled")
  })
}

export { mount }
