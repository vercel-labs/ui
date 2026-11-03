<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable step={5} largeStep={25}>
  <ResizablePanel defaultSize={50} minSize={10}>
    Left
  </ResizablePanel>
  <ResizableHandle aria-label="Resize left" />
  <ResizablePanel defaultSize={50} minSize={10}>
    Right
  </ResizablePanel>
</Resizable>
