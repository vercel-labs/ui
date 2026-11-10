import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { fileInputFixture as f } from "../fixtures/file-input"
import {
  big,
  browse,
  choose,
  chooseFolder,
  drop,
  fire,
  lastAction,
  pageZone,
  paste,
  pdf,
  png,
  submitted,
  transfer,
  txt,
  zone,
} from "./file-input.helpers"

// Choosing, dropping, dragging and pasting files, and the form a file input
// takes part in. The attachments list is in file-input.list.spec.ts.

test.beforeEach(async ({ open }) => {
  await open("file-input")
})

const avatar = (page: Page) =>
  page.getByRole("button", { name: f.avatar.label })
const folder = (page: Page) =>
  page.getByRole("button", { name: f.folder.label })
const send = (page: Page) => page.getByRole("button", { name: "Send" })
const actions = (page: Page) => page.getByRole("status", { name: "Actions" })
// The hidden input of the file input around a trigger, which opens the picker.
const inputOf = (button: Locator) =>
  button.evaluateHandle((el) =>
    el
      .closest('[data-slot="file-input"]')!
      .querySelector<HTMLInputElement>('input[type="file"]')!
  )

test.describe("drops and pastes", () => {
  test("dropped files are reported, the rejected ones with every reason", async ({
    page,
  }) => {
    await drop(zone(page), [png, pdf, txt, big])
    await expect(lastAction(page)).toHaveText(
      "attachments:drop:a.png,b.pdf|c.txt(file-type),big.png(file-too-large)"
    )
  })

  test("files over the zone show data-dragging and data-drag-accept until they leave", async ({
    page,
  }) => {
    const data = await transfer(page, [png])
    await fire(zone(page), "dragenter", data)
    await expect(zone(page)).toHaveAttribute("data-dragging", "")
    await expect(zone(page)).toHaveAttribute("data-drag-accept", "")
    await expect(zone(page)).not.toHaveAttribute("data-drag-reject")
    await fire(zone(page), "dragleave", data)
    await expect(zone(page)).not.toHaveAttribute("data-dragging")
    await expect(zone(page)).not.toHaveAttribute("data-drag-accept")
  })

  test("a type the file input doesn't accept shows data-drag-reject", async ({
    page,
  }) => {
    await fire(zone(page), "dragenter", await transfer(page, [png, txt]))
    await expect(zone(page)).toHaveAttribute("data-drag-reject", "")
    await expect(zone(page)).not.toHaveAttribute("data-drag-accept")
  })

  test("more files than the file input takes show data-drag-reject", async ({
    page,
    open,
  }) => {
    await open("file-input", { single: "" })
    await fire(zone(page), "dragenter", await transfer(page, [png, pdf]))
    await expect(zone(page)).toHaveAttribute("data-drag-reject", "")
  })

  test("the drag state holds while the drag crosses the zone's children", async ({
    page,
  }) => {
    await zone(page).evaluate((el) => {
      const log: string[] = ((
        window as unknown as { dragLog: string[] }
      ).dragLog = [])
      new MutationObserver(() =>
        log.push(el.hasAttribute("data-dragging") ? "on" : "off")
      ).observe(el, {
        attributeFilter: ["data-dragging"],
      })
    })
    const data = await transfer(page, [png])
    const child = browse(page)
    await fire(zone(page), "dragenter", data)
    // Entering a child comes before leaving its parent.
    await fire(child, "dragenter", data)
    await fire(zone(page), "dragleave", data)
    await fire(child, "dragover", data)
    await expect(zone(page)).toHaveAttribute("data-dragging", "")
    await fire(zone(page), "dragenter", data)
    await fire(child, "dragleave", data)
    await expect(zone(page)).toHaveAttribute("data-dragging", "")
    await fire(zone(page), "dragleave", data)
    await expect(zone(page)).not.toHaveAttribute("data-dragging")
    expect(
      await page.evaluate(
        () => (window as unknown as { dragLog: string[] }).dragLog
      )
    ).toEqual(["on", "off"])
  })

  test("text dragged over the zone is ignored", async ({ page }) => {
    const data = await transfer(page, [], "hello")
    await fire(zone(page), "dragenter", data)
    await fire(zone(page), "dragover", data)
    await expect(zone(page)).not.toHaveAttribute("data-dragging")
    expect(await fire(zone(page), "drop", data)).toBe(false)
    await expect(lastAction(page)).toHaveText("")
  })

  test("a drag that started in the page is ignored, even with files", async ({
    page,
  }) => {
    const data = await transfer(page, [png])
    await fire(page.getByRole("button", { name: "Before" }), "dragstart", data)
    await fire(zone(page), "dragenter", data)
    await expect(zone(page)).not.toHaveAttribute("data-dragging")
    await fire(page.getByRole("button", { name: "Before" }), "dragend", data)
    await fire(zone(page), "dragenter", data)
    await expect(zone(page)).toHaveAttribute("data-dragging", "")
  })

  test("the first files up to maxFiles are accepted and the rest rejected", async ({
    page,
    open,
  }) => {
    await open("file-input", { "max-files": "2" })
    await drop(zone(page), [
      txt,
      png,
      { ...png, name: "b.png" },
      { ...png, name: "c.png" },
    ])
    await expect(lastAction(page)).toHaveText(
      "attachments:drop:a.png,b.png|c.txt(file-type),c.png(too-many-files)"
    )
  })

  test(
    "maxFiles counts the files the file input already holds",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("file-input", { "max-files": "2" })
      await drop(zone(page), [png])
      await drop(zone(page), [
        { ...png, name: "b.png" },
        { ...png, name: "c.png" },
      ])
      await expect(lastAction(page)).toHaveText(
        "attachments:drop:b.png|c.png(too-many-files)"
      )
    }
  )

  test("without multiple, the first file is accepted, and a new one replaces it", async ({
    page,
    open,
  }) => {
    await open("file-input", { single: "" })
    await drop(zone(page), [png, pdf])
    await expect(lastAction(page)).toHaveText(
      "attachments:drop:a.png|b.pdf(too-many-files)"
    )
    await drop(zone(page), [pdf])
    await expect(lastAction(page)).toHaveText("attachments:drop:b.pdf,-a.png|")
  })

  test("a disabled file input takes no drops and shows no drag state", async ({
    page,
    open,
  }) => {
    await open("file-input", { disabled: "" })
    const data = await transfer(page, [png])
    await fire(zone(page), "dragenter", data)
    await expect(zone(page)).not.toHaveAttribute("data-dragging")
    await expect(zone(page)).toHaveAttribute("data-disabled", "")
    expect(
      await fire(zone(page), "drop", data),
      "the browser still doesn't open the file"
    ).toBe(true)
    await expect(lastAction(page)).toHaveText("")
  })

  test(
    "files dropped outside the zone don't open in the browser",
    { tag: "@enhancement" },
    async ({ page }) => {
      const before = page.getByRole("button", { name: "Before" })
      const data = await transfer(page, [png])
      expect(await fire(before, "dragover", data)).toBe(true)
      expect(await fire(before, "drop", data)).toBe(true)
      expect(
        await fire(before, "drop", await transfer(page, [], "hello")),
        "text drops elsewhere keep working"
      ).toBe(false)
      await expect(lastAction(page)).toHaveText("")
    }
  )

  test("pasting files while focus is inside the zone reports them", async ({
    page,
  }) => {
    await browse(page).focus()
    expect(await paste(browse(page), [png, txt])).toBe(true)
    await expect(lastAction(page)).toHaveText(
      "attachments:paste:a.png|c.txt(file-type)"
    )
  })

  test("pasting text is left alone", async ({ page }) => {
    expect(await paste(browse(page), [], "hello")).toBe(false)
    await expect(lastAction(page)).toHaveText("")
  })

  test("pasting files into the paste target reports them", async ({ page }) => {
    const note = page.getByRole("textbox", { name: f.note.label })
    expect(await paste(note, [png])).toBe(true)
    await expect(lastAction(page)).toHaveText("attachments:paste:a.png|")
    expect(await paste(note, [], "hello"), "text still pastes into it").toBe(
      false
    )
  })

  test("a page-wide zone shows while files are over the window", async ({
    page,
    open,
  }) => {
    await open("file-input", { page: "" })
    await expect(pageZone(page)).toBeHidden()
    const before = page.getByRole("button", { name: "Before" })
    const data = await transfer(page, [png])
    await fire(before, "dragenter", data)
    await expect(pageZone(page)).toBeVisible()
    await expect(pageZone(page)).toHaveAttribute("data-dragging", "")
    await fire(before, "dragleave", data)
    await expect(pageZone(page)).toBeHidden()
  })

  test("a page-wide zone takes files dropped anywhere", async ({
    page,
    open,
  }) => {
    await open("file-input", { page: "" })
    const before = page.getByRole("button", { name: "Before" })
    const data = await transfer(page, [png, txt])
    await fire(before, "dragenter", data)
    expect(await fire(before, "drop", data)).toBe(true)
    await expect(lastAction(page)).toHaveText("page:drop:a.png,c.txt|")
    await expect(pageZone(page)).toBeHidden()
  })

  test("a drop on a zone doesn't reach a page-wide zone", async ({
    page,
    open,
  }) => {
    await open("file-input", { page: "" })
    await drop(zone(page), [png])
    await expect(lastAction(page)).toHaveText("attachments:drop:a.png|")
    await expect(actions(page)).toHaveText("1")
    await expect(pageZone(page)).toBeHidden()
  })

  test("render functions get the drag state", async ({ page, framework }) => {
    test.skip(
      framework.startsWith("web"),
      "Web components style drag state with data attributes."
    )
    await expect(zone(page)).toContainText(f.zone.text)
    await fire(zone(page), "dragenter", await transfer(page, [png]))
    await expect(zone(page)).toContainText(f.zone.dragging)
  })
})

