<script lang="ts">
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"

  let attempt = $state<string | null>(null)
</script>

<Drawer
  dismissible={false}
  onDismissAttempt={(details) => (attempt = details.reason)}
  onOpenChange={(open) => open && (attempt = null)}
>
  <DrawerTrigger>
    Write a post
  </DrawerTrigger>
  <DrawerBackdrop />
  <DrawerContent>
    <div data-slot="grip" aria-hidden="true"></div>
    <div data-slot="stack">
      <DrawerTitle>New post</DrawerTitle>
      <DrawerDescription>
        Try to swipe it away, press outside it or press Escape.
      </DrawerDescription>
    </div>
    
      <textarea
        aria-label="Post"
        value="Shipped the new drawer today. It feels just like the system sheet."
      ></textarea>
    
    
      {#if attempt}
        <div data-slot="row" role="alert">
          <span>
            You have unsaved changes.
            <span data-slot="hint">Refused: {attempt}</span>
          </span>
          <DrawerClose>
            Discard
          </DrawerClose>
        </div>
      {/if}
    
    <div data-slot="stack">
      <DrawerClose data-variant="solid" value="post">
        Post
      </DrawerClose>
    </div>
  </DrawerContent>
</Drawer>
