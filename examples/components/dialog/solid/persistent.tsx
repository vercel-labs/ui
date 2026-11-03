import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { createSignal } from "solid-js"

function Example() {
  let chat: HTMLButtonElement | undefined
  const [messages, setMessages] = createSignal(0)
  return (
    <>
      <Dialog
        persistentElements={() => (chat ? [chat] : [])}
        onOpenChange={(open) => {
          if (open) requestAnimationFrame(() => chat?.showPopover())
          else chat?.hidePopover()
        }}
      >
        <DialogTrigger>Upgrade plan</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>Questions? The chat in the corner still works.</DialogDescription>
          </div>
          <div data-slot="row">
            <DialogClose>Not now</DialogClose>
            <DialogClose data-variant="solid" value="upgrade">
              Upgrade
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <button
        data-variant="solid"
        ref={chat}
        type="button"
        popover="manual"
        onClick={() => setMessages((count) => count + 1)}
      >
        Chat with us{messages() ? ` (${messages()})` : ""}
      </button>
    </>
  )
}

export { Example }
