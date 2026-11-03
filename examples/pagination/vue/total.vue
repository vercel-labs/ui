<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/vue/pagination"
import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/vue"
import { ref } from "vue"

const page = ref(2)
const pageSize = ref(20)
const total = 95
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
      <p class="tabular-nums">
        Showing {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, total) }} of {{ total }}
      </p>
      <label class="flex items-center gap-2">
        Rows per page
        <select
          v-model.number="pageSize"
          class="h-8 cursor-default rounded-2xl border border-transparent bg-input/50 px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none"
          @change="page = 1"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>
    </div>
    <Pagination v-model:page="page" aria-label="Pagination" :total="total" :page-size="pageSize">
      <PaginationList v-slot="{ state }" class="flex flex-wrap items-center justify-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
          >
            <ChevronLeft class="size-4 rtl:rotate-180" />
            <span class="sr-only">Previous</span>
          </PaginationPrevious>
        </PaginationItem>
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
        <PaginationItem>
          <PaginationNext
            class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
          >
            <span class="sr-only">Next</span>
            <ChevronRight class="size-4 rtl:rotate-180" />
          </PaginationNext>
        </PaginationItem>
      </PaginationList>
    </Pagination>
  </div>
</template>
