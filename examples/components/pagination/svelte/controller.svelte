<script lang="ts">
  import {
    createPaginationController,
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationList,
  } from "@ui-sdk/svelte/pagination"
  import { EllipsisIcon } from "@lucide/svelte"

  const pages = createPaginationController()
  let status = $state("Page 1 of 10")

  function onPageChange(page: number) {
    status = `Page ${page} of ${pages.getPageCount()}`
  }
</script>

<div data-slot="stack">
  <Pagination aria-label="Pagination" pageCount={10} controller={pages} {onPageChange}>
    <PaginationList>
      {#snippet children(state)}
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
      {/snippet}
    </PaginationList>
  </Pagination>
  <div data-slot="row">
    <button data-variant="secondary" type="button" onclick={() => pages.previous()}>
      Previous
    </button>
    <button data-variant="secondary" type="button" onclick={() => pages.next()}>
      Next
    </button>
    <button data-variant="secondary" type="button" onclick={() => pages.setPage(5)}>
      Go to page 5
    </button>
  </div>
  <output data-slot="output">{status}</output>
</div>
