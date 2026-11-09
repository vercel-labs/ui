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
  type PaginationState,
} from "@ui-sdk/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createApp,
  defineComponent,
  h,
  ref,
  type Component,
  type PropType,
} from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

const VariantPagination = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true as const },
    env: { type: Object as PropType<Env>, required: true as const },
  },
  setup({ variant, env }) {
    const page = ref(1)
    const controller = variant.controller
      ? createPaginationController()
      : undefined
    if (controller) {
      env.controls([
        ["next()", () => controller.next()],
        ["previous()", () => controller.previous()],
        ["first()", () => controller.first()],
        ["last()", () => controller.last()],
        ["setPage(5)", () => controller.setPage(5)],
        ["getPage()", () => controller.getPage()],
        ["getPageCount()", () => controller.getPageCount()],
      ])
    }
    const text = variant.steps === "text"
    const step = (
      part: Component,
      label: string | undefined,
      content: string
    ) =>
      h(PaginationItem, () =>
        h(part, { class: classes.step, "aria-label": label }, () => content)
      )
    return () =>
      h(
        Pagination,
        {
          "aria-label": variant.title,
          ...variant.options,
          ...(variant.controlled && { page: page.value }),
          getHref: variant.links
            ? (target: number) => `#kitchen-${variant.id}-${target}`
            : undefined,
          controller,
          onPageChange: (next: number, details: ChangeDetails) => {
            if (variant.cancel) {
              return details.cancel()
            }
            if (variant.controlled) {
              page.value = next
            }
            env.log(`pageChange ${next} (${details.reason}, ${details.source})`)
          },
        },
        () =>
          h(
            PaginationList,
            { class: classes.list },
            {
              default: ({ state }: { state: PaginationState }) => [
                !text && step(PaginationFirst, "First page", "«"),
                step(
                  PaginationPrevious,
                  text ? undefined : "Previous page",
                  text ? "‹ Previous" : "‹"
                ),
                ...state.items.map((item) =>
                  h(PaginationItem, { key: item }, () =>
                    typeof item === "number"
                      ? h(PaginationLink, { class: classes.link, page: item })
                      : h(PaginationEllipsis, { class: classes.ellipsis })
                  )
                ),
                step(
                  PaginationNext,
                  text ? undefined : "Next page",
                  text ? "Next ›" : "›"
                ),
                !text && step(PaginationLast, "Last page", "»"),
              ],
            }
          )
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantPagination, { variant, env }).mount(slot)
  )
}

export { mount }
