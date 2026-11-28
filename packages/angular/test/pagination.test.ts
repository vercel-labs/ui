// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "../src/pagination"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Pagination,
    PaginationList,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationPrevious,
    PaginationNext,
  ],
  template: `
    <nav uiPagination [(page)]="page" [pageCount]="20" aria-label="Pages">
      <ul uiPaginationList #list="uiPaginationList">
        <li uiPaginationItem>
          <button uiPaginationPrevious id="previous">Previous</button>
        </li>
        @for (item of list.state().items; track item) {
          <li uiPaginationItem>
            @if (item === "ellipsis-start" || item === "ellipsis-end") {
              <span uiPaginationEllipsis class="gap"></span>
            } @else {
              <button uiPaginationLink class="page" [page]="item"></button>
            }
          </li>
        }
        <li uiPaginationItem>
          <button uiPaginationNext id="next">Next</button>
        </li>
      </ul>
    </nav>
  `,
})
class Page {
  readonly page = signal(1)
}

@Component({
  selector: "test-root",
  imports: [Pagination, PaginationList, PaginationItem, PaginationLink],
  template: `
    <nav uiPagination [pageCount]="3" [getHref]="getHref" aria-label="Pages">
      <ul uiPaginationList>
        @for (page of [1, 2, 3]; track page) {
          <li uiPaginationItem><a uiPaginationLink [page]="page"></a></li>
        }
      </ul>
    </nav>
  `,
})
class Links {
  readonly getHref = (page: number) =>
    ["/posts?page=1", "javascript:alert(1)", " JavaScript:alert(1)"][page - 1]!
}

const pages = (host: HTMLElement) =>
  [...host.querySelectorAll(".page")].map((el) => el.textContent?.trim())
const current = (host: HTMLElement) =>
  host.querySelector('.page[aria-current="page"]')?.textContent?.trim()

describe("pagination", () => {
  test("the list's state gives the pages to render", async () => {
    const { host } = await mount(Page)
    expect(pages(host)).toEqual(["1", "2", "3", "4", "5", "20"])
    expect(current(host)).toBe("1")
    expect(host.querySelector(".gap")?.textContent).toBe("…")
    expect(host.querySelectorAll("li[role=listitem]").length).toBe(9)
  })

  test("next and a page link move the page and the bound value", async () => {
    const { host, instance, settle } = await mount(Page)
    host.querySelector<HTMLElement>("#next")!.click()
    await settle()
    expect(instance.page()).toBe(2)
    expect(current(host)).toBe("2")
    host.querySelectorAll<HTMLElement>(".page")[5]!.click()
    await settle()
    expect(instance.page()).toBe(20)
    expect(pages(host)).toEqual(["1", "16", "17", "18", "19", "20"])
  })

  test("setting the bound page moves the range", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.page.set(10)
    await settle()
    expect(current(host)).toBe("10")
    expect(pages(host)).toEqual(["1", "9", "10", "11", "20"])
  })

  test("a link's URL gets the check an [href] binding gets", async () => {
    const { host } = await mount(Links)
    expect(
      [...host.querySelectorAll("a")].map((el) => el.getAttribute("href"))
    ).toEqual([
      "/posts?page=1",
      "unsafe:javascript:alert(1)",
      "unsafe: JavaScript:alert(1)",
    ])
  })
})
