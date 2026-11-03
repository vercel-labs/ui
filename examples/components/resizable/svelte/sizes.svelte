<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable>
  <ResizablePanel defaultSize="200px" minSize="160px" maxSize="320px">
    Navigation
  </ResizablePanel>
  <ResizableHandle aria-label="Resize navigation">
    <div></div>
  </ResizableHandle>
  <ResizablePanel
    minSize={30}
  >Content</ResizablePanel>
</Resizable>
