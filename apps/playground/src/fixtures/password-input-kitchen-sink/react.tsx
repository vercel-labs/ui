import {
  createPasswordInputController,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

function Eye() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function VariantPasswordInput({
  variant,
  env,
}: {
  variant: Variant
  env: Env
}) {
  const { fieldDisabled, ...options } = (variant.options ?? {}) as Record<
    string,
    unknown
  >
  const [visible, setVisible] = React.useState(false)
  const [controller] = React.useState(() =>
    variant.controller ? createPasswordInputController() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      ["toggleVisible()", () => controller.toggleVisible()],
      ["setVisible(true)", () => controller.setVisible(true)],
      ["isVisible()", () => controller.isVisible()],
      ['setValue("hunter22")', () => controller.setValue("hunter22")],
      ["getValue()", () => controller.getValue()],
      ["clear()", () => controller.clear()],
      ["focus()", () => controller.focus()],
    ])
  }, [controller, env])
  const input = (
    <PasswordInput
      className={classes.root}
      {...options}
      {...(variant.controlled && { visible })}
      controller={controller}
      onValueChange={(value, details) =>
        env.log(`valueChange "${value}" (${details.reason})`)
      }
      onVisibleChange={(next, details) => {
        if (variant.cancel) {
          return details.cancel()
        }
        if (variant.controlled) {
          setVisible(next)
        }
        env.log(`visibleChange ${next} (${details.reason}, ${details.source})`)
      }}
    >
      <PasswordInputControl
        className={classes.input}
        aria-label={variant.field ? undefined : "Password"}
      />
      <PasswordInputToggle
        className={classes.toggle}
        aria-label="Show password"
        render={variant.render === "span" ? <span /> : undefined}
      >
        <Eye />
      </PasswordInputToggle>
    </PasswordInput>
  )
  const withCapsLock = (
    <div className="group flex flex-col gap-1">
      {input}
      <p className={classes.capsLock}>Caps Lock is on</p>
    </div>
  )
  if (variant.field) {
    return (
      <Field disabled={!!fieldDisabled} className="flex flex-col gap-1.5">
        <FieldLabel className={classes.label}>Password</FieldLabel>
        {input}
        <FieldDescription className={classes.description}>
          At least 8 characters.
        </FieldDescription>
      </Field>
    )
  }
  if (!variant.form) {
    return variant.id === "caps-lock" ? withCapsLock : input
  }
  return (
    <form
      className="flex flex-col items-start gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        env.log(`submit password=${JSON.stringify(data.get("password"))}`)
      }}
      onReset={() => env.log("reset")}
    >
      {input}
      <div className="flex gap-2">
        <button className={classes.button}>Submit</button>
        <button type="reset" className={classes.control}>
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
        <VariantPasswordInput variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
