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
  <div data-slot="stack">
    <Pagination aria-label="Pagination" :page-count="10" :page="page" :get-href="getHref">
      <PaginationList v-slot="{ state }">
        <PaginationItem>
          <PaginationPrevious data-variant="ghost">
            <template #render="{ props }">
              <RouterLink v-bind="props">
                <ChevronLeftIcon />
                <span data-slot="visually-hidden">Previous</span>
              </RouterLink>
            </template>
          </PaginationPrevious>
        </PaginationItem>
        <PaginationItem v-for="item in state.items" :key="item">
          <PaginationLink data-variant="ghost" v-if="typeof item === 'number'" :page="item">
            <template #render="{ props, children }">
              <RouterLink v-bind="props"><component :is="children" /></RouterLink>
            </template>
          </PaginationLink>
          <PaginationEllipsis v-else>
            <EllipsisIcon />
          </PaginationEllipsis>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext data-variant="ghost">
            <template #render="{ props }">
              <RouterLink v-bind="props">
                <span data-slot="visually-hidden">Next</span>
                <ChevronRightIcon />
              </RouterLink>
            </template>
          </PaginationNext>
        </PaginationItem>
      </PaginationList>
    </Pagination>
    <output data-slot="output">Route: {{ route }}</output>
  </div>
</template>
