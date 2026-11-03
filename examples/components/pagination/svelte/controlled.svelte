<script lang="ts">
  import {
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
    type PaginationPageChangeReason,
  } from "@ui-sdk/svelte/pagination"
  import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "@lucide/svelte"

  let page = $state(1)
  let reason = $state("")

  function onPageChange(_page: number, details: { reason: PaginationPageChangeReason }) {
    reason = details.reason
  }
</script>

<div data-slot="stack">
  <Pagination bind:page aria-label="Pagination" pageCount={10} {onPageChange}>
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
  <output data-slot="output">Page {page}{reason && `, from ${reason}`}</output>
</div>
