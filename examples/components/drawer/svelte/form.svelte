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

  let profile = $state({ name: "Pedro Duarte", username: "@peduarte" })
  let summary: HTMLDivElement | undefined = $state()
  let form: HTMLFormElement | undefined = $state()
  let tries = 0

  async function save() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    tries++
    if (tries === 1) throw new Error("The server didn't answer.")
    const data = new FormData(form)
    profile = { name: String(data.get("name")), username: String(data.get("username")) }
  }
</script>

<div data-slot="stack">
  <div bind:this={summary} tabindex="-1">
    <div>{profile.name}</div>
    <div data-slot="hint">{profile.username}</div>
  </div>
  <Drawer>
    <DrawerTrigger>
      Edit profile
    </DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent keepMounted finalFocus={() => summary}>
      <div data-slot="grip" aria-hidden="true"></div>
      <div data-slot="stack">
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>
          Make changes to your profile here. Save when you're done.
        </DrawerDescription>
      </div>
      <form data-slot="stack" bind:this={form} onsubmit={(event) => event.preventDefault()}>
        <label data-slot="label">
          Name
          <input name="name" value={profile.name} />
        </label>
        <label data-slot="label">
          Username
          <input name="username" value={profile.username} />
        </label>
      </form>
      <div data-slot="stack">
        <DrawerClose data-variant="solid" value="save" action={save}>
          {#snippet children(state)}
            {state.pending ? "Saving…" : state.error ? "Couldn't save. Try again" : "Save changes"}
          {/snippet}
        </DrawerClose>
        <DrawerClose>
          Cancel
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
</div>
