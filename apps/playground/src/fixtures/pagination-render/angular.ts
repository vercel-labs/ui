import { Component } from "@angular/core"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  type PaginationPageChange,
} from "@ui-sdk/angular/pagination"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
  ],
  template: `
    <div class="fixture" (click)="route($event)">
      <button>Before</button>
      <nav
        uiPagination
        aria-label="Results pages"
        [pageCount]="5"
        [getHref]="getHref"
        (beforePageChange)="onPageChange($event)"
      >
        <ul uiPaginationList #list="uiPaginationList" class="pagination-list">
          <li uiPaginationItem>
            <a uiPaginationPrevious class="pagination-step">Previous</a>
          </li>
          @for (item of list.state().items; track item) {
            <li uiPaginationItem>
              <a
                uiPaginationLink
                #link="uiPaginationLink"
                class="pagination-link"
                [page]="$any(item)"
                [class.is-active]="link.state().current"
                [class.is-inactive]="!link.state().current"
              >
                {{ link.state().page }}
                @if (link.state().current) {
                  <span aria-hidden="true">•</span>
                }
              </a>
            </li>
          }
          <li uiPaginationItem>
            <a
              uiPaginationNext
              #next="uiPaginationNext"
              class="pagination-step"
              [attr.data-target]="next.state().page"
              >Next</a
            >
          </li>
        </ul>
      </nav>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
  readonly getHref = (page: number) => `#results-${page}`

  onPageChange(change: PaginationPageChange) {
    if (change.value === 4) {
      return change.cancel()
    }
    this.action.set(`page: ${change.value}`)
  }

  // A client-side router: links navigate without a page load.
  route(event: Event) {
    const link = (event.target as Element).closest("a[href]")
    if (!link || event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.pushState(null, "", link.getAttribute("href"))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
