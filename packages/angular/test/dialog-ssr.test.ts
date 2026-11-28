// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "../src/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../src/dialog"
import { render, tagWith } from "./render"

const imports = [
  Dialog,
  DialogTrigger,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
]

@Component({
  selector: "test-root",
  imports,
  template: `
    <ng-container uiDialog defaultOpen>
      <button uiDialogTrigger>Open</button>
      <div *uiDialogBackdrop class="backdrop"></div>
      <div *uiDialogContent class="content">
        <h2 uiDialogTitle>Profile</h2>
        <p uiDialogDescription>About you</p>
        <button uiDialogClose>Close</button>
      </div>
    </ng-container>
  `,
})
class Open {}

@Component({
  selector: "test-root",
  imports: [Dialog, DialogTrigger, DialogBackdrop, DialogContent, DialogTitle],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger>Open</button>
      <div uiDialogBackdrop class="backdrop"></div>
      <div uiDialogContent class="kept"><h2 uiDialogTitle>Kept</h2></div>
      <div *uiDialogContent class="lazy"><h2 uiDialogTitle>Lazy</h2></div>
    </ng-container>
  `,
})
class Closed {}

@Component({
  selector: "test-root",
  imports: [Dialog, DialogTrigger, DialogContent],
  template: `
    <button uiDialogTrigger [controller]="controller" disabled>Edit</button>
    <ng-container uiDialog [controller]="controller">
      <div *uiDialogContent>Editing</div>
    </ng-container>
  `,
})
class Outside {
  readonly controller = createDialogController()
}

@Component({
  selector: "test-root",
  imports: [AlertDialog, AlertDialogContent, AlertDialogTitle],
  template: `
    <ng-container uiAlertDialog defaultOpen>
      <div *uiAlertDialogContent class="content">
        <h2 uiAlertDialogTitle>Delete it?</h2>
      </div>
    </ng-container>
  `,
})
class Alert {}

// Runs with no DOM globals: a read of window or document while rendering throws.
describe("server rendering a dialog", () => {
  test("an open dialog renders named by its title", async () => {
    const html = await render(Open)
    expect(typeof window).toBe("undefined")
    const content = html.match(/<div[^>]*class="content"[^>]*>/)?.[0] ?? ""
    const title = tagWith(html, "Profile").match(/ id="([^"]+)"/)?.[1]
    expect(title).toBeTruthy()
    expect(content).toContain('role="dialog"')
    expect(content).toContain(`aria-labelledby="${title}"`)
    expect(html).toMatch(/<div[^>]*class="backdrop"[^>]*data-open=""/)
    expect(tagWith(html, "Close")).toContain('type="button"')
  })

  test("a closed dialog is hidden, and the star form leaves it out", async () => {
    const html = await render(Closed)
    expect(html).toMatch(/<div[^>]*class="kept"[^>]*hidden=""/)
    expect(html).toMatch(/<div[^>]*class="backdrop"[^>]*hidden=""/)
    expect(html).not.toContain("Lazy")
    expect(tagWith(html, "Open")).toContain('aria-haspopup="dialog"')
  })

  test("a trigger outside its dialog is connected to it", async () => {
    const trigger = tagWith(await render(Outside), "Edit")
    expect(trigger).toContain('type="button"')
    expect(trigger).toContain('disabled=""')
    expect(trigger).toContain('aria-haspopup="dialog"')
  })

  test("an open alert dialog renders as an alertdialog", async () => {
    const html = await render(Alert)
    expect(html).toMatch(/<div[^>]*class="content"[^>]*role="alertdialog"/)
  })
})
