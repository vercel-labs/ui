import "@ui-sdk/web/alert-dialog"
import "@ui-sdk/web/overlays"
import {
  createConfirm,
  createOverlays,
  createToaster,
  type ConfirmOptions,
  type UiAlertDialogElement,
} from "@ui-sdk/web"

export function mount(root: HTMLElement) {
  const overlays = createOverlays()
  const toast = createToaster({ overlays })
  const confirm = createConfirm({ overlays })

  let projects = ["Acme", "Globex"]
  root.innerHTML = `<ul class="min-h-24 w-full max-w-xs divide-y divide-border"></ul>`
  const list = root.querySelector("ul")!
  function render() {
    list.innerHTML = projects
      .map(
        (name) => `
          <li class="flex items-center gap-3 py-2 text-sm">
            ${name}
            <button data-project="${name}" class="ms-auto inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50">Delete</button>
          </li>
        `,
      )
      .join("")
  }
  async function remove(name: string) {
    const yes = await confirm({
      title: `Delete ${name}?`,
      description: "This permanently deletes the project and its files.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
    })
    if (!yes) return
    const index = projects.indexOf(name)
    projects = projects.filter((project) => project !== name)
    render()
    list.querySelectorAll("button")[Math.min(index, projects.length - 1)]?.focus()
    toast.success(`${name} deleted`, { priority: "assertive" })
  }
  list.addEventListener("click", (event) => {
    const name = (event.target as Element).closest("button")?.dataset.project
    if (name) remove(name)
  })
  render()

  root.insertAdjacentHTML(
    "beforeend",
    `
    <ui-alert-dialog>
      <ui-alert-dialog-content class="fixed top-1/2 left-1/2 grid w-full max-w-xs -translate-1/2 gap-4 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 backdrop:bg-black/30 supports-backdrop-filter:backdrop:backdrop-blur-sm data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-md dark:ring-foreground/10 motion-reduce:transition-none">
        <ui-alert-dialog-title class="text-lg leading-none font-medium"></ui-alert-dialog-title>
        <ui-alert-dialog-description class="text-sm text-balance text-muted-foreground md:text-pretty"></ui-alert-dialog-description>
        <div class="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ui-alert-dialog-close><button class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"></button></ui-alert-dialog-close>
          <ui-alert-dialog-close value="confirm"><button class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"></button></ui-alert-dialog-close>
        </div>
      </ui-alert-dialog-content>
    </ui-alert-dialog>
  `,
  )
  const dialog = root.querySelector<UiAlertDialogElement<ConfirmOptions>>("ui-alert-dialog")!
  dialog.controller = confirm.controller
  dialog.addEventListener("payloadchange", (event) => {
    const question = event.detail.value
    const [cancel, agree] = dialog.querySelectorAll("button")
    dialog.querySelector("ui-alert-dialog-title")!.textContent = question?.title ?? ""
    dialog.querySelector("ui-alert-dialog-description")!.textContent = question?.description ?? ""
    cancel.textContent = question?.cancelLabel ?? "Cancel"
    agree.textContent = question?.confirmLabel ?? "Continue"
  })

  const template = document.createElement("template")
  template.innerHTML = `
    <ui-toast class="absolute inset-x-0 z-[calc(100-var(--toast-index))] flex h-(--toast-height) items-center gap-3 overflow-hidden rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-[color-mix(in_oklch,var(--popover),var(--foreground)_5%)] outline-none transition-[translate,scale,opacity,height,box-shadow] duration-400 ease-[ease] before:pointer-events-none before:absolute before:inset-0 before:bg-inherit before:opacity-0 before:[transition:inherit] in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:calc(var(--toast-swipe-x,0px)+var(--exit-x,0px))_calc(var(--y)+var(--toast-swipe-y,0px)+var(--exit-y,0px)*var(--slide,1))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) not-data-front:not-data-expanded:before:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30 data-expanded:scale-100 data-expanded:duration-200 data-expanded:ease-out data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] not-data-front:data-starting-style:opacity-0 data-front:data-starting-style:[--y:calc(var(--dir)*-100%)] data-ending-style:opacity-0 data-ending-style:duration-200 data-ending-style:ease-out motion-safe:data-ending-style:[--exit-y:calc(var(--dir)*-100%)] not-data-front:not-data-expanded:data-ending-style:[--exit-y:0px] motion-safe:data-[swipe-direction=left]:[--exit-x:-100%] data-[swipe-direction=left]:[--slide:0] motion-safe:data-[swipe-direction=right]:[--exit-x:100%] data-[swipe-direction=right]:[--slide:0] data-starting-style:transition-none data-swiping:transition-none motion-reduce:transition-opacity motion-reduce:data-starting-style:opacity-0 dark:ring-[color-mix(in_oklch,var(--popover),var(--foreground)_10%)]">
      <div class="grid flex-1 gap-1">
        <ui-toast-title class="font-medium"></ui-toast-title>
        <ui-toast-description></ui-toast-description>
      </div>
    </ui-toast>
  `
  const host = Object.assign(document.createElement("ui-overlay-host"), {
    overlays,
    toast: {
      attributes: {
        class:
          "m-4 w-[356px] max-w-[calc(100vw-2rem)] h-(--toast-front-height) outline-none [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]",
      },
      template,
    },
  })
  root.append(host)
  return () => {
    toast.dismiss()
  }
}