test.describe("the picker", () => {
  test("a trigger alone opens the file picker, and the chosen file is reported", async ({
    page,
  }) => {
    await choose(page, avatar(page), [png])
    await expect(lastAction(page)).toHaveText("avatar:picker:a.png|")
  })

  test(
    "files the accept list rules out are rejected",
    { tag: "@enhancement" },
    async ({ page }) => {
      // The picker's filter is only a hint: "All files" gets past it.
      await choose(page, avatar(page), [txt])
      await expect(lastAction(page)).toHaveText(
        "avatar:picker:|c.txt(file-type)"
      )
    }
  )

  test(
    "an unnamed file input empties its input after each choice, so the same file can be chosen again",
    { tag: "@enhancement" },
    async ({ page }) => {
      // Browsers fire no change for the same file in a filled input. Automation
      // always fires one, so the empty input is what proves it.
      await choose(page, avatar(page), [png])
      await expect(actions(page)).toHaveText("1")
      expect(
        await (await inputOf(avatar(page))).evaluate((el) => el.files?.length)
      ).toBe(0)
      await choose(page, avatar(page), [png])
      await expect(actions(page)).toHaveText("2")
    }
  )

  test("a folder picker reports every file inside the folder", async ({
    page,
  }, testInfo) => {
    await chooseFolder(page, folder(page), testInfo.outputPath("photos"), [
      "a.png",
      "trip/b.png",
    ])
    await expect(lastAction(page)).toHaveText(
      /^folder:picker:(a\.png,b\.png|b\.png,a\.png)\|$/
    )
  })

  test("the input carries accept, capture, multiple and directory", async ({
    page,
  }) => {
    const input = await inputOf(avatar(page))
    expect(
      await input.evaluate((el) => [
        el.type,
        el.accept,
        el.getAttribute("capture"),
        el.multiple,
      ])
    ).toEqual(["file", f.avatar.accept, f.avatar.capture, false])
    const folderInput = await inputOf(folder(page))
    expect(
      await folderInput.evaluate((el) => [
        el.hasAttribute("webkitdirectory"),
        el.multiple,
      ])
    ).toEqual([true, true])
    const attachments = await inputOf(browse(page))
    expect(
      await attachments.evaluate((el) => [el.accept, el.multiple])
    ).toEqual([f.attachments.accept, true])
  })

  test("the input stays out of the tab order and the accessibility tree", async ({
    page,
  }) => {
    const input = await inputOf(avatar(page))
    expect(
      await input.evaluate((el) => [
        el.tabIndex,
        el.getAttribute("aria-hidden"),
      ])
    ).toEqual([-1, "true"])
  })

  test("with multiple, chosen files join the ones dropped before", async ({
    page,
  }) => {
    await drop(zone(page), [png])
    await choose(page, browse(page), [pdf, txt])
    await expect(lastAction(page)).toHaveText(
      "attachments:picker:b.pdf|c.txt(file-type)"
    )
    await send(page).click()
    await expect(submitted(page)).toHaveText(
      "attachments=a.png&attachments=b.pdf&note="
    )
  })
})

