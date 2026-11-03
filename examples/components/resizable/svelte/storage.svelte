<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel, type ResizableStorage } from "@ui-sdk/svelte/resizable"

  const session: ResizableStorage = {
    getItem: (key) => sessionStorage.getItem(key),
    setItem: (key, value) => sessionStorage.setItem(key, value),
  }
</script>

<Resizable autoSaveId="docs-storage" storage={session}>
  <ResizablePanel id="session-files" defaultSize={30}>
    Files
  </ResizablePanel>
  <ResizableHandle aria-label="Resize files" />
  <ResizablePanel
    id="session-editor"
  >Editor</ResizablePanel>
</Resizable>
