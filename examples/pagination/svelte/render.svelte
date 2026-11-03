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
  import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/svelte"
</script>

<Pagination
  aria-label="Pagination"
  pageCount={10}
>
  <PaginationList class="flex flex-wrap items-center justify-center gap-1">
    {#snippet children(state)}
      <PaginationItem>
        <PaginationPrevious aria-label="Previous page">
          {#snippet render({ props, state: step })}
            <button
              {...props}
              title={step.disabled ? undefined : `Page ${step.page}`}
              class={[
                "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none",
                step.disabled
                  ? "cursor-default opacity-50"
                  : "hover:bg-muted",
              ]}
            >
              <ChevronLeft class="size-4 rtl:rotate-180" />
            </button>
          {/snippet}
        </PaginationPrevious>
      </PaginationItem>
      {#each state.items as item (item)}
        <PaginationItem>
          {#if typeof item === "number"}
            <PaginationLink page={item}>
              {#snippet render({ props, state: link })}
                <button
                  {...props}
                  class={[
                    "relative inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none",
                    link.current
                      ? "border-border bg-background hover:bg-muted"
                      : "hover:bg-muted",
                  ]}
                >
                  {link.page}
                  {#if link.current}
                    <span
                      aria-hidden="true"
                      class="absolute bottom-1 size-1 rounded-full bg-current"
                    ></span>
                  {/if}
                </button>
              {/snippet}
            </PaginationLink>
          {:else}
            <PaginationEllipsis class="flex size-8 items-center justify-center">
              <Ellipsis class="size-4" />
            </PaginationEllipsis>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext aria-label="Next page">
          {#snippet render({ props, state: step })}
            <button
              {...props}
              title={step.disabled ? undefined : `Page ${step.page}`}
              class={[
                "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none",
                step.disabled
                  ? "cursor-default opacity-50"
                  : "hover:bg-muted",
              ]}
            >
              <ChevronRight class="size-4 rtl:rotate-180" />
            </button>
          {/snippet}
        </PaginationNext>
      </PaginationItem>
    {/snippet}
  </PaginationList>
</Pagination>
