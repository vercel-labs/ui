<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
  } from "@ui-sdk/svelte"
  import RouterLink from "./RouterLink.svelte"

  let action = $state("")

  function onPageChange(page: number, details: ChangeDetails) {
    if (page === 4) return details.cancel()
    action = `page: ${page}`
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Pagination aria-label="Results pages" pageCount={5} getHref={(page) => `#results-${page}`} {onPageChange}>
    <PaginationList class="pagination-list">
      {#snippet children(state)}
        <PaginationItem>
          <PaginationPrevious class="pagination-step">
            {#snippet render({ props })}
              <RouterLink {...props}>Previous</RouterLink>
            {/snippet}
          </PaginationPrevious>
        </PaginationItem>
        {#each state.items as item (item)}
          <PaginationItem>
            <PaginationLink page={item as number}>
              {#snippet render({ props, state: link })}
                <RouterLink {...props} class={["pagination-link", link.current ? "is-active" : "is-inactive"]}>
                  {link.page}{#if link.current}<span aria-hidden="true">•</span>{/if}
                </RouterLink>
              {/snippet}
            </PaginationLink>
          </PaginationItem>
        {/each}
        <PaginationItem>
          <PaginationNext class="pagination-step">
            {#snippet render({ props })}
              <RouterLink {...props}>Next</RouterLink>
            {/snippet}
          </PaginationNext>
        </PaginationItem>
      {/snippet}
    </PaginationList>
  </Pagination>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
