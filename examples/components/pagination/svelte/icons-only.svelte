<script lang="ts">
  import {
    Pagination,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
  } from "@ui-sdk/svelte/pagination"
  import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "@lucide/svelte"
</script>

<Pagination aria-label="Pagination" pageCount={10}>
  <PaginationList>
    {#snippet children(state)}
      <PaginationItem>
        <PaginationFirst data-variant="ghost" aria-label="First page">
          <ChevronsLeftIcon />
        </PaginationFirst>
      </PaginationItem>
      <PaginationItem>
        <PaginationPrevious data-variant="ghost" aria-label="Previous page">
          <ChevronLeftIcon />
        </PaginationPrevious>
      </PaginationItem>
      <PaginationItem>
        <span aria-live="polite">Page {state.page} of {state.pageCount}</span>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext data-variant="ghost" aria-label="Next page">
          <ChevronRightIcon />
        </PaginationNext>
      </PaginationItem>
      <PaginationItem>
        <PaginationLast data-variant="ghost" aria-label="Last page">
          <ChevronsRightIcon />
        </PaginationLast>
      </PaginationItem>
    {/snippet}
  </PaginationList>
</Pagination>
