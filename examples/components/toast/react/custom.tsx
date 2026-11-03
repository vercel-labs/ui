import * as React from "react"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/react/toast"
import { XIcon } from "lucide-react"

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
              <XIcon aria-hidden="true" />
            </ToastClose>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
