<script lang="ts">
  import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/svelte"
  import {
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationList,
    PaginationNext,
    Pagination as PaginationPrimitive,
    PaginationPrevious,
  } from "@ui-sdk/svelte/pagination"

  let {
    page,
    pageCount,
    getHref,
  }: { page: number; pageCount: number; getHref: (page: number) => string } =
    $props()

  const step =
    "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium text-foreground outline-none select-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 not-data-disabled:hover:bg-muted data-disabled:opacity-50 data-current:border-border data-current:bg-background motion-reduce:transition-none"
</script>

<PaginationPrimitive aria-label="Pages" {page} {pageCount} {getHref}>
  <PaginationList class="flex items-center gap-1">
    {#snippet children(state)}
      <PaginationItem>
        <PaginationPrevious class={step}>
          <ChevronLeft aria-hidden="true" class="size-4 rtl:rotate-180" />
          <span class="sr-only">Previous</span>
        </PaginationPrevious>
      </PaginationItem>
      {#each state.items as item (item)}
        <PaginationItem>
          {#if typeof item === "number"}
            <PaginationLink page={item} class={step} />
          {:else}
            <PaginationEllipsis
              class="flex size-8 items-center justify-center text-muted-foreground"
            >
              <Ellipsis aria-hidden="true" class="size-4" />
            </PaginationEllipsis>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext class={step}>
          <span class="sr-only">Next</span>
          <ChevronRight aria-hidden="true" class="size-4 rtl:rotate-180" />
        </PaginationNext>
      </PaginationItem>
    {/snippet}
  </PaginationList>
</PaginationPrimitive>
