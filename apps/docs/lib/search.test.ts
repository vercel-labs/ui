import { describe, expect, test } from "vitest"
import { createSearchIndex, searchIndex } from "./search"

const index = createSearchIndex([
  {
    url: "/docs/react/components/navigation-menu",
    title: "Navigation Menu",
    headings: [{ id: "keyboard", content: "Keyboard" }],
    contents: [
      { heading: "keyboard", content: "Arrow keys move between `MenuItem`s." },
    ],
  },
  {
    url: "/docs/react/components/menu",
    title: "Menu",
    headings: [{ id: "submenus", content: "Submenus" }],
    contents: [{ content: "A menu of actions." }],
  },
  {
    url: "/docs/react/components/slider",
    title: "Slider",
    headings: [],
    contents: [],
  },
])

describe("searchIndex", () => {
  test("ranks an exact title first and lists the page before its matches", () => {
    expect(searchIndex(index, "menu").map((result) => result.url)).toEqual([
      "/docs/react/components/menu",
      "/docs/react/components/menu#submenus",
      "/docs/react/components/menu",
      "/docs/react/components/navigation-menu",
      "/docs/react/components/navigation-menu#keyboard",
    ])
  })

  test("needs every term and marks each one", () => {
    expect(searchIndex(index, "arrow item")).toEqual([
      {
        id: "/docs/react/components/navigation-menu:0",
        type: "page",
        content: "Navigation Menu",
        url: "/docs/react/components/navigation-menu",
      },
      {
        id: "/docs/react/components/navigation-menu:1",
        type: "text",
        content:
          "<mark>Arrow</mark> keys move between `Menu<mark>Item</mark>`s.",
        url: "/docs/react/components/navigation-menu#keyboard",
      },
    ])
  })

  test("lists a heading once, and not when it repeats the page title", () => {
    const menubar = createSearchIndex([
      {
        url: "/docs/react/components/menubar",
        title: "Menubar",
        headings: [
          { id: "controller", content: "Controller" },
          { id: "data-attributes-menubar", content: "Menubar" },
          { id: "menubar", content: "Menubar" },
          { id: "controller-1", content: "Controller" },
        ],
        contents: [],
      },
    ])
    expect(searchIndex(menubar, "menubar").map((result) => result.url)).toEqual(
      ["/docs/react/components/menubar"]
    )
    expect(
      searchIndex(menubar, "controller").map((result) => result.url)
    ).toEqual([
      "/docs/react/components/menubar",
      "/docs/react/components/menubar#controller",
    ])
  })

  test("finds nothing for an empty query", () => {
    expect(searchIndex(index, "  ")).toEqual([])
  })
})
