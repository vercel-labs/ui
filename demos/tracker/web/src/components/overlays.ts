import { confirm, type ConfirmOptions } from "@ui-sdk/web"
import { html } from "lit-html"
import { button } from "../lib/ui"
import { redraw } from "../lib/view"

let question: ConfirmOptions | null = null

const toastTemplate = document.createElement("template")
toastTemplate.innerHTML = `<ui-toast class="absolute inset-x-0 z-[calc(100-var(--toast-index))] flex items-center gap-3 overflow-hidden rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[translate,scale,opacity,height,box-shadow] duration-300 in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:var(--toast-swipe-x,0px)_calc(var(--y)+var(--toast-swipe-y,0px))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) focus-visible:ring-3 focus-visible:ring-ring/30 data-expanded:scale-100 data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] data-starting-style:opacity-0 data-starting-style:[--y:calc(var(--dir)*-100%)] data-ending-style:opacity-0 data-swiping:transition-none motion-reduce:transition-none dark:ring-foreground/10">
  <div class="grid flex-1 gap-1">
    <ui-toast-title class="font-medium"></ui-toast-title>
    <ui-toast-description class="text-muted-foreground"></ui-toast-description>
  </div>
</ui-toast>`

const toaster = {
  attributes: {
    class:
      "m-4 w-[356px] max-w-[calc(100vw-2rem)] h-(--toast-front-height) outline-none [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]",
  },
  template: toastTemplate,
}

function overlays() {
  return html`<ui-alert-dialog
      .controller=${confirm.controller}
      @payloadchange=${(event: CustomEvent<{ value: ConfirmOptions | null }>) => {
        question = event.detail.value
        redraw()
      }}
    >
      <ui-alert-dialog-content
        hidden
        class="fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-4 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 backdrop:bg-black/30 supports-backdrop-filter:backdrop:backdrop-blur-sm data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-sm motion-reduce:transition-none dark:ring-foreground/10"
      >
        <ui-alert-dialog-title class="block text-base font-medium">${question?.title}</ui-alert-dialog-title>
        <ui-alert-dialog-description class="block text-muted-foreground"
          >${question?.description}</ui-alert-dialog-description
        >
        <div class="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ui-alert-dialog-close
            ><button class=${button()}>${question?.cancelLabel ?? "Cancel"}</button></ui-alert-dialog-close
          >
          <ui-alert-dialog-close value="confirm">
            <button class=${button({ variant: "destructive" })}>
              ${question?.confirmLabel ?? "Continue"}
            </button>
          </ui-alert-dialog-close>
        </div>
      </ui-alert-dialog-content>
    </ui-alert-dialog>
    <ui-overlay-host .toast=${toaster}></ui-overlay-host>`
}

export { overlays }
