<script lang="ts">
  import {
    createResizableController,
    Resizable,
    ResizableHandle,
    ResizablePanel,
  } from "@ui-sdk/svelte/resizable"

  const editor = createResizableController()
  let reading = $state("")

  function read() {
    reading = `${editor.getLayout().map(Math.round).join(" / ")}${editor.isCollapsed(0) ? ", collapsed" : ""}`
  }
</script>

<div data-slot="stack">
  <Resizable controller={editor}>
    <ResizablePanel id="controller-sidebar" defaultSize={30} minSize={20} collapsible>
      Sidebar
    </ResizablePanel>
    <ResizableHandle aria-label="Resize sidebar" />
    <ResizablePanel>Editor</ResizablePanel>
  </Resizable>
  <div data-slot="row">
    <button data-variant="secondary" type="button" onclick={() => editor.collapse("controller-sidebar")}>
      Collapse
    </button>
    <button data-variant="secondary" type="button" onclick={() => editor.expand("controller-sidebar")}>
      Expand
    </button>
    <button data-variant="secondary"
      type="button"
      onclick={() => editor.resize("controller-sidebar", "240px")}
    >
      240px
    </button>
    <button data-variant="secondary" type="button" onclick={read}>
      Read
    </button>
  </div>
  {#if reading}
    <output data-slot="output">{reading}</output>
  {/if}
</div>
