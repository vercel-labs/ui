<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createPaginationController,
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/vue"
import {
  paginationAction,
  paginationFixture as f,
  paginationOptions,
} from "tests/fixtures/pagination.ts"
import { ref } from "vue"

const { controlled, cancel, rekey, defaultPage, ...options } =
  paginationOptions()
const pages = createPaginationController()
const action = ref("")
const page = ref(defaultPage ?? 1)

function onPageChange(next: number, details: ChangeDetails) {
  if (next === cancel) {
    return details.cancel()
  }
  page.value = next
  action.value = paginationAction(next, details.reason)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Pagination
      :aria-label="f.label"
      class="pagination"
      :controller="pages"
      v-bind="options"
      :page="controlled ? page : undefined"
      :default-page="controlled ? undefined : defaultPage"
      @page-change="onPageChange"
    >
      <PaginationList
        :key="rekey ? page : undefined"
        v-slot="{ state }"
        class="pagination-list"
      >
        <PaginationItem>
          <PaginationFirst class="pagination-step" :aria-label="f.first"
            >«</PaginationFirst
          >
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious class="pagination-step" :aria-label="f.previous"
            >‹</PaginationPrevious
          >
        </PaginationItem>
        <PaginationItem v-for="item in state.items" :key="item">
          <PaginationLink
            v-if="typeof item === 'number'"
            class="pagination-link"
            :page="item"
          />
          <PaginationEllipsis v-else class="pagination-ellipsis" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext class="pagination-step" :aria-label="f.next"
            >›</PaginationNext
          >
        </PaginationItem>
        <PaginationItem>
          <PaginationLast class="pagination-step" :aria-label="f.last"
            >»</PaginationLast
          >
        </PaginationItem>
      </PaginationList>
    </Pagination>
    <button @click="pages.setPage(f.controller.page)">
      {{ f.controller.label }}
    </button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
