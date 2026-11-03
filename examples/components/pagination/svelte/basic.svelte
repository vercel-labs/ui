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
  import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "@lucide/svelte"
</script>

<Pagination aria-label="Pagination" pageCount={10}>
  <PaginationList>
    {#snippet children(state)}
      <PaginationItem>
        <PaginationPrevious data-variant="ghost">
          <ChevronLeftIcon />
          <span data-slot="visually-hidden">Previous</span>
        </PaginationPrevious>
      </PaginationItem>
      {#each state.items as item (item)}
        <PaginationItem>
          {#if typeof item === "number"}
            <PaginationLink data-variant="ghost" page={item} />
          {:else}
            <PaginationEllipsis>
              <EllipsisIcon />
            </PaginationEllipsis>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext data-variant="ghost">
          <span data-slot="visually-hidden">Next</span>
          <ChevronRightIcon />
        </PaginationNext>
      </PaginationItem>
    {/snippet}
  </PaginationList>
</Pagination>
