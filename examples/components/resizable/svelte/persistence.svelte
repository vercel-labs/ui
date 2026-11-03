<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable autoSaveId="docs-persistence">
  <ResizablePanel id="docs-sidebar" defaultSize={30} minSize={20}>
    Sidebar
  </ResizablePanel>
  <ResizableHandle aria-label="Resize sidebar">
    <div></div>
  </ResizableHandle>
  <ResizablePanel id="docs-content">
    Content
  </ResizablePanel>
</Resizable>
