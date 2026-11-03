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

  let page = $state(2)
  let pageSize = $state(20)
  const total = 95
</script>

<div class="flex flex-col items-center gap-3">
  <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
    <p class="tabular-nums">
      Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
    </p>
    <label class="flex items-center gap-2">
      Rows per page
      <select
        bind:value={pageSize}
        class="h-8 cursor-default rounded-2xl border border-transparent bg-input/50 px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none"
        onchange={() => (page = 1)}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </label>
  </div>
  <Pagination
    bind:page
    aria-label="Pagination"
    {total}
    {pageSize}
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
</div>
