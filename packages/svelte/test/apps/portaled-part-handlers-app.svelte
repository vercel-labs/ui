<script lang="ts">
  import { Popover, PopoverContent, PopoverTrigger } from "../../src/popover"

  let { log }: { log: (entry: string) => void } = $props()
</script>

<Popover defaultOpen>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    {#snippet render({ props })}
      <div
        {...props}
        onkeydown={() => log("content:keydown")}
        onclick={() => log("content:click")}
      >
        <button onkeydown={() => log("button:keydown")}>Inside</button>
      </div>
    {/snippet}
  </PopoverContent>
</Popover>
