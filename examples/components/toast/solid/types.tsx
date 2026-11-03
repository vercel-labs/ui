import { onCleanup } from "solid-js"
import { Toast, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/solid/toast"

export function Example() {
  const toast = createToaster()
  onCleanup(() => {
    toast.dismiss()
  })

  return (
    <>
      <div data-slot="row">
        <button data-variant="secondary" onClick={() => toast("Event has been created")}>
          Default
        </button>
        <button data-variant="secondary" onClick={() => toast.success("Event has been created")}>
          Success
        </button>
        <button
          data-variant="secondary"
          onClick={() => toast.info("Be at the area 10 minutes before the event time")}
        >
          Info
        </button>
        <button
          data-variant="secondary"
          onClick={() => toast.warning("Event start time cannot be earlier than 8am")}
        >
          Warning
        </button>
        <button data-variant="secondary" onClick={() => toast.error("Event has not been created")}>
          Error
        </button>
        <button
          data-variant="secondary"
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
      <ToastRegion toaster={toast}>
        {() => (
          <Toast>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              data-show="success"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m16 9-5.5 5.5L8 12" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              data-show="info"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              data-show="warning"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              data-show="error"
            >
              <path d="m15 9-6 6" />
              <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
              <path d="m9 9 6 6" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              data-show="loading"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <ToastTitle />
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}
