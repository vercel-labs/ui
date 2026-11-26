<script lang="ts">
  import { Button } from "../../src/button"
  import { Popover, PopoverContent, PopoverTrigger } from "../../src/popover"

  let { log }: { log: (entry: string) => void } = $props()
</script>

<Popover defaultOpen>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    {#snippet render({ props })}
      <div {...props} onclick={() => log("content:click")}>
        <Button onclick={() => log("button:click")}><span>Save</span></Button>
      </div>
    {/snippet}
  </PopoverContent>
</Popover>
