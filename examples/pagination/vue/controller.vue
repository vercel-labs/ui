<script setup lang="ts">
import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@ui-sdk/vue/pagination"
import { Ellipsis } from "@lucide/vue"
import { ref } from "vue"

const pages = createPaginationController()
const status = ref("Page 1 of 10")

function onPageChange(page: number) {
  status.value = `Page ${page} of ${pages.getPageCount()}`
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <Pagination aria-label="Pagination" :page-count="10" :controller="pages" @page-change="onPageChange">
      <PaginationList v-slot="{ state }" class="flex flex-wrap items-center justify-center gap-1">
        <PaginationItem v-for="item in state.items" :key="item">
          <PaginationLink
            v-if="typeof item === 'number'"
            :page="item"
            class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
          />
          <PaginationEllipsis v-else class="flex size-8 items-center justify-center">
            <Ellipsis class="size-4" />
          </PaginationEllipsis>
        </PaginationItem>
      </PaginationList>
    </Pagination>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        @click="pages.previous()"
      >
        Previous
      </button>
      <button
        type="button"
        class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        @click="pages.next()"
      >
        Next
      </button>
      <button
        type="button"
        class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] active:translate-y-px motion-reduce:transform-none"
        @click="pages.setPage(5)"
      >
        Go to page 5
      </button>
    </div>
    <output class="text-sm text-muted-foreground">{{ status }}</output>
  </div>
</template>
