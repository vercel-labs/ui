import { Component } from "@angular/core"
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideEllipsis,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/angular/pagination"

@Component({
  imports: [
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEllipsis,
  ],
  template: `
    <nav
      uiPagination
      aria-label="Pagination"
      [pageCount]="10"
      (beforePageChange)="
        log('Page ' + $event.value + ' (' + $event.reason + ')')
      "
    >
      <ul uiPaginationList #paginationList="uiPaginationList">
        <li uiPaginationItem>
          <button uiPaginationPrevious data-variant="ghost">
            <svg lucideChevronLeft></svg>
            <span data-slot="visually-hidden">Previous</span>
          </button>
        </li>
        @for (item of paginationList.state().items; track item) {
          <li uiPaginationItem>
            @if (typeof item === "number") {
              <button
                uiPaginationLink
                data-variant="ghost"
                [page]="item"
              ></button>
            } @else {
              <span uiPaginationEllipsis>
                <svg lucideEllipsis></svg>
              </span>
            }
          </li>
        }
        <li uiPaginationItem>
          <button uiPaginationNext data-variant="ghost">
            <span data-slot="visually-hidden">Next</span>
            <svg lucideChevronRight></svg>
          </button>
        </li>
      </ul>
    </nav>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
