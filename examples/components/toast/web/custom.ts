import "@ui-sdk/web/toast"
import { createToaster } from "@ui-sdk/web"
import { createElement, X } from "lucide"

export function mount(root: HTMLElement) {
  const toast = createToaster()

  root.innerHTML = `
    <button data-variant="secondary">New message</button>
    <ui-toast-region aria-label="Messages">
      <template>
        <ui-toast>
          <span data-slot="media" data-initials></span>
          <div data-slot="stack">
            <ui-toast-title></ui-toast-title>
            <ui-toast-description></ui-toast-description>
          </div>
          <ui-toast-action><button data-variant="secondary"></button></ui-toast-action>
          <ui-toast-close>
            <button data-variant="secondary" aria-label="Close">
              ${createElement(X, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-toast-close>
        </ui-toast>
      </template>
    </ui-toast-region>
  `
  Object.assign(root.querySelector("ui-toast-region")!, {
    toaster: toast,
    renderToast: (item: { data?: unknown }, el: HTMLElement) => {
      el.querySelector("[data-initials]")!.textContent = (item.data as { initials: string }).initials
    },
  })
  root.querySelector("button")!.addEventListener("click", () =>
    toast({
      title: "Ada Lovelace",
      description: "Can you look at the draft?",
      data: { initials: "AL" },
      action: { label: "Reply", onAction: () => toast("Reply opened") },
    }),
  )
  return () => {
    toast.dismiss()
  }
}
