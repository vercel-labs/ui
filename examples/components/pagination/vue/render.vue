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
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "@lucide/vue"
</script>

<template>
  <Pagination aria-label="Pagination" :page-count="10">
    <PaginationList v-slot="{ state }">
      <PaginationItem>
        <PaginationPrevious aria-label="Previous page">
          <template #render="{ props, state: step }">
            <button v-bind="props" :title="step.disabled ? undefined : `Page ${step.page}`">
              <ChevronLeftIcon />
            </button>
          </template>
        </PaginationPrevious>
      </PaginationItem>
      <PaginationItem v-for="item in state.items" :key="item">
        <PaginationLink v-if="typeof item === 'number'" :page="item">
          <template #render="{ props, state: link }">
            <button v-bind="props">
              {{ link.page }}
              <span v-if="link.active" aria-hidden="true"></span>
            </button>
          </template>
        </PaginationLink>
        <PaginationEllipsis v-else>
          <EllipsisIcon />
        </PaginationEllipsis>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext aria-label="Next page">
          <template #render="{ props, state: step }">
            <button v-bind="props" :title="step.disabled ? undefined : `Page ${step.page}`">
              <ChevronRightIcon />
            </button>
          </template>
        </PaginationNext>
      </PaginationItem>
    </PaginationList>
  </Pagination>
</template>
