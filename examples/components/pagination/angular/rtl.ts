import { Component } from "@angular/core"
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideEllipsis,
} from "@lucide/angular"
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
    <div dir="rtl">
      <nav uiPagination aria-label="ترقيم الصفحات" [pageCount]="10">
        <ul uiPaginationList #paginationList="uiPaginationList">
          <li uiPaginationItem>
            <button uiPaginationPrevious data-variant="ghost">
              <svg lucideChevronLeft></svg>
              <span data-slot="visually-hidden">السابق</span>
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
              <span data-slot="visually-hidden">التالي</span>
              <svg lucideChevronRight></svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `,
})
class Example {}

export { Example }
