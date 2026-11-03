import * as React from "react"
import { Toast, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/react/toast"
import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react"

export function Example() {
  const [toast] = React.useState(() => createToaster())
  React.useEffect(
    () => () => {
      toast.dismiss()
    },
    [toast],
  )

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
          onClick={() => toast("Event has been created")}
        >
          Default
        </button>
        <button
          className="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
          onClick={() => toast.success("Event has been created")}
        >
          Success
        </button>
        <button
          className="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
          onClick={() => toast.info("Be at the area 10 minutes before the event time")}
        >
          Info
        </button>
        <button
          className="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
          onClick={() => toast.warning("Event start time cannot be earlier than 8am")}
        >
          Warning
        </button>
        <button
          className="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
          onClick={() => toast.error("Event has not been created")}
        >
          Error
        </button>
        <button
          className="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
          onClick={() =>
            toast.promise(
              new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "Event" }), 2000)),
              {
                loading: "Loading...",
                success: (data) => `${data.name} has been created`,
                error: "Error",
              },
            )
          }
        >
          Promise
        </button>
      </div>
      <ToastRegion
        toaster={toast}
        className="m-4 w-[356px] max-w-[calc(100vw-2rem)] h-(--toast-front-height) outline-none [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]"
      >
        {() => (
          <Toast className="absolute inset-x-0 z-[calc(100-var(--toast-index))] flex h-(--toast-height) items-center gap-3 overflow-hidden rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-[color-mix(in_oklch,var(--popover),var(--foreground)_5%)] outline-none transition-[translate,scale,opacity,height,box-shadow] duration-400 ease-[ease] before:pointer-events-none before:absolute before:inset-0 before:bg-inherit before:opacity-0 before:[transition:inherit] in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:calc(var(--toast-swipe-x,0px)+var(--exit-x,0px))_calc(var(--y)+var(--toast-swipe-y,0px)+var(--exit-y,0px)*var(--slide,1))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) not-data-front:not-data-expanded:before:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30 data-expanded:scale-100 data-expanded:duration-200 data-expanded:ease-out data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] not-data-front:data-starting-style:opacity-0 data-front:data-starting-style:[--y:calc(var(--dir)*-100%)] data-ending-style:opacity-0 data-ending-style:duration-200 data-ending-style:ease-out motion-safe:data-ending-style:[--exit-y:calc(var(--dir)*-100%)] not-data-front:not-data-expanded:data-ending-style:[--exit-y:0px] motion-safe:data-[swipe-direction=left]:[--exit-x:-100%] data-[swipe-direction=left]:[--slide:0] motion-safe:data-[swipe-direction=right]:[--exit-x:100%] data-[swipe-direction=right]:[--slide:0] data-starting-style:transition-none data-swiping:transition-none motion-reduce:transition-opacity motion-reduce:data-starting-style:opacity-0 dark:ring-[color-mix(in_oklch,var(--popover),var(--foreground)_10%)]">
            <CircleCheck aria-hidden="true" className="hidden size-4 shrink-0 in-data-[type=success]:block" />
            <Info aria-hidden="true" className="hidden size-4 shrink-0 in-data-[type=info]:block" />
            <TriangleAlert
              aria-hidden="true"
              className="hidden size-4 shrink-0 in-data-[type=warning]:block"
            />
            <OctagonX
              aria-hidden="true"
              className="hidden size-4 shrink-0 text-foreground in-data-[type=error]:block"
            />
            <LoaderCircle
              aria-hidden="true"
              className="hidden size-4 shrink-0 animate-spin text-muted-foreground in-data-[type=loading]:block motion-reduce:animate-none"
            />
            <ToastTitle className="flex-1 font-medium" />
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
