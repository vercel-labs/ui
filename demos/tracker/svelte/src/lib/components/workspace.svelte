<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "#ui/resizable"
  import type { Snippet } from "svelte"

  let {
    sizes,
    open,
    list,
    detail,
  }: {
    sizes: [number, number]
    open: boolean
    list: Snippet
    detail: Snippet
  } = $props()

  const cookieStorage = {
    getItem: (key: string) => {
      const value = document.cookie.match(
        new RegExp(`(?:^|; )${key}=([^;]*)`)
      )?.[1]
      return value === undefined ? null : decodeURIComponent(value)
    },
    setItem: (key: string, value: string) => {
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000`
    },
  }
</script>

<Resizable autoSaveId="tracker" storage={cookieStorage} class="min-h-0 flex-1">
  <ResizablePanel
    id="list"
    defaultSize={open ? sizes[0] : 100}
    minSize={30}
    class={open
      ? "flex min-w-0 flex-col max-md:hidden"
      : "flex min-w-0 flex-col"}
  >
    {@render list()}
  </ResizablePanel>
  {#if open}
    <ResizableHandle aria-label="Resize issue details" class="max-md:hidden" />
    <ResizablePanel
      id="detail"
      defaultSize={sizes[1]}
      minSize={28}
      class="flex min-w-0 flex-col max-md:flex-1!"
    >
      {@render detail()}
    </ResizablePanel>
  {/if}
</Resizable>
