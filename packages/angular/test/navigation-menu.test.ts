// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuList,
  NavigationMenuTrigger,
  type NavigationMenuValueChange,
  NavigationMenuViewport,
} from "../src/navigation-menu"
import { mount } from "./mount"

const parts = [
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuIndicator,
  NavigationMenuViewport,
]

@Component({
  selector: "test-root",
  imports: parts,
  template: `
    <nav
      uiNavigationMenu
      id="menu"
      aria-label="Main"
      [(value)]="value"
      (beforeValueChange)="before($event)"
    >
      <ul uiNavigationMenuList id="list">
        <li uiNavigationMenuItem id="products-item" value="products">
          <button uiNavigationMenuTrigger id="products">Products</button>
          <div *uiNavigationMenuContent id="products-content">
            <a uiNavigationMenuLink id="analytics" href="#analytics">
              <span uiNavigationMenuLinkIcon id="icon">→</span> Analytics
            </a>
          </div>
        </li>
        <li uiNavigationMenuItem id="company-item" value="company">
          <button uiNavigationMenuTrigger id="company">Company</button>
          <div uiNavigationMenuContent keepMounted id="company-content">
            <a uiNavigationMenuLink href="#about">About</a>
          </div>
        </li>
        <li uiNavigationMenuItem>
          <a uiNavigationMenuLink current id="docs" href="#docs">Docs</a>
        </li>
      </ul>
      <div uiNavigationMenuIndicator id="indicator"></div>
      <div uiNavigationMenuViewport id="viewport"></div>
    </nav>
  `,
})
class WithViewport {
  readonly value = signal<string | null>(null)
  readonly locked = signal(false)
  readonly reasons: string[] = []

  before(change: NavigationMenuValueChange) {
    this.reasons.push(change.reason)
    if (this.locked()) {
      change.cancel()
    }
  }
}

@Component({
  selector: "test-root",
  imports: [
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
  ],
  template: `
    <nav uiNavigationMenu aria-label="Main" defaultValue="products">
      <ul uiNavigationMenuList>
        <li uiNavigationMenuItem id="products-item" value="products">
          <button uiNavigationMenuTrigger id="products">Products</button>
          <div
            *uiNavigationMenuContent="{ side: 'bottom' }; let content"
            id="products-content"
            [attr.data-seen]="content.open"
          >
            <div uiNavigationMenu id="nested" defaultValue="charts">
              <ul uiNavigationMenuList>
                <li uiNavigationMenuItem value="charts">
                  <button uiNavigationMenuTrigger id="charts">Charts</button>
                  <div *uiNavigationMenuContent id="charts-content">
                    <a uiNavigationMenuLink id="bar" href="#bar">Bar</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  `,
})
class Nested {}

const byId = (id: string) => document.getElementById(id)!

describe("navigation menu", () => {
  test("opens an item's content in the viewport and puts it back closed", async () => {
    const { host, instance, settle } = await mount(WithViewport)
    const trigger = byId("products")
    expect(host.querySelector("#menu")?.getAttribute("data-orientation")).toBe(
      "horizontal"
    )
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(document.getElementById("products-content")).toBeNull()
    expect(byId("docs").getAttribute("aria-current")).toBe("page")

    trigger.click()
    await settle()
    expect(instance.value()).toBe("products")
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    const content = byId("products-content")
    expect(content.parentElement).toBe(byId("viewport"))
    expect(trigger.getAttribute("aria-controls")).toBe(content.id)
    expect(byId("icon").getAttribute("aria-hidden")).toBe("true")

    instance.value.set(null)
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(document.getElementById("products-content")).toBeNull()
  })

  test("keeps a closed content in its item and moves it as it opens", async () => {
    const { instance, settle } = await mount(WithViewport)
    const content = byId("company-content")
    expect(content.parentElement).toBe(byId("company-item"))
    expect(content.hasAttribute("hidden")).toBe(true)

    instance.value.set("company")
    await settle()
    expect(content.parentElement).toBe(byId("viewport"))
    expect(content.hasAttribute("hidden")).toBe(false)
  })

  test("a canceled change keeps the menu closed", async () => {
    const { instance, settle } = await mount(WithViewport)
    instance.locked.set(true)
    byId("products").click()
    await settle()
    expect(instance.reasons).toHaveLength(1)
    expect(instance.value()).toBeNull()
    expect(byId("products").getAttribute("aria-expanded")).toBe("false")
  })

  test("without a viewport each content is its own popup, and a nested menu sits inside", async () => {
    const { settle } = await mount(Nested)
    await settle()
    const content = byId("products-content")
    expect(content.getAttribute("data-seen")).toBe("true")
    expect(content.getAttribute("data-side")).toBe("bottom")
    expect(content.closest("#products-item")).toBeNull()
    const nested = byId("nested")
    expect(nested.hasAttribute("data-nested")).toBe(true)
    expect(content.contains(nested)).toBe(true)
    expect(byId("charts").getAttribute("aria-expanded")).toBe("true")
    expect(document.getElementById("bar")).not.toBeNull()

    byId("products").click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(byId("products").getAttribute("aria-expanded")).toBe("false")
    expect(document.getElementById("bar")).toBeNull()
  })
})
