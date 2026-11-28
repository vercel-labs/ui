import { Component } from "@angular/core"
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
  type PaginationPageChange,
} from "@ui-sdk/angular/pagination"
import {
  paginationAction,
  paginationFixture,
  paginationOptions,
} from "../../../../../tests/fixtures/pagination"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationList,
    PaginationNext,
    PaginationPrevious,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <nav
        uiPagination
        class="pagination"
        [attr.aria-label]="f.label"
        [controller]="pages"
        [pageCount]="options.pageCount"
        [siblings]="options.siblings"
        [boundaries]="options.boundaries"
        [getHref]="options.getHref"
        [page]="options.controlled ? page() : undefined"
        [defaultPage]="options.controlled ? undefined : options.defaultPage"
        (beforePageChange)="onPageChange($event)"
      >
        @for (key of [options.rekey ? page() : 0]; track key) {
          <ul uiPaginationList #list="uiPaginationList" class="pagination-list">
            <li uiPaginationItem>
              @if (links) {
                <a
                  uiPaginationFirst
                  class="pagination-step"
                  [attr.aria-label]="f.first"
                  >«</a
                >
              } @else {
                <button
                  uiPaginationFirst
                  class="pagination-step"
                  [attr.aria-label]="f.first"
                >
                  «
                </button>
              }
            </li>
            <li uiPaginationItem>
              @if (links) {
                <a
                  uiPaginationPrevious
                  class="pagination-step"
                  [attr.aria-label]="f.previous"
                  >‹</a
                >
              } @else {
                <button
                  uiPaginationPrevious
                  class="pagination-step"
                  [attr.aria-label]="f.previous"
                >
                  ‹
                </button>
              }
            </li>
            @for (item of list.state().items; track item) {
              <li uiPaginationItem>
                @if (typeof item !== "number") {
                  <span uiPaginationEllipsis class="pagination-ellipsis"></span>
                } @else if (links) {
                  <a uiPaginationLink class="pagination-link" [page]="item"></a>
                } @else {
                  <button
                    uiPaginationLink
                    class="pagination-link"
                    [page]="item"
                  ></button>
                }
              </li>
            }
            <li uiPaginationItem>
              @if (links) {
                <a
                  uiPaginationNext
                  class="pagination-step"
                  [attr.aria-label]="f.next"
                  >›</a
                >
              } @else {
                <button
                  uiPaginationNext
                  class="pagination-step"
                  [attr.aria-label]="f.next"
                >
                  ›
                </button>
              }
            </li>
            <li uiPaginationItem>
              @if (links) {
                <a
                  uiPaginationLast
                  class="pagination-step"
                  [attr.aria-label]="f.last"
                  >»</a
                >
              } @else {
                <button
                  uiPaginationLast
                  class="pagination-step"
                  [attr.aria-label]="f.last"
                >
                  »
                </button>
              }
            </li>
          </ul>
        }
      </nav>
      <button (click)="pages.setPage(f.controller.page)">
        {{ f.controller.label }}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly pages = createPaginationController()
  readonly options = paginationOptions()
  readonly links = this.options.getHref !== undefined
  readonly f = paginationFixture
  readonly action = state("")
  readonly page = state(this.options.defaultPage ?? 1)

  onPageChange(change: PaginationPageChange) {
    if (change.value === this.options.cancel) {
      return change.cancel()
    }
    this.page.set(change.value)
    this.action.set(paginationAction(change.value, change.reason))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
