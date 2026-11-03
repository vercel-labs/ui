<script lang="ts">
  import { CornerDownLeftIcon } from "@lucide/svelte"
  import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/svelte/command"

  const pages = ["Composition", "Installation", "Styling"]
</script>

<Command>
  {#snippet render({ props })}
    <div {...props}>
      <CommandInput aria-label="Search docs" placeholder="Search docs...">
        {#snippet render({ props: input })}
          <input {...input} />
        {/snippet}
      </CommandInput>
      <CommandList>
        {#each pages as page (page)}
          <CommandItem value={page}>
            {#snippet render({ props: item, state: command })}
              <a {...item} href="#{page.toLowerCase()}">
                {page}
                {#if command.highlighted}<CornerDownLeftIcon aria-hidden="true" />{/if}
              </a>
            {/snippet}
          </CommandItem>
        {/each}
      </CommandList>
    </div>
  {/snippet}
</Command>
