import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  const placements = [
    { side: "top", align: "start", label: "Top Left" },
    { side: "top", align: "center", label: "Top Center" },
    { side: "top", align: "end", label: "Top Right" },
    { side: "bottom", align: "start", label: "Bottom Left" },
    { side: "bottom", align: "center", label: "Bottom Center" },
    { side: "bottom", align: "end", label: "Bottom Right" },
  ] as const

  root.innerHTML = `
    <div data-slot="row">
      ${placements.map((item) => `<button>${item.label}</button>`).join("")}
    </div>
    <ui-toast-region side="bottom" align="end">
      <template>
        <ui-toast>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  const region = Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
  })
  root.querySelectorAll("button").forEach((button, index) => {
    const item = placements[index]
    button.addEventListener("click", () => {
      region.setAttribute("side", item.side)
      region.setAttribute("align", item.align)
      toast("Event has been created", { description: item.label })
    })
  })
  return () => {
    toast.dismiss()
  }
}
