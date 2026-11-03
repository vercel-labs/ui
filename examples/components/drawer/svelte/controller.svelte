<script lang="ts">
  import {
    createDrawerController,
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    type DrawerContentState,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"

  type SharedDocument = { name: string; size: string; uploading?: boolean }

  const documents: SharedDocument[] = [
    { name: "Budget.xlsx", size: "48 KB" },
    { name: "Roadmap.pdf", size: "1.2 MB" },
    { name: "Launch video.mp4", size: "310 MB", uploading: true },
  ]

  const share = createDrawerController<SharedDocument, "copy" | "email">()
  let status = $state("")

  async function shareLatest() {
    const { reason, returnValue } = await share.open({ payload: documents[1] })
    status = returnValue ? `Shared from code: ${returnValue}` : `Closed with ${reason}`
  }

  function onOpenChange(open: boolean, details: { returnValue?: string }) {
    if (!open && details.returnValue) status = `Shared: ${details.returnValue}`
  }
</script>

<div data-slot="stack">
  <ul data-slot="list">
    {#each documents as file (file.name)}
      <li data-slot="row">
        <span data-slot="row">
          {file.name}
          <span data-slot="hint">{file.uploading ? "Uploading…" : file.size}</span>
        </span>
        <DrawerTrigger
          controller={share}
          payload={file}
          disabled={file.uploading}
          aria-label={`Share ${file.name}`}
        >
          Share
        </DrawerTrigger>
      </li>
    {/each}
  </ul>
  <div data-slot="row">
    <button data-variant="solid" type="button" onclick={shareLatest}>
      Share the roadmap
    </button>
    <span data-slot="hint" role="status">{status}</span>
  </div>
  <Drawer controller={share} {onOpenChange}>
    <DrawerBackdrop />
    <DrawerContent>
      {#snippet children(state: DrawerContentState<SharedDocument>)}
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <DrawerTitle>
            Share {state.payload?.name}
          </DrawerTitle>
          <DrawerDescription>Anyone with the link can view it.</DrawerDescription>
        </div>
        <div data-slot="stack">
          <DrawerClose data-variant="solid" value="copy">
            Copy link
          </DrawerClose>
          <DrawerClose value="email">
            Send by email
          </DrawerClose>
        </div>
      {/snippet}
    </DrawerContent>
  </Drawer>
</div>
