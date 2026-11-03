<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable defaultLayout={[30, 70]}>
  <ResizablePanel>Files</ResizablePanel>
  <ResizableHandle aria-label="Resize files" />
  <ResizablePanel>Editor</ResizablePanel>
</Resizable>