test.describe("forms", () => {
  test("a named file input submits the chosen files with its form", async ({
    page,
  }) => {
    await choose(page, browse(page), [png, pdf])
    await send(page).click()
    await expect(submitted(page)).toHaveText(
      "attachments=a.png&attachments=b.pdf&note="
    )
  })

  test(
    "rejected files are never submitted",
    { tag: "@enhancement" },
    async ({ page }) => {
      await choose(page, browse(page), [png, txt])
      await send(page).click()
      await expect(submitted(page)).toHaveText("attachments=a.png&note=")
    }
  )

  test("a named file input with no files submits an empty file, like a native input", async ({
    page,
  }) => {
    await send(page).click()
    await expect(submitted(page)).toHaveText("attachments=&note=")
  })

  test(
    "files dropped on the zone go in the form",
    { tag: "@enhancement" },
    async ({ page }) => {
      await drop(zone(page), [png, txt])
      await send(page).click()
      await expect(submitted(page)).toHaveText("attachments=a.png&note=")
    }
  )

  test("canceling a change keeps its files out of the form", async ({
    page,
    open,
  }) => {
    await open("file-input", { cancel: "" })
    await drop(zone(page), [png])
    await expect(lastAction(page)).toHaveText("attachments:drop:a.png|")
    await send(page).click()
    await expect(submitted(page)).toHaveText("attachments=&note=")
  })

  test("a form reset clears the files", async ({ page }) => {
    await choose(page, browse(page), [png])
    await page.getByRole("button", { name: "Reset" }).click()
    await send(page).click()
    await expect(submitted(page)).toHaveText("attachments=&note=")
  })

  test("a required file input blocks submission and shows the field's error", async ({
    page,
    open,
  }) => {
    await open("file-input", { required: "" })
    await send(page).click()
    await expect(page.getByText(f.field.error)).toBeVisible()
    await expect(submitted(page)).toHaveText("")
    await expect(browse(page)).toBeFocused()
    await choose(page, browse(page), [png])
    await expect(page.getByText(f.field.error)).toBeHidden()
    await send(page).click()
    await expect(submitted(page)).toHaveText("attachments=a.png&note=")
  })

  test("files set from script update the field even when the announcement throws", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(
      !framework.startsWith("web"),
      "Web components take state set on their properties."
    )
    await open("file-input", { required: "" })
    await send(page).click()
    await expect(page.getByText(f.field.error)).toBeVisible()
    await page.evaluate(() => {
      const el = document.querySelector<
        HTMLElement & { announcement: unknown; value: File[] }
      >('ui-file-input[data-kind="attachments"]')!
      el.announcement = () => {
        throw new Error("announcement")
      }
      try {
        el.value = [new File(["a"], "a.png", { type: "image/png" })]
      } catch {}
    })
    await expect(page.getByText(f.field.error)).toBeHidden()
  })

  test("the field's label and the button's text name the trigger, and its description describes it", async ({
    page,
  }) => {
    await expect(browse(page)).toHaveAccessibleName(
      `${f.field.label} ${f.trigger.label}`
    )
    await expect(browse(page)).toHaveAccessibleDescription(f.field.description)
  })

  test("a press on the field's label opens the picker", async ({ page }) => {
    const chooser = page.waitForEvent("filechooser")
    await page.getByText(f.field.label, { exact: true }).click()
    await chooser
  })

  test("a disabled file input disables its trigger", async ({ page, open }) => {
    await open("file-input", { disabled: "" })
    await expect(browse(page)).toBeDisabled()
  })
})
