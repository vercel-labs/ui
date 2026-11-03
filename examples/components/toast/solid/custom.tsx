import { onCleanup } from "solid-js"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/solid/toast"

export function Example() {
  const toast = createToaster()
  onCleanup(() => {
    toast.dismiss()
  })

  return (
    <>
      <button
        data-variant="secondary"
        onClick={() =>
          toast({
            title: "Ada Lovelace",
            description: "Can you look at the draft?",
            data: { initials: "AL" },
            action: { label: "Reply", onAction: () => toast("Reply opened") },
          })
        }
      >
        New message
      </button>
      <ToastRegion toaster={toast} aria-label="Messages">
        {(item) => (
          <Toast
            render={(props, state) => (
              <li {...props} inert={state.leaving || (!state.expanded && state.index > 0) || undefined} />
            )}
          >
            <span data-slot="media">{(item.data as { initials: string }).initials}</span>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastAction data-variant="secondary" />
            <ToastClose data-variant="secondary" aria-label="Close">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </ToastClose>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
