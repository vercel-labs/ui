<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <div dir="rtl">
    <Resizable>
      <ResizablePanel :default-size="50">واحد</ResizablePanel>
      <ResizableHandle aria-label="تغيير حجم واحد">
        <div />
      </ResizableHandle>
      <ResizablePanel :default-size="50">
        <Resizable orientation="vertical">
          <ResizablePanel :default-size="25">اثنان</ResizablePanel>
          <ResizableHandle aria-label="تغيير حجم اثنان">
            <div />
          </ResizableHandle>
          <ResizablePanel :default-size="75">ثلاثة</ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  </div>
</template>
