// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  createDrawerController,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOutlet,
  DrawerTitle,
  DrawerTrigger,
} from "../src/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../src/hover-card"
import {
  createPopoverController,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "../src/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "../src/tooltip"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverTitle,
    PopoverDescription,
    PopoverClose,
    PopoverShortcut,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
  ],
  template: `
    <div id="layer" #layer></div>
    <button
      uiPopoverTrigger
      id="row"
      [controller]="controller"
      [payload]="'row 2'"
    >
      Row 2
    </button>
    <ng-container
      uiPopover
      [(open)]="open"
      [controller]="controller"
      [container]="layer"
      (beforeOpenChange)="changes.push($event.reason)"
    >
      <button uiPopoverTrigger id="trigger" shortcut="mod+i">
        Details <kbd uiPopoverShortcut id="keys"></kbd>
      </button>
      <div
        *uiPopoverContent="{ side: 'top', sideOffset: 6 }; let popover"
        id="content"
      >
        <h2 uiPopoverTitle>Details of {{ popover.payload ?? "nothing" }}</h2>
        <p uiPopoverDescription>More about it.</p>
        <ng-container uiTooltip>
          <button uiTooltipTrigger id="hint">Hint</button>
          <span uiTooltipContent id="tip">A hint</span>
        </ng-container>
        <button uiPopoverClose id="close">Close</button>
      </div>
    </ng-container>
  `,
})
class PopoverPage {
  readonly controller = createPopoverController<string>()
  readonly open = signal(false)
  readonly changes: string[] = []
}

@Component({
  selector: "test-root",
  imports: [
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipShortcut,
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
  ],
  template: `
    <ng-container uiTooltip [(open)]="open" shortcut="mod+s">
      <button uiTooltipTrigger id="save">Save</button>
      <span uiTooltipContent id="tip">
        Save <kbd uiTooltipShortcut id="keys"></kbd>
      </span>
    </ng-container>
    <ng-container uiHoverCard [(open)]="card">
      <a uiHoverCardTrigger id="link" href="/ada">Ada</a>
      <div *uiHoverCardContent id="card">Ada Lovelace</div>
    </ng-container>
  `,
})
class HintPage {
  readonly open = signal(false)
  readonly card = signal(false)
}

@Component({
  selector: "test-root",
  imports: [
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerTitle,
    DrawerClose,
    DrawerOutlet,
  ],
  template: `
    <main uiDrawerOutlet id="page" [controller]="controller">Page</main>
    <ng-container uiDrawer [(open)]="open" [controller]="controller">
      <button uiDrawerTrigger id="trigger">Open</button>
      <div *uiDrawerContent id="content">
        <h2 uiDrawerTitle>Filters</h2>
        <button uiDrawerClose id="close">Done</button>
      </div>
    </ng-container>
  `,
})
class DrawerPage {
  readonly controller = createDrawerController()
  readonly open = signal(false)
}

// Without a top layer, as in jsdom, an open popup renders at the end of the body.
const page = document
const press = (id: string) => page.querySelector<HTMLElement>(`#${id}`)!.click()

describe("popover", () => {
  test("the trigger opens it into its container, named and described", async () => {
    const { instance, settle } = await mount(PopoverPage)
    expect(page.querySelector("#content")).toBeNull()
    press("trigger")
    await settle()
    const content = page.querySelector("#content")!
    expect(instance.open()).toBe(true)
    expect(instance.changes).toEqual(["trigger-press"])
    expect(content.parentElement!.id).toBe("layer")
    expect(content.getAttribute("data-side")).toBe("top")
    expect(content.getAttribute("role")).toBe("dialog")
    expect(content.getAttribute("aria-labelledby")).toBe(
      page.querySelector("h2")!.id
    )
    expect(content.getAttribute("aria-describedby")).toBe(
      page.querySelector("p")!.id
    )
    expect(page.querySelector("#trigger")!.getAttribute("aria-expanded")).toBe(
      "true"
    )
  })

  test("a trigger outside it opens it with its payload", async () => {
    const { settle } = await mount(PopoverPage)
    press("row")
    await settle()
    expect(page.querySelector("h2")!.textContent).toBe("Details of row 2")
    expect(page.querySelector("#row")!.getAttribute("aria-expanded")).toBe(
      "true"
    )
    expect(page.querySelector("#trigger")!.getAttribute("aria-expanded")).toBe(
      "false"
    )
  })

  test("a close press closes it, and the shortcut shows the trigger's keys", async () => {
    const { instance, settle } = await mount(PopoverPage)
    expect(page.querySelector("#keys")!.textContent).toContain("Ctrl+I")
    instance.open.set(true)
    await settle()
    press("close")
    await settle()
    expect(instance.open()).toBe(false)
    expect(page.querySelector("#content")).toBeNull()
  })

  test("a tooltip inside it renders into the popover's container", async () => {
    const { instance, settle } = await mount(PopoverPage)
    instance.open.set(true)
    await settle()
    page.querySelector<HTMLElement>("#hint")!.focus()
    await settle()
    expect(page.querySelector("#tip")!.parentElement!.id).toBe("layer")
  })
})

describe("tooltip", () => {
  test("its content is always in the page and names or describes the trigger", async () => {
    const { instance, settle } = await mount(HintPage)
    const tip = page.querySelector("#tip")!
    const trigger = page.querySelector("#save")!
    expect(tip.getAttribute("role")).toBe("tooltip")
    expect(trigger.getAttribute("aria-describedby")).toBe(tip.id)
    expect(page.querySelector("#keys")!.textContent).toContain("Ctrl+S")
    instance.open.set(true)
    await settle()
    expect(tip.hasAttribute("data-open")).toBe(true)
  })
})

describe("hover card", () => {
  test("the star form renders the card only while it's open", async () => {
    const { instance, settle } = await mount(HintPage)
    expect(page.querySelector("#card")).toBeNull()
    expect(page.querySelector("#link")!.getAttribute("href")).toBe("/ada")
    instance.card.set(true)
    await settle()
    expect(page.querySelector("#card")!.textContent).toBe("Ada Lovelace")
  })
})

describe("drawer", () => {
  test("it opens as a dialog inside its viewport, and an outlet outside follows it", async () => {
    const { instance, settle } = await mount(DrawerPage)
    press("trigger")
    await settle()
    const content = page.querySelector("#content")!
    expect(instance.open()).toBe(true)
    expect(content.getAttribute("role")).toBe("dialog")
    expect(content.parentElement!.getAttribute("data-slot")).toBe(
      "drawer-viewport"
    )
    expect(page.querySelector("#page")!.getAttribute("data-slot")).toBe(
      "drawer-outlet"
    )
    press("close")
    await settle()
    expect(instance.open()).toBe(false)
  })
})
