// @vitest-environment jsdom
import { Component, type TemplateRef, viewChild } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  createToaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "../src/toast"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [ToastRegion],
  template: `
    <section
      uiToastRegion
      id="region"
      aria-label="Updates"
      side="top"
      [toaster]="toaster"
    ></section>
  `,
})
class FromData {
  readonly toaster = createToaster()
}

@Component({
  selector: "test-root",
  imports: [
    ToastRegion,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastAction,
    ToastClose,
  ],
  template: `
    <ng-template #bold><b id="bold">Saved</b> to Drafts</ng-template>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toaster">
      @for (item of region.state().toasts; track item.toast.id) {
        <li
          *uiToast="item.toast; let state"
          class="toast"
          [attr.data-index]="state.index"
        >
          <div uiToastTitle class="title"></div>
          <div uiToastDescription class="description"></div>
          <button uiToastAction class="action" (action)="pressed.push('own')">
            Retry
          </button>
          <button uiToastClose class="close" aria-label="Close"></button>
        </li>
      }
    </section>
  `,
})
class OwnToasts {
  readonly toaster = createToaster()
  readonly bold = viewChild.required<TemplateRef<unknown>>("bold")
  readonly pressed: string[] = []
}

const one = (selector: string) => document.querySelector<HTMLElement>(selector)!

describe("toast", () => {
  test("an empty region renders each toast from its data", async () => {
    const { instance, settle } = await mount(FromData)
    const region = one("#region")
    expect(region.hasAttribute("aria-label")).toBe(false)
    expect(region.getAttribute("data-side")).toBe("top")
    expect(region.querySelector("ol")?.children).toHaveLength(0)

    const pressed: string[] = []
    instance.toaster("Event created", {
      description: "Friday at 10:00 AM",
      action: { label: "Undo", onAction: () => pressed.push("undo") },
      cancel: { label: "Dismiss", onCancel: () => pressed.push("cancel") },
    })
    await settle()
    expect(region.getAttribute("role")).toBe("region")
    expect(region.getAttribute("aria-label")).toBe("Updates")
    const toast = one("[data-slot='toast']")
    expect(toast.localName).toBe("li")
    expect(toast.parentElement?.getAttribute("data-slot")).toBe("toast-list")
    const title = one("[data-slot='toast-title']")
    expect(title.textContent).toBe("Event created")
    expect(toast.getAttribute("aria-labelledby")).toBe(title.id)
    expect(one("[data-slot='toast-description']").textContent).toBe(
      "Friday at 10:00 AM"
    )
    expect(one("[data-slot='toast-close']").textContent).toBe("Dismiss")

    const action = one("[data-slot='toast-action']")
    expect(action.textContent).toBe("Undo")
    action.click()
    await settle()
    expect(pressed).toEqual(["undo"])
    expect(instance.toaster.toasts()).toHaveLength(0)

    instance.toaster("Archived", {
      cancel: { label: "Dismiss", onCancel: () => pressed.push("cancel") },
    })
    await settle()
    expect(one("[data-slot='toast-description']").hasAttribute("hidden")).toBe(
      true
    )
    expect(document.querySelector("[data-slot='toast-action']")).toBeNull()
    one("[data-slot='toast-close']").click()
    await settle()
    expect(pressed).toEqual(["undo", "cancel"])
    expect(instance.toaster.toasts()).toHaveLength(0)
  })

  test("an action with an href renders a link", async () => {
    const { instance, settle } = await mount(FromData)
    instance.toaster("Report ready", {
      action: { label: "Open", href: "/reports/1" },
    })
    await settle()
    const action = one("[data-slot='toast-action']")
    expect(action.localName).toBe("a")
    expect(action.getAttribute("href")).toBe("/reports/1")
  })

  test("your own toasts loop over the region's state", async () => {
    const { instance, settle } = await mount(OwnToasts)
    instance.toaster({ title: instance.bold(), description: "Just now" })
    await settle()
    expect(one(".toast").getAttribute("data-index")).toBe("0")
    expect(one(".title").textContent).toBe("Saved to Drafts")
    expect(document.getElementById("bold")).not.toBeNull()
    expect(one(".description").textContent).toBe("Just now")
    expect(one(".close").textContent).toBe("")
    expect(one(".close").hasAttribute("hidden")).toBe(false)

    instance.toaster("Second")
    await settle()
    expect(document.querySelectorAll(".toast")).toHaveLength(2)
    expect(one(".toast .title").textContent).toBe("Second")
    expect(one(".toast .description").hasAttribute("hidden")).toBe(true)

    one(".action").click()
    await settle()
    expect(instance.pressed).toEqual(["own"])
    expect(instance.toaster.toasts()).toHaveLength(1)
  })
})
