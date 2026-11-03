<script lang="ts">
  import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"
  import { MediaQuery } from "svelte/reactivity"

  const isDesktop = new MediaQuery("min-width: 768px", false)
</script>

{#if isDesktop.current}
  <Dialog>
    <DialogTrigger>
      Edit profile
    </DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Save when you're done.
        </DialogDescription>
      </div>
      <div data-slot="stack">
        <label data-slot="label">
          Email
          <input type="email" value="shadcn@example.com" />
        </label>
        <label data-slot="label">
          Username
          <input value="@shadcn" />
        </label>
      </div>
      <DialogClose data-variant="solid">
        Save changes
      </DialogClose>
    </DialogContent>
  </Dialog>
{:else}
  <Drawer>
    <DrawerTrigger>
      Edit profile
    </DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <div data-slot="grip" aria-hidden="true"></div>
      <div data-slot="stack">
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>
          Make changes to your profile here. Save when you're done.
        </DrawerDescription>
      </div>
      
        <div data-slot="stack">
          <label data-slot="label">
            Email
            <input type="email" value="shadcn@example.com" />
          </label>
          <label data-slot="label">
            Username
            <input value="@shadcn" />
          </label>
        </div>
      
      <div data-slot="stack">
        <DrawerClose data-variant="solid">
          Save changes
        </DrawerClose>
        <DrawerClose>
          Cancel
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
{/if}
