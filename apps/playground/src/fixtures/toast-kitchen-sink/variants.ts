import type { Toaster, ToastOptions } from "@ui-sdk/core/toast"

// Every toast option, one button each. Toasts are global, so the page has one
// region, whose own options the controls change.
type Variant = {
  section: string
  label: string
  show: (toast: Toaster<unknown>, log: (line: string) => void) => void
}

const wait = (ms: number, fail = false) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Failed")) : resolve("done")), ms)
  )

const logged = (
  log: (line: string) => void
): Pick<ToastOptions<unknown>, "onDismiss"> => ({
  onDismiss: ({ reason }) => log(`dismiss: ${reason}`),
})

const variants: Variant[] = [
  {
    section: "Types",
    label: "Default",
    show: (toast, log) => toast("Event created", logged(log)),
  },
  {
    section: "Types",
    label: "Success",
    show: (toast, log) => toast.success("Saved", logged(log)),
  },
  {
    section: "Types",
    label: "Info",
    show: (toast, log) => toast.info("Heads up", logged(log)),
  },
  {
    section: "Types",
    label: "Warning",
    show: (toast, log) => toast.warning("Careful", logged(log)),
  },
  {
    section: "Types",
    label: "Error",
    show: (toast, log) =>
      toast.error("Upload failed", {
        description: "Too large.",
        ...logged(log),
      }),
  },
  {
    section: "Types",
    label: "Loading",
    show: (toast, log) => toast.loading("Working…", logged(log)),
  },
  {
    section: "Content",
    label: "Description",
    show: (toast, log) =>
      toast({
        title: "Event created",
        description: "Sunday at 9:00",
        ...logged(log),
      }),
  },
  {
    section: "Content",
    label: "Long text",
    show: (toast, log) =>
      toast({
        title: "A long title that wraps onto a second line in a narrow region",
        description:
          "And a description long enough to wrap twice, to check heights and offsets in the stack.",
        ...logged(log),
      }),
  },
  {
    section: "Content",
    label: "Data",
    show: (toast, log) =>
      toast({ title: "With data", data: { avatar: "AL" }, ...logged(log) }),
  },
  {
    section: "Actions",
    label: "Action",
    show: (toast, log) =>
      toast("Archived", {
        action: { label: "Undo", onAction: () => log("action: undo") },
        ...logged(log),
      }),
  },
  {
    section: "Actions",
    label: "Action kept open",
    show: (toast, log) =>
      toast("Archived", {
        action: {
          label: "Undo",
          dismiss: false,
          onAction: () => log("action: kept"),
        },
        ...logged(log),
      }),
  },
  {
    section: "Actions",
    label: "Pending action",
    show: (toast, log) =>
      toast("Deleted", {
        action: { label: "Restore", onAction: () => wait(1500) },
        ...logged(log),
      }),
  },
  {
    section: "Actions",
    label: "Failing action",
    show: (toast, log) =>
      toast("Deleted", {
        action: { label: "Restore", onAction: () => wait(800, true) },
        ...logged(log),
      }),
  },
  {
    section: "Actions",
    label: "Cancel",
    show: (toast, log) =>
      toast("Delete file?", {
        cancel: { label: "Keep", onCancel: () => log("cancel") },
        ...logged(log),
      }),
  },
  {
    section: "Actions",
    label: "Link",
    show: (toast, log) =>
      toast("Invoice created", {
        action: { label: "View", href: "#invoice" },
        ...logged(log),
      }),
  },
  {
    section: "Timing",
    label: "1 second",
    show: (toast, log) => toast("Quick", { duration: 1000, ...logged(log) }),
  },
  {
    section: "Timing",
    label: "Infinity",
    show: (toast, log) =>
      toast("Stays", { duration: Infinity, ...logged(log) }),
  },
  {
    section: "Timing",
    label: "Not dismissible",
    show: (toast, log) =>
      toast("Required", { dismissible: false, duration: 2000, ...logged(log) }),
  },
  {
    section: "Timing",
    label: "Assertive",
    show: (toast, log) =>
      toast("Urgent", { priority: "assertive", ...logged(log) }),
  },
  {
    section: "Promises",
    label: "Promise resolves",
    show: (toast) =>
      toast.promise(wait(1200), {
        loading: "Saving…",
        success: "Saved",
        error: "Failed",
      }),
  },
  {
    section: "Promises",
    label: "Promise rejects",
    show: (toast) =>
      toast.promise(() => wait(1200, true), {
        loading: "Saving…",
        success: "Saved",
        error: (error: unknown) => `${error}`,
      }),
  },
  {
    section: "Ids",
    label: "Same id",
    show: (toast, log) =>
      toast(`Updated at ${new Date().toLocaleTimeString()}`, {
        id: "same",
        ...logged(log),
      }),
  },
  {
    section: "Ids",
    label: "Update after close",
    show: (toast, log) => {
      const id = toast("Gone soon")
      toast.dismiss(id)
      log(`update after close: ${toast.update(id, "Back")}`)
    },
  },
  { section: "Ids", label: "Dismiss all", show: (toast) => toast.dismiss() },
]

export { variants }
