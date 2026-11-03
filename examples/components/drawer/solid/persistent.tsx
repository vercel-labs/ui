import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createSignal } from "solid-js"

function Example() {
  let chat: HTMLButtonElement | undefined
  const [messages, setMessages] = createSignal(0)
  return (
    <>
      <Drawer
        persistentElements={() => (chat ? [chat] : [])}
        onOpenChange={(open) => {
          if (open) requestAnimationFrame(() => chat?.showPopover())
          else chat?.hidePopover()
        }}
      >
        <DrawerTrigger>Upgrade plan</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="grip" aria-hidden="true" />
          <div data-slot="stack">
            <DrawerTitle>Upgrade to Pro</DrawerTitle>
            <DrawerDescription>Questions? The chat in the corner still works.</DrawerDescription>
          </div>
          <div data-slot="stack">
            <DrawerClose data-variant="solid" value="upgrade">
              Upgrade
            </DrawerClose>
            <DrawerClose>Not now</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
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
