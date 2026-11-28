import { Component, computed, signal } from "@angular/core"
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
    <div data-slot="stack">
      <div data-slot="row">
        <p>Showing {{ first() }}–{{ last() }} of {{ total }}</p>
        <label data-slot="label">
          Rows per page
          <select [value]="pageSize()" (change)="onPageSizeChange($event)">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
      <nav
        uiPagination
        [(page)]="page"
        aria-label="Pagination"
        [total]="total"
        [pageSize]="pageSize()"
        (beforePageChange)="log('Page ' + $event.value)"
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
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly page = signal(2)

  readonly pageSize = signal(20)

  readonly total = 95

  readonly first = computed(() => (this.page() - 1) * this.pageSize() + 1)

  readonly last = computed(() =>
    Math.min(this.page() * this.pageSize(), this.total)
  )

  onPageSizeChange(event: Event) {
    const { value } = event.target as HTMLSelectElement
    this.pageSize.set(Number(value))
    this.page.set(1)
    this.log(`${value} rows per page`)
  }
}

export { Example }
