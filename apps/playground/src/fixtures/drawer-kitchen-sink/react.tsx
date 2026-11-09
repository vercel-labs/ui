import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOutlet,
  DrawerTitle,
  DrawerTrigger,
  type SnapPoint,
} from "@ui-sdk/react/drawer"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import {
  kitchenSink,
  openChangeMessage,
  refuses,
  snapPointChangeMessage,
  snapPointsOf,
  type Env,
} from "./shell"
import { flakyAction, type Variant } from "./variants"

function Body({
  variant,
  onSnap,
}: {
  variant: Variant
  onSnap: (point: SnapPoint) => void
}) {
  if (variant.body === "scroll") {
    return (
      <ul className={classes.scroll} aria-label="Activity" tabIndex={0}>
        {Array.from({ length: 40 }, (_, index) => (
          <li key={index} className={classes.scrollItem}>
            Day {index + 1}
          </li>
        ))}
      </ul>
    )
  }
  if (variant.body === "tall") {
    return Array.from({ length: 60 }, (_, index) => (
      <p key={index}>Paragraph {index + 1}</p>
    ))
  }
  if (variant.body === "form") {
    return (
      <div className="flex flex-col gap-3">
        <label className={classes.field}>
          Name
          <input className={classes.input} defaultValue="Ada" />
        </label>
        <label className={classes.field}>
          Email
          <input className={classes.input} type="email" />
        </label>
        <label className={classes.field}>
          Notes
          <textarea className={classes.textarea} />
        </label>
      </div>
    )
  }
  if (variant.body === "snap-buttons") {
    return (
      <div className={classes.snapButtons}>
        {snapPointsOf(variant).map((point) => (
          <button
            key={String(point)}
            className={classes.button}
            onClick={() => onSnap(point)}
          >
            {String(point)}
          </button>
        ))}
      </div>
    )
  }
  return null
}

// A drawer opened from inside another, `depth` more levels deep.
function Nested({
  variant,
  depth,
  env,
}: {
  variant: Variant
  depth: number
  env: Env
}) {
  const level = (variant.nested ?? 0) - depth + 2
  return (
    <Drawer
      side={variant.options?.side}
      onOpenChange={(next, details) =>
        env.log(`level ${level} ${openChangeMessage(next, details)}`)
      }
    >
      <DrawerTrigger className={classes.trigger}>
        Open level {level}
      </DrawerTrigger>
      <DrawerBackdrop className={classes.backdrop} />
      <DrawerContent className={classes.content()}>
        <DrawerHandle className={classes.handle} aria-label="Resize" />
        <div className={classes.header}>
          <DrawerTitle className={classes.title}>Level {level}</DrawerTitle>
          <DrawerDescription className={classes.description}>
            The one beneath scales back.
          </DrawerDescription>
        </div>
        <div className={classes.actions}>
          {depth > 1 && (
            <Nested variant={variant} depth={depth - 1} env={env} />
          )}
          <DrawerClose className={classes.button}>Close</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function VariantDrawer({ variant, env }: { variant: Variant; env: Env }) {
  const [open, setOpen] = React.useState(false)
  const [snapPoint, setSnapPoint] = React.useState<SnapPoint>(
    snapPointsOf(variant)[0]
  )
  const { controlled } = variant
  const short = variant.body === "short"
  const outlet = variant.outlet && (
    <DrawerOutlet
      className={classes.outlet}
      keyframes={variant.outlet.keyframes}
      {...(!variant.outlet.inside && { controller: env.controller })}
    >
      Page behind
    </DrawerOutlet>
  )
  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3">
        <Drawer
          {...variant.options}
          controller={env.controller}
          container={env.container}
          {...(controlled?.open && { open })}
          {...(controlled?.snapPoint && { snapPoint })}
          onOpenChange={(next, details) => {
            if (controlled?.open) {
              setOpen(next)
            }
            env.log(openChangeMessage(next, details))
          }}
          onOpenChangeComplete={(next) => env.log(`openChangeComplete ${next}`)}
          onSnapPointChange={(point, details) => {
            const refused = refuses(variant, point)
            if (refused) {
              details.cancel()
            } else if (controlled?.snapPoint) {
              setSnapPoint(point)
            }
            env.log(snapPointChangeMessage(point, details, refused))
          }}
          onDismissAttempt={(details) =>
            env.log(`dismissAttempt (${details.reason})`)
          }
        >
          <DrawerTrigger className={classes.trigger}>
            {variant.trigger ?? "Open"}
          </DrawerTrigger>
          {variant.outlet?.inside && outlet}
          <DrawerBackdrop className={classes.backdrop} />
          <DrawerContent
            className={classes.content(variant.size)}
            {...variant.content}
          >
            {!short && (
              <DrawerHandle className={classes.handle} aria-label="Resize" />
            )}
            <div className={classes.header}>
              <DrawerTitle className={classes.title}>
                {variant.title}
              </DrawerTitle>
              {!short && (
                <DrawerDescription className={classes.description}>
                  {variant.note ?? "A drawer."}
                </DrawerDescription>
              )}
            </div>
            <Body
              variant={variant}
              onSnap={(point) =>
                controlled?.snapPoint
                  ? setSnapPoint(point)
                  : env.controller.setSnapPoint(point)
              }
            />
            <div className={classes.actions}>
              {variant.nested && (
                <Nested variant={variant} depth={variant.nested} env={env} />
              )}
              {variant.action && (
                <DrawerClose
                  className={classes.primary}
                  value="saved"
                  action={flakyAction}
                >
                  {(state) =>
                    state.pending ? "Saving…" : state.error ? "Retry" : "Save"
                  }
                </DrawerClose>
              )}
              <DrawerClose className={classes.button}>Close</DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
        {controlled?.open && (
          <label className="flex items-center gap-1.5 text-xs text-neutral-600">
            <input
              type="checkbox"
              checked={open}
              onChange={(event) => setOpen(event.target.checked)}
            />
            open
          </label>
        )}
        {controlled?.snapPoint && (
          <span className="text-xs text-neutral-600">
            snapPoint={JSON.stringify(snapPoint)}
          </span>
        )}
      </div>
      {variant.outlet && !variant.outlet.inside && outlet}
    </>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantDrawer variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
