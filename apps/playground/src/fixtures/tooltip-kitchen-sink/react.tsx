import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
  type TooltipContentState,
} from "@ui-sdk/react/tooltip"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { rows, toolbar, type Variant } from "./variants"

function Content({
  variant,
  env,
  shortcut = !!(variant.options?.shortcut || variant.partShortcut),
  children,
}: {
  variant: Variant
  env: Env
  shortcut?: boolean
  children: React.ReactNode | ((state: TooltipContentState) => React.ReactNode)
}) {
  return (
    <TooltipContent
      className={classes.content(variant.animation)}
      sideOffset={6}
      {...variant.content}
      anchor={env.anchor}
    >
      {(state) => (
        <>
          {variant.arrow !== false && (
            <TooltipArrow className={classes.arrow} />
          )}
          {typeof children === "function" ? children(state) : children}
          {shortcut && (
            <TooltipShortcut
              className={classes.shortcut}
              shortcut={variant.partShortcut}
            />
          )}
        </>
      )}
    </TooltipContent>
  )
}

function Trigger({
  variant,
  onClick,
}: {
  variant: Variant
  onClick: () => void
}) {
  if (variant.compose === "link") {
    return (
      <TooltipTrigger
        render={<a href="#docs" className={classes.link} onClick={onClick} />}
      >
        {variant.trigger}
      </TooltipTrigger>
    )
  }
  if (variant.compose === "popover-trigger") {
    return (
      <TooltipTrigger
        render={
          <PopoverTrigger className={classes.trigger}>
            {variant.trigger}
          </PopoverTrigger>
        }
      />
    )
  }
  return (
    <TooltipTrigger
      className={variant.icon ? classes.iconTrigger : classes.trigger}
      aria-label={variant.label}
      aria-disabled={variant.ariaDisabled || undefined}
      onClick={onClick}
    >
      {variant.icon ? (
        <span aria-hidden="true">{variant.trigger}</span>
      ) : (
        (variant.trigger ?? "Hover me")
      )}
    </TooltipTrigger>
  )
}

function VariantTooltip({ variant, env }: { variant: Variant; env: Env }) {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const root = {
    ...variant.options,
    container: env.container,
    ...(variant.controlled && { open }),
    onOpenChange: (next: boolean, details: { reason: string }) => {
      if (variant.controlled) {
        setOpen(next)
      }
      env.log(`openChange ${next} (${details.reason})`)
    },
    onOpenChangeComplete: (next: boolean) => {
      if (!next) {
        setCopied(false)
      }
      env.log(`openChangeComplete ${next}`)
    },
  }
  const text = copied ? "Copied" : (variant.text ?? variant.title)
  const press = () => {
    if (variant.ariaDisabled) {
      return env.log("press ignored, aria-disabled")
    }
    if (variant.copy) {
      setCopied(true)
    }
    env.log("press")
  }

  if (variant.compose === "toolbar") {
    return (
      <div role="toolbar" aria-label="Formatting" className={classes.toolbar}>
        {toolbar.map((item) => (
          <Tooltip key={item.text} {...root} shortcut={item.shortcut}>
            <TooltipTrigger className={classes.toolbarButton}>
              <span aria-hidden="true">{item.icon}</span>
            </TooltipTrigger>
            <Content variant={variant} env={env} shortcut={!!item.shortcut}>
              {item.text}
            </Content>
          </Tooltip>
        ))}
      </div>
    )
  }

  if (variant.controller) {
    return (
      <div className="flex gap-2">
        {rows.map((row) => (
          <TooltipTrigger
            key={row}
            className={classes.trigger}
            controller={env.controller}
            payload={row}
          >
            {row}
          </TooltipTrigger>
        ))}
        <Tooltip {...root} controller={env.controller}>
          <Content variant={variant} env={env}>
            {(state) => `Open ${state.payload ?? "nothing"}`}
          </Content>
        </Tooltip>
      </div>
    )
  }

  if (variant.compose === "in-popover") {
    return (
      <Popover container={env.container}>
        <PopoverTrigger className={classes.trigger}>
          {variant.trigger}
        </PopoverTrigger>
        <PopoverContent className={classes.popover} sideOffset={8}>
          <PopoverTitle className={classes.popoverTitle}>
            Formatting
          </PopoverTitle>
          <div className="flex gap-2">
            <Tooltip {...root}>
              <TooltipTrigger className={classes.button}>Help</TooltipTrigger>
              <Content variant={variant} env={env}>
                Opens the help center
              </Content>
            </Tooltip>
            <PopoverClose className={classes.button}>Close</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const tooltip = (
    <Tooltip {...root}>
      <Trigger variant={variant} onClick={press} />
      <Content variant={variant} env={env}>
        {text}
      </Content>
    </Tooltip>
  )

  return (
    <div className="flex items-center gap-3">
      {variant.compose === "popover-trigger" ? (
        <Popover
          container={env.container}
          onOpenChange={(next, details) =>
            env.log(`popover openChange ${next} (${details.reason})`)
          }
        >
          {tooltip}
          <PopoverContent className={classes.popover} sideOffset={8}>
            <PopoverTitle className={classes.popoverTitle}>
              Profile settings
            </PopoverTitle>
            <PopoverClose className={classes.button}>Close</PopoverClose>
          </PopoverContent>
        </Popover>
      ) : (
        tooltip
      )}
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
        <VariantTooltip variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
