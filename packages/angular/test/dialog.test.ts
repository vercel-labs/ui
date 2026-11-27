// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Dialog,
  DialogClose,
  type DialogCloseAction,
  DialogContent,
  DialogDescription,
  type DialogOpenChange,
  DialogTitle,
  DialogTrigger,
} from "../src/dialog"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
  ],
  template: `
    <ng-container
      uiDialog
      [(open)]="open"
      (beforeOpenChange)="before($event)"
      (openChangeComplete)="completed.push($event)"
    >
      <button uiDialogTrigger id="trigger" [payload]="'row 7'">Open</button>
      <div *uiDialogContent="let dialog" id="content">
        <h2 uiDialogTitle>Profile</h2>
        <p uiDialogDescription>Editing {{ dialog.payload }}</p>
        <button uiDialogClose id="close" value="cancel">Cancel</button>
        <button
          uiDialogClose
          id="save"
          value="save"
          #save="uiDialogClose"
          (action)="run($event)"
        >
          {{ save.state().pending ? "Saving" : "Save" }}
        </button>
      </div>
    </ng-container>
  `,
})
class Page {
  readonly open = signal(false)
  readonly changes: string[] = []
  readonly completed: boolean[] = []
  readonly sources: string[] = []
  locked = false
  wait: Promise<unknown> | undefined

  before(change: DialogOpenChange) {
    this.changes.push(
      `${change.reason}:${change.value}:${change.returnValue ?? ""}`
    )
    if (this.locked) {
      change.cancel()
    }
  }

  run(action: DialogCloseAction) {
    this.sources.push(typeof action.event)
    if (this.wait) {
      action.waitUntil(this.wait)
    }
  }
}

// Without a top layer, as in jsdom, an open dialog renders at the end of the body.
const page = document
const press = (id: string) => page.querySelector<HTMLElement>(`#${id}`)!.click()

@Component({
  selector: "test-shown",
  imports: [Dialog, DialogContent, DialogTitle],
  template: `
    <section>
      @if (shown()) {
        <ng-container uiDialog [defaultOpen]="true">
          <div *uiDialogContent id="content">
            <h2 uiDialogTitle>Profile</h2>
          </div>
        </ng-container>
      }
    </section>
  `,
})
class Shown {
  readonly shown = signal(true)
}

@Component({
  selector: "test-shown-content",
  imports: [Dialog, DialogContent, DialogTitle],
  template: `
    <ng-container uiDialog [defaultOpen]="true">
      <section>
        @if (shown()) {
          <div uiDialogContent id="content"><h2 uiDialogTitle>Profile</h2></div>
        }
      </section>
    </ng-container>
  `,
})
class ShownContent {
  readonly shown = signal(true)
}

describe("dialog", () => {
  test("the trigger opens it, named by its title and described by its description", async () => {
    const { instance, settle } = await mount(Page)
    expect(page.querySelector("#content")).toBeNull()
    press("trigger")
    await settle()
    const content = page.querySelector("#content")!
    expect(instance.open()).toBe(true)
    expect(instance.changes).toEqual(["trigger-press:true:"])
    expect(content.getAttribute("role")).toBe("dialog")
    expect(content.getAttribute("aria-labelledby")).toBe(
      page.querySelector("h2")!.id
    )
    expect(content.getAttribute("aria-describedby")).toBe(
      page.querySelector("p")!.id
    )
  })

  test("let reads the content's state, like the trigger's payload", async () => {
    const { settle } = await mount(Page)
    press("trigger")
    await settle()
    expect(page.querySelector("p")!.textContent).toBe("Editing row 7")
  })

  test("a close press closes it and reports its value", async () => {
    const { instance, settle } = await mount(Page)
    instance.open.set(true)
    await settle()
    press("close")
    await settle()
    expect(instance.open()).toBe(false)
    expect(instance.changes).toEqual(["close-press:false:cancel"])
    expect(page.querySelector("#content")).toBeNull()
    expect(instance.completed.at(-1)).toBe(false)
  })

  test("cancel() in (beforeOpenChange) keeps it closed", async () => {
    const { instance, settle } = await mount(Page)
    instance.locked = true
    press("trigger")
    await settle()
    expect(instance.open()).toBe(false)
    expect(page.querySelector("#content")).toBeNull()
  })

  test("an (action) listener runs before the close, with reason action", async () => {
    const { instance, settle } = await mount(Page)
    instance.open.set(true)
    await settle()
    press("save")
    await settle()
    expect(instance.sources).toEqual(["object"])
    expect(instance.changes).toEqual(["action:false:save"])
    expect(instance.open()).toBe(false)
  })

  test("waitUntil() keeps it open and the button pending until the promise settles", async () => {
    const { instance, settle } = await mount(Page)
    let finish = () => {}
    instance.wait = new Promise<void>((resolve) => (finish = resolve))
    instance.open.set(true)
    await settle()
    press("save")
    await settle()
    const save = page.querySelector("#save")!
    expect(instance.open()).toBe(true)
    expect(save.getAttribute("aria-busy")).toBe("true")
    expect(save.textContent?.trim()).toBe("Saving")
    finish()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.open()).toBe(false)
    expect(instance.changes).toEqual(["action:false:save"])
  })
  for (const [name, type] of [
    ["an open dialog", Shown],
    ["an open dialog's content", ShownContent],
  ] as const) {
    test(`${name} leaves the page when a block removes it`, async () => {
      const { instance, settle } = await mount(type)
      expect(document.querySelector("#content")?.parentElement).toBe(
        document.body
      )
      instance.shown.set(false)
      await settle()
      expect(document.querySelector("#content")).toBeNull()
    })
  }
})
