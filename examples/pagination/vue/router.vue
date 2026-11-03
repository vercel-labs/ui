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
import { ChevronLeft, ChevronRight, Ellipsis } from "@lucide/vue"
import { computed, defineComponent, h, ref, type PropType } from "vue"

const route = ref("?page=1")
const page = computed(() => Number(route.value.replace("?page=", "")))
const getHref = (page: number) => `?page=${page}`

const RouterLink = defineComponent({
  inheritAttrs: false,
  props: { href: String, onClick: Function as PropType<(event: MouseEvent) => void> },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        "a",
        {
          ...attrs,
          href: props.href,
          onClick(event: MouseEvent) {
            props.onClick?.(event)
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
              return
            event.preventDefault()
            history.replaceState(history.state, "", props.href)
            route.value = props.href!
          },
        },
        slots.default?.(),
      )
  },
})
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <Pagination aria-label="Pagination" :page-count="10" :page="page" :get-href="getHref">
      <PaginationList v-slot="{ state }" class="flex flex-wrap items-center justify-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
          >
            <template #render="{ props }">
              <RouterLink v-bind="props">
                <ChevronLeft class="size-4 rtl:rotate-180" />
                <span class="sr-only">Previous</span>
              </RouterLink>
            </template>
          </PaginationPrevious>
        </PaginationItem>
        <PaginationItem v-for="item in state.items" :key="item">
          <PaginationLink
            v-if="typeof item === 'number'"
            :page="item"
            class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background"
          >
            <template #render="{ props, children }">
              <RouterLink v-bind="props"><component :is="children" /></RouterLink>
            </template>
          </PaginationLink>
          <PaginationEllipsis v-else class="flex size-8 items-center justify-center">
            <Ellipsis class="size-4" />
          </PaginationEllipsis>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none gap-1.5 not-data-disabled:hover:bg-muted data-disabled:cursor-default data-disabled:opacity-50"
          >
            <template #render="{ props }">
              <RouterLink v-bind="props">
                <span class="sr-only">Next</span>
                <ChevronRight class="size-4 rtl:rotate-180" />
              </RouterLink>
            </template>
          </PaginationNext>
        </PaginationItem>
      </PaginationList>
    </Pagination>
    <output class="text-sm text-muted-foreground">Route: {{ route }}</output>
  </div>
</template>
