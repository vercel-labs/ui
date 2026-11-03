<script setup lang="ts">
import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/vue/pagination"
</script>

<template>
  <Pagination aria-label="Pagination" :page-count="5">
    <PaginationList class="flex flex-wrap items-center justify-center gap-1">
      <PaginationItem v-for="page in [1, 2, 3, 4, 5]" :key="page">
        <PaginationLink
          :page="page"
          class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
        />
      </PaginationItem>
    </PaginationList>
  </Pagination>
</template>
