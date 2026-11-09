<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/vue"
import { ref } from "vue"
import RouterLink from "./RouterLink.vue"

const action = ref("")

function onPageChange(page: number, details: ChangeDetails) {
  if (page === 4) {
    return details.cancel()
  }
  action.value = `page: ${page}`
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Pagination
      aria-label="Results pages"
      :page-count="5"
      :get-href="(page: number) => `#results-${page}`"
      @page-change="onPageChange"
    >
      <PaginationList v-slot="{ state }" class="pagination-list">
        <PaginationItem>
          <PaginationPrevious class="pagination-step">
            <template #render="{ props }">
              <RouterLink v-bind="props">Previous</RouterLink>
            </template>
          </PaginationPrevious>
        </PaginationItem>
        <PaginationItem v-for="item in state.items" :key="item">
          <PaginationLink :page="item as number">
            <template #render="{ props, state: link }">
              <RouterLink
                v-bind="props"
                :class="[
                  'pagination-link',
                  link.current ? 'is-active' : 'is-inactive',
                ]"
              >
                {{ link.page
                }}<span v-if="link.current" aria-hidden="true">•</span>
              </RouterLink>
            </template>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext class="pagination-step">
            <template #render="{ props }">
              <RouterLink v-bind="props">Next</RouterLink>
            </template>
          </PaginationNext>
        </PaginationItem>
      </PaginationList>
    </Pagination>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
