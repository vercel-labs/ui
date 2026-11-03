import "@ui-sdk/web/otp-input"
import type { OTPInputEvents, UiOTPInputElement } from "@ui-sdk/web"
import * as classes from "./classes"
import { formData, kitchenSink, type Env } from "./shell"
import { maxLengthOf, patternAttribute, presets, type Variant } from "./variants"

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

// Attributes for every option that is set: booleans by presence.
function attributes(variant: Variant) {
  const options = {
    ...variant.options,
    maxLength: maxLengthOf(variant),
    pattern: variant.pattern && patternAttribute(variant.pattern),
    debug: variant.debug,
  }
  return Object.entries(options)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([name, value]) => (value === true ? ` ${kebab(name)}` : ` ${kebab(name)}="${value}"`))
    .join("")
}

// Render functions are React and Vue only, so masked slots show their characters here.
function markup(variant: Variant) {
  const groups = variant.groups
    .map(
      (size) =>
        `<ui-otp-input-group class="${classes.group}">${`<ui-otp-input-slot class="${classes.slot}"></ui-otp-input-slot>`.repeat(size)}</ui-otp-input-group>`,
    )
    .join(`<ui-otp-input-separator class="${classes.separator}">-</ui-otp-input-separator>`)
  const invalid = variant.invalid ? ' aria-invalid="true"' : ""
  const otp = `<ui-otp-input class="${classes.root}" aria-label="Verification code"${invalid}${attributes(variant)}>${groups}</ui-otp-input>`
  if (variant.place === "fieldset") return `<fieldset disabled>${otp}</fieldset>`
  if (!variant.form) return otp
  return `<form class="${classes.form}">${otp}<div class="${classes.row}"><button class="${classes.button}">Submit</button><button type="reset" class="${classes.button}">Reset</button></div></form>`
}

// The input the element adds, which carries `aria-invalid`.
const inputOf = (otp: UiOTPInputElement) => otp.querySelector("input")

function listen(otp: UiOTPInputElement, variant: Variant, env: Env) {
  otp.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as OTPInputEvents["valuechange"]).detail
    if (variant.cancel && value.includes(variant.cancel)) return event.preventDefault()
    env.log(`valueChange "${value}" (${reason})`)
    if (variant.verify) inputOf(otp)?.removeAttribute("aria-invalid")
    // Web components are uncontrolled, so the uppercase variant writes the code back.
    if (variant.controlled === "uppercase" && value !== value.toUpperCase())
      queueMicrotask(() => (otp.value = value.toUpperCase()))
  })
  otp.addEventListener("valuecommit", (event) => {
    const { value } = (event as OTPInputEvents["valuecommit"]).detail
    env.log(`complete "${value}"`)
    if (variant.verify && value !== variant.verify) inputOf(otp)?.setAttribute("aria-invalid", "true")
  })
  const form = otp.closest("form")
  form?.addEventListener("submit", (event) => {
    event.preventDefault()
    env.log(`submit ${formData(form)}`)
  })
  form?.addEventListener("reset", () => env.log("reset"))
  form?.addEventListener(
    "invalid",
    (event) => env.log(`invalid: ${(event.target as HTMLInputElement).validationMessage}`),
    true,
  )
}

function controls(otp: UiOTPInputElement, variant: Variant, env: Env) {
  if (variant.controller)
    return env.controls([
      ["setValue(123456)", () => otp.api.setValue("123456")],
      ["clear()", () => otp.api.clear()],
      ["focus()", () => otp.api.focus()],
      ["getValue()", () => otp.api.getValue()],
    ])
  if (variant.controlled)
    env.controls(presets[variant.controlled].map(([label, next]) => [label, () => void (otp.value = next)]))
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = markup(variant)
    const otp = slot.querySelector<UiOTPInputElement>("ui-otp-input")!
    listen(otp, variant, env)
    controls(otp, variant, env)
  })
}

export { mount }
