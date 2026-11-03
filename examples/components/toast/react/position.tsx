import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/react/toast"
import * as React from "react"

export function Example() {
  const [toast] = React.useState(() => createToaster())

  const placements = [
    { side: "top", align: "start", label: "Top Left" },
    { side: "top", align: "center", label: "Top Center" },
    { side: "top", align: "end", label: "Top Right" },
    { side: "bottom", align: "start", label: "Bottom Left" },
    { side: "bottom", align: "center", label: "Bottom Center" },
    { side: "bottom", align: "end", label: "Bottom Right" },
  ] as const
  React.useEffect(
    () => () => {
      toast.dismiss()
    },
    [toast],
  )

  const [placement, setPlacement] = React.useState<(typeof placements)[number]>(placements[5])
  return (
    <>
      <div data-slot="row">
        {placements.map((item) => (
          <button
            data-variant="secondary"
            key={item.label}
            onClick={() => {
              setPlacement(item)
              toast("Event has been created", { description: item.label })
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ToastRegion toaster={toast} side={placement.side} align={placement.align}>
        {(item) => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
