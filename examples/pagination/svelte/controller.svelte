<script lang="ts">
  import {
    createPaginationController,
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationList,
  } from "@ui-sdk/svelte/pagination"
  import { Ellipsis } from "@lucide/svelte"

  const pages = createPaginationController()
  let status = $state("Page 1 of 10")

  function onPageChange(page: number) {
    status = `Page ${page} of ${pages.getPageCount()}`
  }
</script>

<div class="flex flex-col items-center gap-3">
  <Pagination
    aria-label="Pagination"
    pageCount={10}
    controller={pages}
    {onPageChange}
  >
    <PaginationList class="flex flex-wrap items-center justify-center gap-1">
      {#snippet children(state)}
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
      {/snippet}
    </PaginationList>
  </Pagination>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      type="button"
      class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
      onclick={() => pages.previous()}
    >
      Previous
    </button>
    <button
      type="button"
      class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
      onclick={() => pages.next()}
    >
      Next
    </button>
    <button
      type="button"
      class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
      onclick={() => pages.setPage(5)}
    >
      Go to page 5
    </button>
  </div>
  <output class="text-sm text-muted-foreground">{status}</output>
</div>
