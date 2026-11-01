<script lang="ts">
  import type { PhysicalSide } from "@ui-sdk/core/drawer"
  import { Drawer, DrawerContent, DrawerTitle } from "../../src/drawer"
  import { ScrollArea, ScrollAreaContent, ScrollAreaViewport } from "../../src/scroll-area"

  let { side, stickToEnd }: { side: PhysicalSide; stickToEnd: boolean } = $props()
</script>

<Drawer defaultOpen {side}>
  <DrawerContent><DrawerTitle>Move goal</DrawerTitle></DrawerContent>
</Drawer>
<ScrollArea {stickToEnd}>
  <ScrollAreaViewport aria-label="Messages"><ScrollAreaContent>Hello</ScrollAreaContent></ScrollAreaViewport>
</ScrollArea>
