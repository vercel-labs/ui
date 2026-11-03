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
        <PaginationPrevious data-variant="ghost">
          <ChevronLeftIcon />
          <span data-slot="visually-hidden">Previous</span>
        </PaginationPrevious>
      </PaginationItem>
      <PaginationItem v-for="item in state.items" :key="item">
        <PaginationLink data-variant="ghost" v-if="typeof item === 'number'" :page="item" />
        <PaginationEllipsis v-else>
          <EllipsisIcon />
        </PaginationEllipsis>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext data-variant="ghost">
          <span data-slot="visually-hidden">Next</span>
          <ChevronRightIcon />
        </PaginationNext>
      </PaginationItem>
    </PaginationList>
  </Pagination>
</template>
