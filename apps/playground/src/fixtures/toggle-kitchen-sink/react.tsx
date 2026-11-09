import { Button } from "@ui-sdk/react/button"
import {
  createToggleController,
  createToggleGroupController,
  Toggle,
  ToggleGroup,
} from "@ui-sdk/react/toggle"
import { Separator } from "@ui-sdk/react/separator"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { items, pendingAction, type Variant } from "./variants"

const span = <span />

function VariantToggle({ variant, env }: { variant: Variant; env: Env }) {
  const [pressed, setPressed] = React.useState(false)
  const [controller] = React.useState(() =>
    variant.controller ? createToggleController() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      ["toggle()", () => controller.toggle()],
      ["setPressed(true)", () => controller.setPressed(true)],
      ["isPressed()", () => controller.isPressed()],
      ["focus()", () => controller.focus()],
    ])
  }, [controller, env])
  return (
    <Toggle
      className={classes.toggle}
      {...variant.options}
      {...(variant.controlled && { pressed })}
      controller={controller}
      render={variant.render === "span" ? span : undefined}
      onPressedChange={(next, details) => {
        if (variant.cancel) {
          return details.cancel()
        }
        if (variant.controlled) {
          setPressed(next)
        }
        env.log(`pressedChange ${next} (${details.reason}, ${details.source})`)
      }}
    >
      Bookmark
    </Toggle>
  )
}

function VariantGroup({ variant, env }: { variant: Variant; env: Env }) {
  const [value, setValue] = React.useState<string[]>([])
  const [controller] = React.useState(() =>
    variant.controller ? createToggleGroupController() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      [
        "setValue([bold, italic])",
        () => controller.setValue(["bold", "italic"]),
      ],
      ["toggle(underline)", () => controller.toggle("underline")],
      ["getValue()", () => controller.getValue()],
      ["focus()", () => controller.focus()],
    ])
  }, [controller, env])
  return (
    <ToggleGroup
      className={classes.group}
      aria-label={variant.title}
      {...variant.options}
      {...(variant.controlled && { value })}
      controller={controller}
      onValueChange={(next, details) => {
        if (variant.cancel) {
          return details.cancel()
        }
        if (variant.controlled) {
          setValue(next)
        }
        env.log(`valueChange [${next}] (${details.reason}, ${details.source})`)
      }}
    >
      {items[variant.items ?? "alignment"].map((item) => (
        <Toggle
          key={item.value}
          className={classes.toggle}
          value={item.value}
          disabled={"disabled" in item && item.disabled}
          render={variant.render === "span" ? span : undefined}
        >
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

function VariantButton({ variant, env }: { variant: Variant; env: Env }) {
  const onClick = () => {
    env.log("click")
    if (variant.action !== "resolve" && variant.action !== "reject") {
      return
    }
    return pendingAction(variant).then(
      () => env.log("done"),
      (error: Error) => {
        env.log(`failed: ${error.message}`)
        throw error
      }
    )
  }
  const render =
    variant.render === "link" ? (
      <a href="#kitchen-sink-link" />
    ) : variant.render === "span" ? (
      span
    ) : undefined
  const button = (
    <Button
      className={classes.button}
      {...variant.options}
      type={variant.form}
      render={render}
      onClick={variant.action ? onClick : undefined}
    >
      {variant.form === "reset"
        ? "Reset"
        : variant.render === "link"
          ? "Docs"
          : "Save"}
    </Button>
  )
  if (!variant.form) {
    return button
  }
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        env.log("submit")
      }}
      onReset={() => env.log("reset")}
    >
      <input
        className="h-8 w-28 rounded-md border border-neutral-200 px-2 text-[13px]"
        aria-label="Name"
        defaultValue="Ada"
      />
      {button}
    </form>
  )
}

function VariantSeparator({ variant }: { variant: Variant }) {
  return (
    <div
      className={
        variant.options?.orientation === "vertical"
          ? classes.row
          : classes.column
      }
    >
      <span>Blog</span>
      <Separator
        className={classes.separator}
        {...variant.options}
        render={variant.render === "hr" ? <hr /> : undefined}
      />
      <span>Docs</span>
    </div>
  )
}

function VariantPart({ variant, env }: { variant: Variant; env: Env }) {
  if (variant.section === "Toggle") {
    return <VariantToggle variant={variant} env={env} />
  }
  if (variant.section === "Toggle Group") {
    return <VariantGroup variant={variant} env={env} />
  }
  if (variant.section === "Button") {
    return <VariantButton variant={variant} env={env} />
  }
  return <VariantSeparator variant={variant} />
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantPart variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
