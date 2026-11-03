<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<div dir="rtl">
  <Resizable>
    <ResizablePanel
      defaultSize={50}
    >واحد</ResizablePanel>
    <ResizableHandle aria-label="تغيير حجم واحد">
      <div></div>
    </ResizableHandle>
    <ResizablePanel defaultSize={50}>
      <Resizable orientation="vertical">
        <ResizablePanel defaultSize={25}>
          اثنان
        </ResizablePanel>
        <ResizableHandle aria-label="تغيير حجم اثنان">
          <div></div>
        </ResizableHandle>
        <ResizablePanel defaultSize={75}>
          ثلاثة
        </ResizablePanel>
      </Resizable>
    </ResizablePanel>
  </Resizable>
</div>
