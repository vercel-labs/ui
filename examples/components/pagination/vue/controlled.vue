<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  type PaginationPageChangeReason,
} from "@ui-sdk/vue/pagination"
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "@lucide/vue"
import { ref } from "vue"

const page = ref(1)
const reason = ref("")

function onPageChange(_page: number, details: { reason: PaginationPageChangeReason }) {
  reason.value = details.reason
}
</script>

<template>
  <div data-slot="stack">
    <Pagination v-model:page="page" aria-label="Pagination" :page-count="10" @page-change="onPageChange">
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
    <output data-slot="output">Page {{ page }}{{ reason && `, from ${reason}` }}</output>
  </div>
</template>
