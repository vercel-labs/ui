// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "../src/pagination"
import { render, tagWith } from "./render"

@Component({
  selector: "test-root",
  imports: [Pagination, PaginationList, PaginationItem, PaginationLink],
  template: `
    <nav uiPagination [pageCount]="2" [getHref]="getHref" aria-label="Pages">
      <ul uiPaginationList>
        <li uiPaginationItem><a uiPaginationLink [page]="1"></a></li>
        <li uiPaginationItem><a uiPaginationLink [page]="2"></a></li>
      </ul>
    </nav>
  `,
})
class Links {
  readonly getHref = (page: number) =>
    page === 1 ? "/posts?page=1" : "javascript:alert(1)"
}

describe("server rendering pagination", () => {
  test("a link's URL gets the check an [href] binding gets", async () => {
    const html = await render(Links)
    expect(tagWith(html, "1")).toContain('href="/posts?page=1"')
    expect(tagWith(html, "2")).toContain('href="unsafe:javascript:alert(1)"')
  })
})
