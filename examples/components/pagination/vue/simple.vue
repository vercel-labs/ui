<script setup lang="ts">
import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/vue/pagination"
</script>

<template>
  <Pagination aria-label="Pagination" :page-count="5">
    <PaginationList>
      <PaginationItem v-for="page in [1, 2, 3, 4, 5]" :key="page">
        <PaginationLink data-variant="ghost" :page="page" />
      </PaginationItem>
    </PaginationList>
  </Pagination>
</template>
