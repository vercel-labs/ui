// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  createConfirm,
} from "../src/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "../src/dialog"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Dialog, DialogTrigger, DialogContent, DialogTitle, DialogShortcut],
  template: `
    <button
      uiDialogTrigger
      id="outside"
      [controller]="controller"
      [payload]="'row 3'"
      shortcut="mod+k"
      #trigger="uiDialogTrigger"
    >
      Edit <kbd uiDialogShortcut id="keys"></kbd>
      <span id="open">{{ trigger.state().open }}</span>
    </button>
    @if (shown()) {
      <ng-container uiDialog [controller]="controller">
        <div *uiDialogContent="let dialog" id="content">
          <h2 uiDialogTitle>Editing {{ dialog.payload }}</h2>
        </div>
      </ng-container>
    }
  `,
})
class Outside {
  readonly controller = createDialogController<string>()
  readonly shown = signal(false)
}

@Component({
  selector: "test-root",
  imports: [Dialog, DialogTrigger, DialogBackdrop, DialogContent, DialogClose],
  template: `
    <div id="layer" #layer></div>
    <section id="home">
      <ng-container
        uiDialog
        [container]="layer"
        [presentation]="presentation()"
      >
        <button uiDialogTrigger id="trigger">Open</button>
        <div *uiDialogBackdrop id="backdrop"></div>
        <div *uiDialogContent id="content">
          <button uiDialogClose id="close">Close</button>
        </div>
      </ng-container>
    </section>
  `,
})
class Portaled {
  readonly presentation = signal<"dialog" | "sheet">("dialog")
}

@Component({
  selector: "test-root",
  imports: [
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogClose,
  ],
  template: `
    <ng-container uiAlertDialog [controller]="confirm.controller">
      <button uiAlertDialogTrigger id="trigger">Delete</button>
      <div *uiAlertDialogContent="let dialog" id="content">
        <h2 uiAlertDialogTitle>Delete {{ dialog.payload }}?</h2>
        <button uiAlertDialogClose id="cancel">Cancel</button>
        <button uiAlertDialogClose id="confirm" value="confirm">Delete</button>
      </div>
    </ng-container>
  `,
})
class Alert {
  readonly confirm = createConfirm<string>()
}

// Without a top layer, as in jsdom, an open dialog renders at the end of the body.
const page = document
const press = (id: string) => page.querySelector<HTMLElement>(`#${id}`)!.click()

describe("a dialog's parts outside it", () => {
  test("a trigger is a plain button until the dialog its controller names mounts", async () => {
    const { instance, settle } = await mount(Outside)
    const trigger = page.querySelector("#outside")!
    expect(trigger.getAttribute("type")).toBe("button")
    expect(trigger.hasAttribute("aria-haspopup")).toBe(false)
    expect(page.querySelector("#open")!.textContent).toBe("false")
    instance.shown.set(true)
    await settle()
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog")
    press("outside")
    await settle()
    expect(page.querySelector("h2")!.textContent).toBe("Editing row 3")
    expect(page.querySelector("#open")!.textContent).toBe("true")
  })

  test("a trigger goes back to a plain button when its dialog leaves", async () => {
    const { instance, settle } = await mount(Outside)
    instance.shown.set(true)
    await settle()
    instance.shown.set(false)
    await settle()
    const trigger = page.querySelector("#outside")!
    expect(trigger.hasAttribute("aria-haspopup")).toBe(false)
    expect(trigger.getAttribute("type")).toBe("button")
  })

  test("a shortcut left empty shows the trigger's keys", async () => {
    const { instance, settle } = await mount(Outside)
    expect(page.querySelector("#keys")!.textContent).toBe("")
    instance.shown.set(true)
    await settle()
    expect(page.querySelector("#keys")!.textContent).toContain("Ctrl+K")
    expect(
      page.querySelector("#outside")!.getAttribute("aria-keyshortcuts")
    ).toBe("Control+K")
  })
})

describe("a dialog's container", () => {
  test("the backdrop and content render into it while open, and leave with the dialog", async () => {
    const { settle } = await mount(Portaled)
    const layer = page.querySelector("#layer")!
    press("trigger")
    await settle()
    expect(layer.querySelector("#content")).not.toBeNull()
    expect(layer.querySelector("#backdrop")).not.toBeNull()
    expect(page.querySelector("#home #content")).toBeNull()
    press("close")
    await settle()
    expect(page.querySelector("#content")).toBeNull()
    expect(page.querySelector("#backdrop")).toBeNull()
    expect(layer.childNodes.length).toBe(0)
  })

  test("presented as a sheet, the content sits in a viewport inside the container", async () => {
    const { instance, settle } = await mount(Portaled)
    instance.presentation.set("sheet")
    await settle()
    press("trigger")
    await settle()
    const viewport = page.querySelector("#content")!.parentElement!
    expect(viewport.getAttribute("data-slot")).toBe("dialog-viewport")
    expect(viewport.parentElement!.id).toBe("layer")
    press("close")
    await settle()
    expect(page.querySelector("[data-slot='dialog-viewport']")).toBeNull()
  })
})

describe("alert dialog", () => {
  test("the trigger opens an alertdialog named by its title", async () => {
    const { settle } = await mount(Alert)
    press("trigger")
    await settle()
    const content = page.querySelector("#content")!
    expect(content.getAttribute("role")).toBe("alertdialog")
    expect(content.getAttribute("aria-labelledby")).toBe(
      page.querySelector("h2")!.id
    )
  })

  test("confirm() opens it with a payload and resolves with the answer", async () => {
    const { instance, settle } = await mount(Alert)
    const answer = instance.confirm("the draft")
    await settle()
    expect(page.querySelector("h2")!.textContent).toBe("Delete the draft?")
    press("confirm")
    await settle()
    expect(await answer).toBe(true)
    const refused = instance.confirm("the draft")
    await settle()
    press("cancel")
    await settle()
    expect(await refused).toBe(false)
  })
})
