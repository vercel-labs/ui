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

  let page = $state(2)
  let pageSize = $state(20)
  const total = 95
</script>

<div data-slot="stack">
  <div data-slot="row">
    <p>
      Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
    </p>
    <label data-slot="label">
      Rows per page
      <select bind:value={pageSize} onchange={() => (page = 1)}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </label>
  </div>
  <Pagination bind:page aria-label="Pagination" {total} {pageSize}>
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
</div>
