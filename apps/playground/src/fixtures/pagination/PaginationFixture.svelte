<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    createPaginationController,
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
  } from "@ui-sdk/svelte"
  import {
    paginationAction,
    paginationFixture as f,
    paginationOptions,
  } from "tests/fixtures/pagination.ts"

  const { controlled, cancel, rekey, defaultPage, ...options } =
    paginationOptions()
  const pages = createPaginationController()
  let action = $state("")
  let page = $state(defaultPage ?? 1)

  function onPageChange(next: number, details: ChangeDetails) {
    if (next === cancel) {
      return details.cancel()
    }
    page = next
    action = paginationAction(next, details.reason)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Pagination
    aria-label={f.label}
    class="pagination"
    controller={pages}
    {...options}
    page={controlled ? page : undefined}
    defaultPage={controlled ? undefined : defaultPage}
    {onPageChange}
  >
    <!-- With ?rekey the list renders from scratch on every page, like a list keyed by page. -->
    {#key rekey ? page : undefined}
      <PaginationList class="pagination-list">
        {#snippet children(state)}
          <PaginationItem>
            <PaginationFirst class="pagination-step" aria-label={f.first}
              >«</PaginationFirst
            >
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious class="pagination-step" aria-label={f.previous}
              >‹</PaginationPrevious
            >
          </PaginationItem>
          {#each state.items as item (item)}
            <PaginationItem>
              {#if typeof item === "number"}
                <PaginationLink class="pagination-link" page={item} />
              {:else}
                <PaginationEllipsis class="pagination-ellipsis" />
              {/if}
            </PaginationItem>
          {/each}
          <PaginationItem>
            <PaginationNext class="pagination-step" aria-label={f.next}
              >›</PaginationNext
            >
          </PaginationItem>
          <PaginationItem>
            <PaginationLast class="pagination-step" aria-label={f.last}
              >»</PaginationLast
            >
          </PaginationItem>
        {/snippet}
      </PaginationList>
    {/key}
  </Pagination>
  <button onclick={() => pages.setPage(f.controller.page)}
    >{f.controller.label}</button
  >
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
