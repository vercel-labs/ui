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

  let open = $state(false)
  let dirty = $state(false)
  let asking = $state(false)
  let post: HTMLTextAreaElement | undefined = $state()

  function close() {
    open = false
    dirty = false
    asking = false
  }

  function keepEditing() {
    asking = false
    post?.focus()
  }
</script>

<Dialog
  bind:open={() => open, (next) => (next ? (open = true) : close())}
  dismissible={!dirty}
  onDismissAttempt={() => (asking = true)}
>
  <DialogTrigger>
    Write a post
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContent>
    <div data-slot="stack">
      <DialogTitle>New post</DialogTitle>
      <DialogDescription>
        Type something, then press Escape or click outside.
      </DialogDescription>
    </div>
    <textarea
      bind:this={post}
      aria-label="Post"
      oninput={(event) => (dirty = event.currentTarget.value !== "")}
    ></textarea>
    {#if asking}
      <div data-slot="row" role="alert">
        Discard your changes?
        <div data-slot="row">
          <button type="button" onclick={keepEditing}>
            Keep editing
          </button>
          <button data-variant="solid" type="button" onclick={close}>
            Discard
          </button>
        </div>
      </div>
    {:else}
      <div data-slot="row">
        <DialogClose data-variant="solid" value="post">
          Post
        </DialogClose>
      </div>
    {/if}
  </DialogContent>
</Dialog>
