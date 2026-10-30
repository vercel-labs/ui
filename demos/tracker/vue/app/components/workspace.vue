<script setup lang="ts">
import { resizableStorageKey } from "@ui-sdk/vue/resizable"
import { savedSizes } from "tracker-data"
import { computed } from "vue"
import { useCookie } from "#imports"
import { Resizable, ResizableHandle, ResizablePanel } from "~/components/ui/resizable"

defineProps<{ open: boolean }>()

const saved = useCookie<string | null>(resizableStorageKey("tracker"), {
  decode: decodeURIComponent,
  encode: (value) => encodeURIComponent(value ?? ""),
  maxAge: 31536000,
})
const sizes = computed(() => savedSizes(saved.value))

const cookieStorage = {
  getItem: () => saved.value ?? null,
  setItem: (_key: string, value: string) => (saved.value = value),
}
</script>

<template>
  <Resizable auto-save-id="tracker" :storage="cookieStorage" class="min-h-0 flex-1">
    <ResizablePanel
      id="list"
      :default-size="open ? sizes[0] : 100"
      :min-size="30"
      :class="open ? 'flex min-w-0 flex-col max-md:hidden' : 'flex min-w-0 flex-col'"
    >
      <slot name="list" />
    </ResizablePanel>
    <template v-if="open">
      <ResizableHandle aria-label="Resize issue details" class="max-md:hidden" />
      <ResizablePanel
        id="detail"
        :default-size="sizes[1]"
        :min-size="28"
        class="flex min-w-0 flex-col max-md:flex-1!"
      >
        <slot name="detail" />
      </ResizablePanel>
    </template>
  </Resizable>
</template>
