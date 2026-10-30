<script setup lang="ts">
import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/vue"
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  Pagination as PaginationPrimitive,
  PaginationPrevious,
} from "@ui-sdk/vue/pagination"
import { NuxtLink } from "#components"

const props = defineProps<{ page: number; pageCount: number; getHref: (page: number) => string }>()

function routed({ href, ...props }: Record<string, unknown>) {
  return href ? { ...props, to: href } : props
}

const step =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium text-foreground outline-none select-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 not-data-disabled:hover:bg-muted data-disabled:opacity-50 data-active:border-border data-active:bg-background motion-reduce:transition-none"
</script>

<template>
  <PaginationPrimitive
    aria-label="Pages"
    :page="props.page"
    :page-count="props.pageCount"
    :get-href="props.getHref"
  >
    <PaginationList v-slot="{ state }" class="flex items-center gap-1">
      <PaginationItem>
        <PaginationPrevious :class="step">
          <template #render="{ props: link }">
            <component :is="link.href ? NuxtLink : 'a'" v-bind="routed(link)">
              <ChevronLeft aria-hidden="true" class="size-4 rtl:rotate-180" />
              <span class="sr-only">Previous</span>
            </component>
          </template>
        </PaginationPrevious>
      </PaginationItem>
      <PaginationItem v-for="item in state.items" :key="item">
        <PaginationLink v-if="typeof item === 'number'" :page="item" :class="step">
          <template #render="{ props: link }">
            <component :is="link.href ? NuxtLink : 'a'" v-bind="routed(link)">{{ item }}</component>
          </template>
        </PaginationLink>
        <PaginationEllipsis v-else class="flex size-8 items-center justify-center text-muted-foreground">
          <Ellipsis aria-hidden="true" class="size-4" />
        </PaginationEllipsis>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext :class="step">
          <template #render="{ props: link }">
            <component :is="link.href ? NuxtLink : 'a'" v-bind="routed(link)">
              <span class="sr-only">Next</span>
              <ChevronRight aria-hidden="true" class="size-4 rtl:rotate-180" />
            </component>
          </template>
        </PaginationNext>
      </PaginationItem>
    </PaginationList>
  </PaginationPrimitive>
</template>
