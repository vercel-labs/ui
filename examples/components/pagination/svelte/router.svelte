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

  let route = $state("?page=1")
  const page = $derived(Number(route.replace("?page=", "")))
  const getHref = (page: number) => `?page=${page}`

  function navigate(event: MouseEvent) {
    const link = (event.target as Element).closest("a[href]")
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    const href = link.getAttribute("href")!
    history.replaceState(history.state, "", href)
    route = href
  }
</script>

<div data-slot="stack">
  <Pagination aria-label="Pagination" pageCount={10} {page} {getHref} onclick={navigate}>
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
  <output data-slot="output">Route: {route}</output>
</div>
