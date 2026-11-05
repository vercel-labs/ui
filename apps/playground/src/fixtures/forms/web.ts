import type { CheckedState } from "@ui-sdk/core/checkbox"
import { formsFixture as f, formsOptions, serialize } from "tests/fixtures/forms.ts"

const indicator = `<ui-checkbox-indicator class="checkbox-indicator"></ui-checkbox-indicator>`
const attr = (name: string, on: boolean | undefined) => (on ? ` ${name}` : "")

function markup(options: ReturnType<typeof formsOptions>) {
  return `
    <div class="fixture">
      <button>Before</button>
      <form class="form" id="${f.formId}" aria-label="${f.formLabel}">
        <ui-field>
          <div class="row">
            <ui-checkbox class="checkbox" id="terms" name="${f.terms.name}" value="${f.terms.value}" required${attr("read-only", options.readOnly)}>${indicator}</ui-checkbox>
            <ui-field-label>${f.terms.label}</ui-field-label>
          </div>
          <ui-field-description>${f.terms.description}</ui-field-description>
          <ui-field-error class="field-error" match="valueMissing">${f.terms.error}</ui-field-error>
        </ui-field>

        <fieldset>
          <legend id="${f.toppings.legendId}">${f.toppings.legend}</legend>
          <ui-checkbox-group class="form" aria-labelledby="${f.toppings.legendId}" name="${f.toppings.name}" default-value="${f.toppings.defaultValue.join(",")}" all-values="${f.toppings.items.map((item) => item.value).join(",")}"${attr("required", options.toppingsRequired)}>
            <label><ui-checkbox class="checkbox" parent>${indicator}</ui-checkbox>${f.toppings.parent}</label>
            ${f.toppings.items
              .map(
                (item) =>
                  `<label><ui-checkbox class="checkbox" value="${item.value}">${indicator}</ui-checkbox>${item.label}</label>`,
              )
              .join("")}
          </ui-checkbox-group>
        </fieldset>

        ${f.switches
          .map(
            (item) =>
              `<label><ui-switch class="switch" name="${item.name}"${attr("default-checked", item.defaultChecked)}><ui-switch-thumb class="switch-thumb"></ui-switch-thumb></ui-switch>${item.label}</label>`,
          )
          .join("")}

        <ui-field>
          <ui-field-label>${f.plan.label}</ui-field-label>
          <ui-radio-group class="form" name="${f.plan.name}" required${attr("read-only", options.readOnly)}${attr("disabled", options.disabled)}${options.loop === false ? ` loop="false"` : ""}>
            ${f.plan.items
              .map(
                (item) =>
                  `<label><ui-radio class="radio" value="${item.value}"${attr("disabled", item.disabled)}><ui-radio-indicator class="radio-indicator"></ui-radio-indicator></ui-radio>${item.label}</label>`,
              )
              .join("")}
          </ui-radio-group>
          <ui-field-description>${f.plan.description}</ui-field-description>
          <ui-field-error class="field-error"></ui-field-error>
        </ui-field>

        <ui-field id="email-field"${options.invalid === undefined ? "" : ` invalid="${options.invalid}"`}>
          <ui-field-label>${f.email.label}</ui-field-label>
          <input type="email" name="${f.email.name}" required />
          <ui-field-description>${f.email.description}</ui-field-description>
          <ui-field-error class="field-error"></ui-field-error>
        </ui-field>
${
  options.nickname
    ? `
        <ui-field>
          <ui-field-label>${f.nickname.label}</ui-field-label>
          <input name="${f.nickname.name}" required />
        </ui-field>
`
    : ""
}
        <fieldset id="shipping">
          <legend>${f.shipping.legend}</legend>
          <label><ui-checkbox class="checkbox" name="${f.shipping.name}">${indicator}</ui-checkbox>${f.shipping.label}</label>
        </fieldset>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <label><ui-checkbox class="checkbox" form="${f.formId}" name="${f.newsletter.name}" value="${f.newsletter.value}">${indicator}</ui-checkbox>${f.newsletter.label}</label>
      <button type="button" id="toggle-shipping">Toggle shipping</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Last source"></output>
      <output role="status" aria-label="Submitted" id="submitted"></output>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const options = formsOptions()
  const template = document.createElement("template")
  template.innerHTML = markup(options)
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  if (options.plan)
    template.content.querySelector("ui-radio-group")!.setAttribute("default-value", options.plan)
  root.replaceChildren(template.content)
  await import("@ui-sdk/web/checkbox")
  await import("@ui-sdk/web/switch")
  await import("@ui-sdk/web/radio")
  await import("@ui-sdk/web/field")

  const form = root.querySelector("form")!
  const action = root.querySelector<HTMLOutputElement>('output[aria-label="Last action"]')!
  const source = root.querySelector<HTMLOutputElement>('output[aria-label="Last source"]')!

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("#submitted")!.textContent = serialize(form)
  })
  root.querySelector("#toggle-shipping")!.addEventListener("click", () => {
    const fieldset = root.querySelector<HTMLFieldSetElement>("#shipping")!
    fieldset.disabled = !fieldset.disabled
  })

  // Callbacks are DOM events: checkedchange and valuechange. Checkboxes in a
  // group report through the group.
  root.addEventListener(
    "checkedchange",
    (event) => {
      const detail = (event as CustomEvent<{ value: CheckedState; source: string }>).detail
      const target = event.target as HTMLElement
      if (target.closest("ui-checkbox-group")) return
      const name = target.getAttribute("name") ?? ""
      if (options.cancel === name) return event.preventDefault()
      action.textContent = `${name}:${String(detail.value)}`
      source.textContent = detail.source
    },
    { capture: true },
  )
  root.addEventListener(
    "valuechange",
    (event) => {
      const detail = (event as CustomEvent<{ value: string | string[] | null; source: string }>).detail
      const name = (event.target as HTMLElement).getAttribute("name") ?? ""
      if (options.cancel === name) return event.preventDefault()
      action.textContent = `${name}:${Array.isArray(detail.value) ? detail.value.join(",") : detail.value}`
      source.textContent = detail.source
    },
    { capture: true },
  )
}

export { mount }
