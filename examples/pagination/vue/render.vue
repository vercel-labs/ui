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
</script>

<template>
  <Pagination aria-label="Pagination" :page-count="10">
    <PaginationList v-slot="{ state }" class="flex flex-wrap items-center justify-center gap-1">
      <PaginationItem>
        <PaginationPrevious aria-label="Previous page">
          <template #render="{ props, state: step }">
            <button
              v-bind="props"
              :title="step.disabled ? undefined : `Page ${step.page}`"
              :class="[
                'inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none',
                step.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted',
              ]"
            >
              <ChevronLeft class="size-4 rtl:rotate-180" />
            </button>
          </template>
        </PaginationPrevious>
      </PaginationItem>
      <PaginationItem v-for="item in state.items" :key="item">
        <PaginationLink v-if="typeof item === 'number'" :page="item">
          <template #render="{ props, state: link }">
            <button
              v-bind="props"
              :class="[
                'relative inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none',
                link.current ? 'border-border bg-background hover:bg-muted' : 'hover:bg-muted',
              ]"
            >
              {{ link.page }}
              <span
                v-if="link.current"
                aria-hidden="true"
                class="absolute bottom-1 size-1 rounded-full bg-current"
              ></span>
            </button>
          </template>
        </PaginationLink>
        <PaginationEllipsis v-else class="flex size-8 items-center justify-center">
          <Ellipsis class="size-4" />
        </PaginationEllipsis>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext aria-label="Next page">
          <template #render="{ props, state: step }">
            <button
              v-bind="props"
              :title="step.disabled ? undefined : `Page ${step.page}`"
              :class="[
                'inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none',
                step.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted',
              ]"
            >
              <ChevronRight class="size-4 rtl:rotate-180" />
            </button>
          </template>
        </PaginationNext>
      </PaginationItem>
    </PaginationList>
  </Pagination>
</template>
