<script lang="ts">
  import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/svelte/pagination"
</script>

<Pagination aria-label="Pagination" pageCount={5}>
  <PaginationList>
    {#each [1, 2, 3, 4, 5] as page (page)}
      <PaginationItem>
        <PaginationLink data-variant="ghost" {page} />
      </PaginationItem>
    {/each}
  </PaginationList>
</Pagination>
