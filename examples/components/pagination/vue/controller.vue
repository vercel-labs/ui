<script setup lang="ts">
import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@ui-sdk/vue/pagination"
import { EllipsisIcon } from "@lucide/vue"
import { ref } from "vue"

const pages = createPaginationController()
const status = ref("Page 1 of 10")

function onPageChange(page: number) {
  status.value = `Page ${page} of ${pages.getPageCount()}`
}
</script>

<template>
  <div data-slot="stack">
    <Pagination aria-label="Pagination" :page-count="10" :controller="pages" @page-change="onPageChange">
      <PaginationList v-slot="{ state }">
        <PaginationItem v-for="item in state.items" :key="item">
          <PaginationLink data-variant="ghost" v-if="typeof item === 'number'" :page="item" />
          <PaginationEllipsis v-else>
            <EllipsisIcon />
          </PaginationEllipsis>
        </PaginationItem>
      </PaginationList>
    </Pagination>
    <div data-slot="row">
      <button data-variant="secondary" type="button" @click="pages.previous()">Previous</button>
      <button data-variant="secondary" type="button" @click="pages.next()">Next</button>
      <button data-variant="secondary" type="button" @click="pages.setPage(5)">Go to page 5</button>
    </div>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
