import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import type { Locator, Page } from "@playwright/test"
import { fileInputFixture as f } from "../fixtures/file-input"

// Drags are dispatched with a real DataTransfer holding real files, since
// automation can't drag files in from the desktop.

type TestFile = { name: string; type?: string; size?: number }

const png = { name: "a.png", type: "image/png", size: 10 }
const pdf = { name: "b.pdf", type: "application/pdf", size: 10 }
const txt = { name: "c.txt", type: "text/plain", size: 10 }
const big = { name: "big.png", type: "image/png", size: 5000 }

function zone(page: Page) {
  return page.getByRole("group", { name: f.zone.label })
}

function pageZone(page: Page) {
  return page.getByRole("group", { name: f.page.label, includeHidden: true })
}

function browse(page: Page) {
  return page.getByRole("button", { name: f.trigger.label })
}

function list(page: Page) {
  return page.getByRole("list", { name: f.list.label })
}

// The item showing a file, found by the file's name.
function item(page: Page, name: string) {
  return list(page).getByRole("listitem").filter({ hasText: name })
}

function lastAction(page: Page) {
  return page.getByRole("status", { name: "Last action" })
}

function submitted(page: Page) {
  return page.getByRole("status", { name: "Submitted" })
}

// A DataTransfer with files, or text when `files` is empty.
function transfer(page: Page, files: TestFile[], text?: string) {
  return page.evaluateHandle(
    ({ files, text }) => {
      const data = new DataTransfer()
      for (const { name, type = "", size = 10 } of files) {
        data.items.add(new File(["x".repeat(size)], name, { type }))
      }
      if (text !== undefined) {
        data.setData("text/plain", text)
      }
      return data
    },
    { files, text }
  )
}

// Fires one drag event on an element, and says whether something prevented its default.
async function fire(
  target: Locator,
  type: string,
  dataTransfer: Awaited<ReturnType<typeof transfer>>
) {
  return target.evaluate(
    (el, { type, dataTransfer }) => {
      const event = new DragEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        dataTransfer,
      })
      el.dispatchEvent(event)
      return event.defaultPrevented
    },
    { type, dataTransfer }
  )
}

// Drags files onto an element and drops them.
async function drop(target: Locator, files: TestFile[]) {
  const data = await transfer(target.page(), files)
  await fire(target, "dragenter", data)
  await fire(target, "dragover", data)
  return fire(target, "drop", data)
}

// Pastes files, or text, into an element.
async function paste(target: Locator, files: TestFile[], text?: string) {
  const data = await transfer(target.page(), files, text)
  return target.evaluate((el, data) => {
    const event = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: data,
    })
    // Firefox copies nothing from `clipboardData` into a scripted paste, so it's set as it is.
    Object.defineProperty(event, "clipboardData", { value: data })
    el.dispatchEvent(event)
    return event.defaultPrevented
  }, data)
}

// Picks files in the file chooser a click opens.
async function choose(page: Page, button: Locator, files: TestFile[]) {
  const chooser = page.waitForEvent("filechooser")
  await button.click()
  await (
    await chooser
  ).setFiles(
    files.map(({ name, type = "", size = 10 }) => ({
      name,
      mimeType: type || "application/octet-stream",
      buffer: Buffer.from("x".repeat(size)),
    }))
  )
}

// Writes a folder with files in it, nested ones too, and picks it in the chooser a click opens.
async function chooseFolder(
  page: Page,
  button: Locator,
  root: string,
  files: string[]
) {
  for (const file of files) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    writeFileSync(path.join(root, file), "x")
  }
  const chooser = page.waitForEvent("filechooser")
  await button.click()
  await (await chooser).setFiles(root)
}

export {
  big,
  browse,
  choose,
  chooseFolder,
  drop,
  fire,
  item,
  lastAction,
  list,
  pageZone,
  paste,
  pdf,
  png,
  submitted,
  type TestFile,
  transfer,
  txt,
  zone,
}
