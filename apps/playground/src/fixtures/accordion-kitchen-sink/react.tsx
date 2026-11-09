import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { itemsOf, kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

function Grow() {
  const [lines, setLines] = React.useState(1)
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: lines }, (_, index) => (
        <p key={index}>Line {index + 1}</p>
      ))}
      <button
        className={`${classes.button} self-start`}
        onClick={() => setLines((count) => count + 1)}
      >
        Add a line
      </button>
    </div>
  )
}

// An accordion in every item, two levels deep. Events are logged with the item's path.
function Nested({
  env,
  path,
  depth = 1,
}: {
  env: Env
  path: string
  depth?: number
}) {
  return (
    <Accordion className={classes.root} multiple>
      {["One", "Two"].map((label) => (
        <AccordionItem
          key={label}
          value={label}
          onOpenChange={(open) =>
            env.log(`${path}/${label} openChange ${open}`)
          }
          onOpenChangeComplete={(open) =>
            env.log(`${path}/${label} openChangeComplete ${open}`)
          }
        >
          <AccordionHeader className={classes.header}>
            <AccordionTrigger className={classes.trigger}>
              Level {depth}, {label.toLowerCase()}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className={classes.panel()}>
            <div className={classes.inner}>
              {depth < 2 ? (
                <Nested env={env} path={`${path}/${label}`} depth={depth + 1} />
              ) : (
                `Inside ${path}/${label}.`
              )}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// What the second item's panel holds.
function Body({
  variant,
  content,
  env,
}: {
  variant: Variant
  content: string
  env: Env
}) {
  if (variant.body === "long") {
    return Array.from({ length: 20 }, (_, index) => (
      <p key={index}>Line {index + 1}</p>
    ))
  }
  if (variant.body === "form") {
    return (
      <label className="flex flex-col">
        {content}
        <input className={classes.input} defaultValue="Ada" aria-label="Name" />
      </label>
    )
  }
  if (variant.body === "nested") {
    return (
      <Accordion className={classes.root}>
        {["Nested one", "Nested two"].map((label) => (
          <AccordionItem key={label} value={label}>
            <AccordionHeader className={classes.header}>
              <AccordionTrigger className={classes.trigger}>
                {label}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel className={classes.panel()}>
              <div className={classes.inner}>Inside {label.toLowerCase()}.</div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }
  if (variant.body === "nested-deep") {
    return <Nested env={env} path="b" />
  }
  if (variant.body === "grow") {
    return <Grow />
  }
  return content
}

function VariantAccordion({ variant, env }: { variant: Variant; env: Env }) {
  const [list, setList] = React.useState(() => itemsOf(variant))
  const [value, setValue] = React.useState<string[]>(
    variant.options?.defaultValue ?? []
  )
  return (
    <div className="flex flex-col gap-2">
      <Accordion
        className={classes.root}
        {...variant.options}
        controller={env.controller}
        {...(variant.controlled && { value })}
        onValueChange={(next, details) => {
          if (variant.cancel && next.includes(variant.cancel)) {
            details.cancel()
            env.log(`valueChange ${JSON.stringify(next)} canceled`)
            return
          }
          if (variant.controlled) {
            setValue(next)
          }
          env.log(`valueChange ${JSON.stringify(next)} (${details.reason})`)
        }}
      >
        {list.map((item, index) => (
          <AccordionItem
            key={item.value}
            className={classes.item}
            value={item.value}
            disabled={variant.disabledItems?.includes(item.value)}
            onOpenChange={(open, details) => {
              if (variant.itemCancel === item.value) {
                details.cancel()
              }
              env.log(
                `${item.value} openChange ${open}${details.canceled ? " canceled" : ""}`
              )
            }}
            onOpenChangeComplete={(open) =>
              env.log(`${item.value} openChangeComplete ${open}`)
            }
          >
            <AccordionHeader className={classes.header}>
              <AccordionTrigger
                className={classes.trigger}
                disabled={variant.disabledTriggers?.includes(item.value)}
                // The index comes from render state.
                render={
                  variant.index
                    ? (props, state) => (
                        <button {...props}>
                          {item.label}
                          <span className={classes.index}>#{state.index}</span>
                          <span aria-hidden className={classes.chevron}>
                            ▾
                          </span>
                        </button>
                      )
                    : undefined
                }
              >
                {item.label}
                <span aria-hidden className={classes.chevron}>
                  ▾
                </span>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel
              className={classes.panel(variant.animation)}
              {...(index === 1 && variant.panel)}
            >
              <div className={classes.inner}>
                {index === 1 ? (
                  <Body variant={variant} content={item.content} env={env} />
                ) : (
                  item.content
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {variant.index && (
        <button
          className={`${classes.button} self-start`}
          onClick={() => setList((items) => [...items].reverse())}
        >
          Reverse items
        </button>
      )}
      {variant.controlled && (
        <div className="flex items-center gap-2 text-xs">
          <code className="text-neutral-500">{JSON.stringify(value)}</code>
          <button
            className="rounded border border-neutral-200 px-2 py-1"
            onClick={() => setValue([])}
          >
            Collapse all
          </button>
          <button
            className="rounded border border-neutral-200 px-2 py-1"
            onClick={() => setValue(list.map((item) => item.value))}
          >
            Expand all
          </button>
        </div>
      )}
    </div>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantAccordion variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
