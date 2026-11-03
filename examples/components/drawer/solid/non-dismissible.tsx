import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createSignal, Show } from "solid-js"

function Example() {
  const [attempt, setAttempt] = createSignal<string | null>(null)
  return (
    <Drawer
      dismissible={false}
      onDismissAttempt={(details) => setAttempt(details.reason)}
      onOpenChange={(open) => open && setAttempt(null)}
    >
      <DrawerTrigger>Write a post</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <div data-slot="grip" aria-hidden="true" />
        <div data-slot="stack">
          <DrawerTitle>New post</DrawerTitle>
          <DrawerDescription>Try to swipe it away, press outside it or press Escape.</DrawerDescription>
        </div>

        <textarea
          aria-label="Post"
          value="Shipped the new drawer today. It feels just like the system sheet."
        />

        <Show when={attempt()}>
          <div data-slot="row" role="alert">
            <span>
              You have unsaved changes.
              <span data-slot="hint">Refused: {attempt()}</span>
            </span>
            <DrawerClose>Discard</DrawerClose>
          </div>
        </Show>

        <div data-slot="stack">
          <DrawerClose data-variant="solid" value="post">
            Post
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { Example }
