// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { DateInput, DateInputSegment } from "../src/date-input"
import { Field, FieldLabel } from "../src/field"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "../src/file-input"
import { TimeInput } from "../src/time-input"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    DateInput,
    DateInputSegment,
    Field,
    FieldLabel,
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
    TimeInput,
  ],
  template: `
    <form id="form">
      <div uiField name="when" id="when-field">
        <label uiFieldLabel>When</label>
        <div uiDateInput id="when" locale="en-US" [(value)]="when"></div>
      </div>
      <div
        uiDateInput
        id="own"
        locale="en-US"
        defaultValue="2026-03-04"
        #own="uiDateInput"
      >
        @for (segment of own.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiDateInputSegment [segment]="segment" class="mine" />
          } @else {
            <b uiDateInputSegment [segment]="segment"></b>
          }
        }
      </div>
      <div
        uiTimeInput
        id="time"
        name="time"
        locale="en-US"
        defaultValue="14:30"
      ></div>
      <div uiFileInput id="files" name="files" multiple [(value)]="files">
        <div uiFileInputDropzone>
          <button type="button" uiFileInputTrigger id="browse">Browse</button>
        </div>
        <ul uiFileInputList #list="uiFileInputList">
          @for (file of list.state().value; track file) {
            <li uiFileInputItem [file]="file">
              {{ file.name }}
              <button type="button" uiFileInputItemRemove>x</button>
            </li>
          }
        </ul>
      </div>
    </form>
  `,
})
class Page {
  readonly when = signal<string | null>("2026-11-02")
  readonly files = signal<File[]>([
    new File(["a"], "a.txt"),
    new File(["b"], "b.txt"),
  ])
}

const el = <T extends HTMLElement = HTMLElement>(
  host: HTMLElement,
  selector: string
) => host.querySelector<T>(selector)!
const data = (host: HTMLElement) =>
  Array.from(new FormData(el<HTMLFormElement>(host, "#form")).entries())
const key = (target: HTMLElement, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true })
  )

describe("form inputs", () => {
  test("a date input renders its segments and steps them with arrow keys", async () => {
    const { host, instance, settle } = await mount(Page)
    const segments = host.querySelectorAll<HTMLInputElement>("#when input")
    expect(Array.from(segments, (segment) => segment.value)).toEqual([
      "11",
      "02",
      "2026",
    ])
    expect(el(host, "#when").textContent).toBe("//")
    expect(data(host)).toContainEqual(["when", "2026-11-02"])
    segments[1]!.focus()
    key(segments[1]!, "ArrowUp")
    await settle()
    expect(instance.when()).toBe("2026-11-03")
    expect(segments[1]!.value).toBe("03")
    expect(el(host, "#when").getAttribute("aria-labelledby")).toBe(
      el(host, "#when-field label").id
    )
  })

  test("a date input takes the author's own segments", async () => {
    const { host } = await mount(Page)
    const own = host.querySelectorAll<HTMLInputElement>("#own input.mine")
    expect(Array.from(own, (segment) => segment.value)).toEqual([
      "03",
      "04",
      "2026",
    ])
    expect(host.querySelectorAll("#own b")).toHaveLength(2)
  })

  test("a time input submits its value", async () => {
    const { host } = await mount(Page)
    const segments = host.querySelectorAll<HTMLInputElement>("#time input")
    expect(Array.from(segments, (segment) => segment.value)).toEqual([
      "02",
      "30",
      "PM",
    ])
    expect(data(host)).toContainEqual(["time", "14:30"])
  })

  test("a file input lists its files and removes one", async () => {
    const { host, instance, settle } = await mount(Page)
    const items = () => host.querySelectorAll<HTMLElement>("#files li")
    expect(items()).toHaveLength(2)
    expect(items()[0]!.textContent).toContain("a.txt")
    const remove = items()[0]!.querySelector("button")!
    expect(remove.getAttribute("aria-label")).toBe("Remove a.txt")
    remove.click()
    await settle()
    expect(instance.files().map((file) => file.name)).toEqual(["b.txt"])
    expect(items()).toHaveLength(1)
    expect(el(host, "#browse").getAttribute("type")).toBe("button")
  })
})
