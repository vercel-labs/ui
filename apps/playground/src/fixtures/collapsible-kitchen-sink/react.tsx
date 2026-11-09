import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { content, tree, type TreeNode, type Variant } from "./variants"

function Grow() {
  const [lines, setLines] = React.useState(1)
  return (
    <>
      {Array.from({ length: lines }, (_, index) => (
        <p key={index}>Line {index + 1}</p>
      ))}
      <button
        className={`${classes.button} self-start`}
        onClick={() => setLines((count) => count + 1)}
      >
        Add a line
      </button>
    </>
  )
}

// What the panel holds.
function Body({ variant }: { variant: Variant }) {
  if (variant.body === "long") {
    return Array.from({ length: 20 }, (_, index) => (
      <p key={index}>Line {index + 1}</p>
    ))
  }
  if (variant.body === "form") {
    return (
      <label className="flex flex-col">
        {content.text}
        <input className={classes.input} defaultValue="Ada" aria-label="Name" />
      </label>
    )
  }
  if (variant.body === "grow") {
    return <Grow />
  }
  return content.text
}

// A folder is a collapsible holding its children. Files are plain rows.
function Folder({ node, env }: { node: TreeNode; env: Env }) {
  if (!node.children) {
    return <div className={classes.treeFile}>{node.name}</div>
  }
  return (
    <Collapsible
      onOpenChange={(open, details) =>
        env.log(`${node.name} openChange ${open} (${details.reason})`)
      }
      onOpenChangeComplete={(open) =>
        env.log(`${node.name} openChangeComplete ${open}`)
      }
    >
      <CollapsibleTrigger className={classes.treeTrigger}>
        <span aria-hidden className={classes.treeChevron}>
          ▸
        </span>
        {node.name}/
      </CollapsibleTrigger>
      <CollapsiblePanel className={classes.treePanel}>
        {node.children.map((child) => (
          <Folder key={child.name} node={child} env={env} />
        ))}
      </CollapsiblePanel>
    </Collapsible>
  )
}

function VariantCollapsible({ variant, env }: { variant: Variant; env: Env }) {
  const [open, setOpen] = React.useState(variant.options?.defaultOpen ?? false)
  if (variant.body === "tree") {
    return (
      <div className="w-full rounded-lg border border-neutral-200 bg-white p-2">
        <Folder node={tree} env={env} />
      </div>
    )
  }
  const trigger =
    variant.render?.trigger === "div" ? (
      <div />
    ) : variant.render?.trigger === "link" ? (
      <a href="#collapsible-link" />
    ) : undefined
  return (
    <div className="flex flex-col gap-2">
      <Collapsible
        className={classes.root}
        {...variant.options}
        controller={env.controller}
        {...(variant.controlled && { open })}
        onOpenChange={(next, details) => {
          if (variant.cancel === (next ? "open" : "close")) {
            details.cancel()
            env.log(`openChange ${next} canceled`)
            return
          }
          if (variant.controlled) {
            setOpen(next)
          }
          env.log(`openChange ${next} (${details.reason})`)
        }}
        onOpenChangeComplete={(next) => env.log(`openChangeComplete ${next}`)}
      >
        <CollapsibleTrigger className={classes.trigger} render={trigger}>
          {content.trigger}
          <span aria-hidden className={classes.chevron}>
            ▾
          </span>
        </CollapsibleTrigger>
        <CollapsiblePanel
          className={classes.panel(variant.animation)}
          {...variant.panel}
          render={variant.render?.panel === "section" ? <section /> : undefined}
        >
          <div className={classes.inner}>
            <Body variant={variant} />
          </div>
        </CollapsiblePanel>
      </Collapsible>
      {variant.controlled && (
        <div className="flex items-center gap-2 text-xs">
          <code className="text-neutral-500">open={String(open)}</code>
          <button className={classes.button} onClick={() => setOpen(true)}>
            Open
          </button>
          <button className={classes.button} onClick={() => setOpen(false)}>
            Close
          </button>
          <button
            className={classes.button}
            onClick={() => setOpen((value) => !value)}
          >
            Toggle
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
        <VariantCollapsible variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
