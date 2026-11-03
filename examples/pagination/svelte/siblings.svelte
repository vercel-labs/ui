<script lang="ts">
  import {
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
  } from "@ui-sdk/svelte/pagination"
  import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/svelte"
</script>

<Pagination
  aria-label="Pagination"
  pageCount={20}
  defaultPage={10}
  siblings={2}
>
  <PaginationList class="flex flex-wrap items-center justify-center gap-1">
    {#snippet children(state)}
      <PaginationItem>
        <PaginationPrevious
          class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
        >
          <ChevronLeft class="size-4 rtl:rotate-180" />
          <span class="sr-only">Previous</span>
        </PaginationPrevious>
      </PaginationItem>
      {#each state.items as item (item)}
        <PaginationItem>
          {#if typeof item === "number"}
            <PaginationLink
              page={item}
              class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
            />
          {:else}
            <PaginationEllipsis class="flex size-8 items-center justify-center">
              <Ellipsis class="size-4" />
            </PaginationEllipsis>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext
          class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
        >
          <span class="sr-only">Next</span>
          <ChevronRight class="size-4 rtl:rotate-180" />
        </PaginationNext>
      </PaginationItem>
    {/snippet}
  </PaginationList>
</Pagination>
