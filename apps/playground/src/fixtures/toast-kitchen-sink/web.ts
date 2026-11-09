import { classes, createShell } from "./shell"

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/toast")
  const shell = createShell(root)
  shell.slot.innerHTML = `
    <ui-toast-region class="${classes.region}">
      <template>
        <ui-toast class="${classes.toast}">
          <div class="${classes.content}">
            <ui-toast-title class="${classes.title}"></ui-toast-title>
            <ui-toast-description class="${classes.description}"></ui-toast-description>
          </div>
          <ui-toast-action><button class="${classes.action}"></button></ui-toast-action>
          <ui-toast-close><button class="${classes.close}" aria-label="Close">×</button></ui-toast-close>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  const region = shell.slot.querySelector("ui-toast-region") as HTMLElement & {
    toaster?: unknown
  }
  region.toaster = shell.toast
  const apply = () => {
    const options = shell.options()
    region.setAttribute("side", options.side)
    region.setAttribute("align", options.align)
    region.setAttribute("max-visible", String(options.maxVisible))
    region.toggleAttribute("expanded", options.expanded)
    region.setAttribute("shortcut", options.shortcut ?? "none")
  }
  apply()
  shell.onChange(apply)
}

export { mount }
