import { onCleanup } from "solid-js"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/solid/toast"
import { createSignal, For } from "solid-js"

export function Example() {
  const toast = createToaster()

  const placements = [
    { side: "top", align: "start", label: "Top Left" },
    { side: "top", align: "center", label: "Top Center" },
    { side: "top", align: "end", label: "Top Right" },
    { side: "bottom", align: "start", label: "Bottom Left" },
    { side: "bottom", align: "center", label: "Bottom Center" },
    { side: "bottom", align: "end", label: "Bottom Right" },
  ] as const
  onCleanup(() => {
    toast.dismiss()
  })

  const [placement, setPlacement] = createSignal<(typeof placements)[number]>(placements[5])
  return (
    <>
      <div data-slot="row">
        <For each={placements}>
          {(item) => (
            <button
              onClick={() => {
                setPlacement(item)
                toast("Event has been created", { description: item.label })
              }}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>
      <ToastRegion toaster={toast} side={placement().side} align={placement().align}>
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
