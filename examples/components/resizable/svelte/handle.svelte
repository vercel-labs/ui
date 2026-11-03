<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable>
  <ResizablePanel
    defaultSize={25}
  >Sidebar</ResizablePanel>
  <ResizableHandle aria-label="Resize sidebar">
    <div></div>
  </ResizableHandle>
  <ResizablePanel
    defaultSize={75}
  >Content</ResizablePanel>
</Resizable>
