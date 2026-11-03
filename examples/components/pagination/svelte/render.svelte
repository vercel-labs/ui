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
        <PaginationPrevious aria-label="Previous page">
          {#snippet render({ props, state: step })}
            <button data-variant="ghost" {...props} title={step.disabled ? undefined : `Page ${step.page}`}>
              <ChevronLeftIcon />
            </button>
          {/snippet}
        </PaginationPrevious>
      </PaginationItem>
      {#each state.items as item (item)}
        <PaginationItem>
          {#if typeof item === "number"}
            <PaginationLink page={item}>
              {#snippet render({ props, state: link })}
                <button {...props}>
                  {link.page}
                  {#if link.active}
                    <span
                      aria-hidden="true"
                    ></span>
                  {/if}
                </button>
              {/snippet}
            </PaginationLink>
          {:else}
            <PaginationEllipsis>
              <EllipsisIcon />
            </PaginationEllipsis>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext aria-label="Next page">
          {#snippet render({ props, state: step })}
            <button data-variant="ghost" {...props} title={step.disabled ? undefined : `Page ${step.page}`}>
              <ChevronRightIcon />
            </button>
          {/snippet}
        </PaginationNext>
      </PaginationItem>
    {/snippet}
  </PaginationList>
</Pagination>
