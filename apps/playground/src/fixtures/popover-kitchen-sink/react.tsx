import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

function Body({ variant }: { variant: Variant }) {
  if (variant.body === "text") {
    return null
  }
  if (variant.body === "long") {
    return Array.from({ length: 30 }, (_, index) => (
      <p key={index}>Line {index + 1}</p>
    ))
  }
  if (variant.body === "nested") {
    return (
      <Popover>
        <PopoverTrigger className={classes.trigger}>More</PopoverTrigger>
        <PopoverContent className={classes.content()} sideOffset={8}>
          <PopoverArrow className={classes.arrow} />
          <PopoverTitle className={classes.title}>More options</PopoverTitle>
          <PopoverClose className={classes.button}>Done</PopoverClose>
        </PopoverContent>
      </Popover>
    )
  }
  return (
    <label className="mb-3 flex flex-col gap-1">
      Name
      <input className={classes.input} defaultValue="Ada" />
    </label>
  )
}

function VariantPopover({ variant, env }: { variant: Variant; env: Env }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex items-center gap-3">
      <Popover
        {...variant.options}
        controller={env.controller}
        container={env.container}
        {...(variant.controlled && { open })}
        onOpenChange={(next, details) => {
          if (variant.controlled) {
            setOpen(next)
          }
          env.log(`openChange ${next} (${details.reason})`)
        }}
      >
        <PopoverTrigger className={classes.trigger}>
          {variant.trigger ?? "Open"}
        </PopoverTrigger>
        <PopoverContent
          className={classes.content(variant.animation)}
          sideOffset={8}
          {...variant.content}
          anchor={env.anchor}
        >
          {variant.arrow !== false && (
            <PopoverArrow className={classes.arrow} />
          )}
          {variant.titled !== false && (
            <PopoverTitle className={classes.title}>
              {variant.title}
            </PopoverTitle>
          )}
          <PopoverDescription className={classes.description}>
            {variant.note ?? "A popover."}
          </PopoverDescription>
          <Body variant={variant} />
          <div className="flex gap-2">
            <button
              className={classes.button}
              data-save=""
              onClick={() => env.log("save")}
            >
              Save
            </button>
            <PopoverClose className={classes.button}>Close</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      {variant.controlled && (
        <label className="flex items-center gap-1.5 text-xs text-neutral-600">
          <input
            type="checkbox"
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
          />
          open
        </label>
      )}
    </div>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantPopover variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
