import {
  Directive,
  inject,
  input,
  numberAttribute,
  output,
  type InputSignal,
} from "@angular/core"
import { pagination, type PaginationOptions } from "@ui-sdk/core/pagination"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useText } from "./text.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforePageChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type PaginationPageChange = Parameters<
  NonNullable<PaginationOptions["onPageChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<PaginationOptions["onPageChange"]>>[0]
}

/**
 * A navigation landmark around the page links. Name it with `aria-label`.
 * @experimental
 */
@Directive({ selector: "[uiPagination]", exportAs: "uiPagination" })
class Pagination {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The current page, from 1. Bind it with `[(page)]` to control the pagination. */
  readonly page = input(undefined, { transform: optionalNumber })
  /** The page it starts on, when uncontrolled. */
  readonly defaultPage = input(undefined, { transform: optionalNumber })
  /** The new value, after a change that wasn't canceled. */
  readonly pageChange = output<PaginationPageChange["value"]>()
  /** Runs when the page wants to change: a page link (`"item-press"`), the Previous, Next, First or Last part, or a controller (`"imperative"`). `$event.cancel()` keeps the page, and stops a link from navigating. */
  readonly beforePageChange = output<PaginationPageChange>()
  /** How many pages there are. Or pass `total` and `pageSize`. */
  readonly pageCount = input(undefined, { transform: optionalNumber })
  /** How many items there are, for `pageCount` from `pageSize`. */
  readonly total = input(undefined, { transform: optionalNumber })
  /** How many items fit on a page, with `total`. */
  readonly pageSize = input(undefined, { transform: optionalNumber })
  /** How many pages show on each side of the current one. */
  readonly siblings = input(undefined, { transform: optionalNumber })
  /** How many pages always show at each end. */
  readonly boundaries = input(undefined, { transform: optionalNumber })
  /** The URL of a page. With it, parts are links: they navigate, open in a new tab with a modifier key, and work before JavaScript loads. Without it, they're buttons. */
  readonly getHref: InputSignal<PaginationOptions["getHref"]> = input()
  /** Whether every page and step does nothing, like a step at its end. A controller still pages it. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Pages it from anywhere. Create one with `createPaginationController()`. */
  readonly controller: InputSignal<PaginationOptions["controller"]> = input()

  readonly handle = usePrimitive(pagination, () => ({
    debug: this.debug(),
    page: this.page(),
    defaultPage: this.defaultPage(),
    onPageChange: emitChange(this.beforePageChange, this.pageChange),
    pageCount: this.pageCount(),
    total: this.total(),
    pageSize: this.pageSize(),
    siblings: this.siblings(),
    boundaries: this.boundaries(),
    getHref: this.getHref(),
    disabled: this.disabled(),
    controller: this.controller(),
  }))
  /** The pagination's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The list of pages and steps. Its `state()` has `items`, the pages to show.
 * @experimental
 */
@Directive({ selector: "[uiPaginationList]", exportAs: "uiPaginationList" })
class PaginationList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "list").state
}

/**
 * One entry in the list, around a link, a step or an ellipsis.
 * @experimental
 */
@Directive({ selector: "[uiPaginationItem]", exportAs: "uiPaginationItem" })
class PaginationItem {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "item").state
}

/**
 * A page. The current one has `aria-current="page"`. Shows its number unless it has content.
 * @experimental
 */
@Directive({ selector: "[uiPaginationLink]", exportAs: "uiPaginationLink" })
class PaginationLink {
  /** The page the link goes to, from 1. */
  readonly page = input.required({ transform: numberAttribute })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "link", () => ({
    page: this.page(),
  })).state

  constructor() {
    useText(() => String(this.page()))
  }
}

/**
 * Goes to the previous page. `aria-disabled` on the first page, where it stays focusable.
 * @experimental
 */
@Directive({
  selector: "[uiPaginationPrevious]",
  exportAs: "uiPaginationPrevious",
})
class PaginationPrevious {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "previous").state
}

/**
 * Goes to the next page. `aria-disabled` on the last page, where it stays focusable.
 * @experimental
 */
@Directive({ selector: "[uiPaginationNext]", exportAs: "uiPaginationNext" })
class PaginationNext {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "next").state
}

/**
 * Goes to the first page. `aria-disabled` there.
 * @experimental
 */
@Directive({ selector: "[uiPaginationFirst]", exportAs: "uiPaginationFirst" })
class PaginationFirst {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "first").state
}

/**
 * Goes to the last page. `aria-disabled` there.
 * @experimental
 */
@Directive({ selector: "[uiPaginationLast]", exportAs: "uiPaginationLast" })
class PaginationLast {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "last").state
}

/**
 * A gap in the range. Hidden from screen readers, since the links around it say which pages there are. Shows "…" unless it has content.
 * @experimental
 */
@Directive({
  selector: "[uiPaginationEllipsis]",
  exportAs: "uiPaginationEllipsis",
})
class PaginationEllipsis {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Pagination).handle, "ellipsis").state

  constructor() {
    useText(() => "…")
  }
}

export {
  createPaginationController,
  paginationRange,
} from "@ui-sdk/core/pagination"
export type {
  PaginationChangeOptions,
  PaginationController,
  PaginationLinkProps,
  PaginationLinkState,
  PaginationOptions,
  PaginationPageChangeReason,
  PaginationPrimitive,
  PaginationRangeItem,
  PaginationRangeOptions,
  PaginationState,
  PaginationStepState,
} from "@ui-sdk/core/pagination"

export {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNext,
  type PaginationPageChange,
  PaginationPrevious,
}
