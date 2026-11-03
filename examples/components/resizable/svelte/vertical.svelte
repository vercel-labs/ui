<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable orientation="vertical">
  <ResizablePanel
    defaultSize={25}
  >Header</ResizablePanel>
  <ResizableHandle aria-label="Resize header" />
  <ResizablePanel
    defaultSize={75}
  >Content</ResizablePanel>
</Resizable>
