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
import { ref } from "vue"

const page = ref(2)
const pageSize = ref(20)
const total = 95
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <p>Showing {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, total) }} of {{ total }}</p>
      <label data-slot="label">
        Rows per page
        <select v-model.number="pageSize" @change="page = 1">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>
    </div>
    <Pagination v-model:page="page" aria-label="Pagination" :total="total" :page-size="pageSize">
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
  </div>
</template>
