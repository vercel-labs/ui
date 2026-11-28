import { Component } from "@angular/core"
import { LucideArrowLeft, LucideArrowRight } from "@lucide/angular"
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
    LucideArrowLeft,
    LucideArrowRight,
  ],
  template: `
    <nav uiPagination aria-label="Pagination" [pageCount]="10">
      <ul uiPaginationList #list="uiPaginationList">
        <li uiPaginationItem>
          <button
            uiPaginationPrevious
            #previous="uiPaginationPrevious"
            aria-label="Previous page"
            [attr.title]="
              previous.state().disabled
                ? null
                : 'Go to page ' + previous.state().page
            "
          >
            <svg lucideArrowLeft></svg>
            @if (!previous.state().disabled) {
              <span aria-hidden="true">{{ previous.state().page }}</span>
            }
          </button>
        </li>
        @for (item of list.state().items; track item) {
          <li uiPaginationItem>
            @if (typeof item === "number") {
              <button uiPaginationLink #link="uiPaginationLink" [page]="item">
                {{
                  link.state().current
                    ? "Page " + link.state().page
                    : link.state().page
                }}
              </button>
            } @else {
              <span uiPaginationEllipsis></span>
            }
          </li>
        }
        <li uiPaginationItem>
          <button
            uiPaginationNext
            #next="uiPaginationNext"
            aria-label="Next page"
            [attr.title]="
              next.state().disabled ? null : 'Go to page ' + next.state().page
            "
          >
            @if (!next.state().disabled) {
              <span aria-hidden="true">{{ next.state().page }}</span>
            }
            <svg lucideArrowRight></svg>
          </button>
        </li>
      </ul>
    </nav>
  `,
})
class Example {}

export { Example }
