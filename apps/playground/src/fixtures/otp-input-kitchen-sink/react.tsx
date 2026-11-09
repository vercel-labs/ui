import {
  createOTPInputController,
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/react/otp-input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { formData, kitchenSink, type Env } from "./shell"
import {
  groupStarts,
  maxLengthOf,
  patterns,
  presets,
  type Variant,
} from "./variants"

function Slots({ variant }: { variant: Variant }) {
  const starts = groupStarts(variant)
  return variant.groups.map((size, group) => (
    <React.Fragment key={group}>
      {group > 0 && (
        <OTPInputSeparator className={classes.separator}>-</OTPInputSeparator>
      )}
      <OTPInputGroup className={classes.group}>
        {Array.from({ length: size }, (_, offset) => (
          <OTPInputSlot
            key={offset}
            index={starts[group] + offset}
            className={classes.slot}
          >
            {variant.masked ? (state) => (state.char ? "•" : "") : undefined}
          </OTPInputSlot>
        ))}
      </OTPInputGroup>
    </React.Fragment>
  ))
}

function VariantOTPInput({ variant, env }: { variant: Variant; env: Env }) {
  const { defaultValue, ...options } = variant.options ?? {}
  const [value, setValue] = React.useState(defaultValue ?? "")
  const [invalid, setInvalid] = React.useState(!!variant.invalid)
  const [controller] = React.useState(() =>
    variant.controller ? createOTPInputController() : undefined
  )
  React.useEffect(() => {
    if (controller) {
      env.controls([
        ["setValue(123456)", () => controller.setValue("123456")],
        ["clear()", () => controller.clear()],
        ["focus()", () => controller.focus()],
        ["getValue()", () => controller.getValue()],
      ])
    } else if (variant.controlled) {
      env.controls(
        presets[variant.controlled].map(([label, next]) => [
          label,
          () => void setValue(next),
        ])
      )
    }
  }, [controller, variant, env])

  const otp = (
    <OTPInput
      className={classes.root}
      aria-label="Verification code"
      {...options}
      {...(variant.controlled ? { value } : { defaultValue })}
      maxLength={maxLengthOf(variant)}
      pattern={variant.pattern && patterns[variant.pattern]}
      controller={controller}
      debug={variant.debug}
      aria-invalid={invalid || undefined}
      onValueChange={(next, details) => {
        if (variant.cancel && next.includes(variant.cancel)) {
          return details.cancel()
        }
        env.log(`valueChange "${next}" (${details.reason})`)
        if (variant.controlled) {
          setValue(
            variant.controlled === "uppercase" ? next.toUpperCase() : next
          )
        }
        if (variant.verify) {
          setInvalid(false)
        }
      }}
      onValueCommit={(next) => {
        env.log(`complete "${next}"`)
        if (variant.verify) {
          setInvalid(next !== variant.verify)
        }
      }}
    >
      <Slots variant={variant} />
    </OTPInput>
  )
  if (variant.place === "fieldset") {
    return <fieldset disabled>{otp}</fieldset>
  }
  if (!variant.form) {
    return otp
  }
  return (
    <form
      className={classes.form}
      onSubmit={(event) => {
        event.preventDefault()
        env.log(`submit ${formData(event.currentTarget)}`)
      }}
      onReset={() => env.log("reset")}
      onInvalidCapture={(event) =>
        env.log(
          `invalid: ${(event.target as HTMLInputElement).validationMessage}`
        )
      }
    >
      {otp}
      <div className={classes.row}>
        <button className={classes.button}>Submit</button>
        <button type="reset" className={classes.button}>
          Reset
        </button>
      </div>
    </form>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantOTPInput variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
