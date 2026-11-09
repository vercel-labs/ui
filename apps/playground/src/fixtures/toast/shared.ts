import { createToaster, type ToastOptions } from "@ui-sdk/core/toast"
import {
  toastDuration,
  toastFixture,
  type FixtureToast,
} from "tests/fixtures/toast.ts"

// The page's toaster, the buttons' handlers and `window.showToast`, shared by
// every framework's fixture. `record` reports to the Last action output.
function createFixtureToasts<Content>(record: (action: string) => void) {
  const toast = createToaster<Content>({ duration: toastDuration() })

  const fromFixture = ({
    title,
    description,
    action,
    pending,
    ...rest
  }: FixtureToast): ToastOptions<Content> => ({
    ...rest,
    title: title as Content,
    description: description as Content | undefined,
    action: action
      ? {
          label: action as Content,
          onAction: () => {
            record(`action:${action}`)
            if (pending) {
              return new Promise((resolve) => setTimeout(resolve, pending))
            }
          },
        }
      : undefined,
  })

  // The specs' hooks live on the window, which the server doesn't have.
  if (typeof window !== "undefined") {
    Object.assign(window, {
      showToast: (options: FixtureToast) => toast(fromFixture(options)),
      toaster: toast,
    })
  }

  const { basic, success, error, promise } = toastFixture
  return {
    toast,
    basic: () =>
      toast(
        fromFixture({
          title: basic.title,
          description: basic.description,
          action: basic.action,
        })
      ),
    success: () => toast.success(success.title as Content),
    error: () =>
      toast.error(error.title as Content, {
        description: error.description as Content,
      }),
    promise: () => {
      const params = new URLSearchParams(location.search)
      const delay = Number(params.get("promise-delay") ?? 1000)
      const fails = params.has("promise-fails")
      toast.promise(
        new Promise((resolve, reject) =>
          setTimeout(() => (fails ? reject() : resolve(undefined)), delay)
        ),
        {
          loading: promise.loading as Content,
          success: promise.success as Content,
          error: promise.error as Content,
        }
      )
    },
  }
}

export { createFixtureToasts }
