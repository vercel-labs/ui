// @vitest-environment jsdom
import { Component, Directive, inject, input, output } from "@angular/core"
import { createChange, definePrimitive, type ChangeDetails } from "@ui-sdk/core"
import { describe, expect, test } from "vitest"
import { usePart, usePrimitive } from "../src/primitive"
import { mount } from "./mount"

type DetailsOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<"press">) => void
}

const details = definePrimitive({
  name: "details",
  options: {
    open: "boolean",
    defaultOpen: "boolean",
    onOpenChange: "callback",
  },
  state: (options: DetailsOptions) => ({ open: options.defaultOpen ?? false }),
  sync: (options) => (options.open === undefined ? {} : { open: options.open }),
  api: (context) => {
    const change = createChange(context)
    return {
      toggle: (event?: Event) =>
        change("open", !context.store.get().open, { reason: "press", event }),
    }
  },
  slots: (slot) => ({
    root: slot({
      attrs: (state) => ({ "data-open": state.open ? "" : undefined }),
    }),
    summary: slot({
      attrs: (state) => ({
        type: "button",
        "aria-expanded": String(state.open),
      }),
      press: ({ api }, event) => api.toggle(event),
    }),
    content: slot<{}, { open: boolean }>({
      present: (state) => state.open,
      attrs: () => ({ "data-content": "" }),
      state: (state) => ({ open: state.open }),
    }),
  }),
})

@Directive({ selector: "[appDetails]" })
class Details {
  readonly open = input<boolean>()
  readonly defaultOpen = input<boolean>()
  readonly openChange = output<boolean>()
  readonly handle = usePrimitive(details, () => ({
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: (open) => this.openChange.emit(open),
  }))
  readonly state = usePart(this.handle, "root").state
}

@Directive({ selector: "[appDetailsSummary]" })
class DetailsSummary {
  readonly state = usePart(inject(Details).handle, "summary").state
}

@Directive({ selector: "[appDetailsContent]", exportAs: "appDetailsContent" })
class DetailsContent {
  readonly part = usePart(inject(Details).handle, "content")
}

@Component({
  selector: "test-root",
  imports: [Details, DetailsSummary, DetailsContent],
  template: `
    <section appDetails (openChange)="opened.push($event)">
      <button appDetailsSummary>More</button>
      <div appDetailsContent id="kept">Kept</div>
      <div *appDetailsContent id="lazy">Lazy</div>
    </section>
  `,
})
class Page {
  readonly opened: boolean[] = []
}

describe("a component on a primitive of your own", () => {
  test("renders the slot's attributes on the author's elements", async () => {
    const { host } = await mount(Page)
    const summary = host.querySelector("button")!
    expect(summary.getAttribute("aria-expanded")).toBe("false")
    expect(summary.getAttribute("data-slot")).toBe("details-summary")
    expect(host.querySelector("#kept")?.hasAttribute("hidden")).toBe(true)
    expect(host.querySelector("#lazy")).toBeNull()
  })

  test("a press runs the slot's press and reports the change", async () => {
    const { host, instance, settle } = await mount(Page)
    host.querySelector("button")!.click()
    expect(host.querySelector("section")?.hasAttribute("data-open")).toBe(true)
    expect(host.querySelector("#kept")?.hasAttribute("hidden")).toBe(false)
    expect(instance.opened).toEqual([true])
    await settle()
    expect(host.querySelector("#lazy")?.hasAttribute("data-content")).toBe(true)
  })

  test("the star form removes its element when the part stops being present", async () => {
    const { host, settle } = await mount(Page)
    const summary = host.querySelector("button")!
    summary.click()
    await settle()
    summary.click()
    await settle()
    expect(host.querySelector("#lazy")).toBeNull()
    expect(host.querySelector("#kept")?.hasAttribute("hidden")).toBe(true)
  })
})
