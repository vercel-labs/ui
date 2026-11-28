// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Field, FieldLabel } from "../src/field"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "../src/number-input"
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSlot,
  type OTPInputValueCommit,
} from "../src/otp-input"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "../src/password-input"
import { Rating, RatingItem } from "../src/rating"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "../src/segmented-control"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "../src/slider"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Field,
    FieldLabel,
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    OTPInput,
    OTPInputGroup,
    OTPInputSlot,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
    Rating,
    RatingItem,
    SegmentedControl,
    SegmentedControlIndicator,
    SegmentedControlItem,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  ],
  template: `
    <form id="form">
      <div uiField name="volume" id="volume-field">
        <label uiFieldLabel>Volume</label>
        <div uiSlider id="volume" [(value)]="volume" [max]="10">
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div uiSliderThumb id="volume-thumb"></div>
            </div>
          </div>
          <output uiSliderValue id="volume-value"></output>
        </div>
      </div>
      <div uiSlider id="range" name="range" [defaultValue]="[2, 8]" [max]="10">
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderThumb [index]="0" aria-label="From"></div>
            <div uiSliderThumb [index]="1" [aria-label]="to()"></div>
          </div>
        </div>
      </div>
      <div uiRating id="stars" name="stars" #stars="uiRating" [(value)]="score">
        @for (index of stars.items(); track index) {
          <span uiRatingItem [index]="index">*</span>
        }
      </div>
      <div uiSegmentedControl id="view" name="view" [(value)]="view">
        <span uiSegmentedControlIndicator></span>
        <button type="button" uiSegmentedControlItem value="list">List</button>
        <button type="button" uiSegmentedControlItem value="grid">Grid</button>
      </div>
      <div uiField name="count" id="count-field">
        <label uiFieldLabel>Count</label>
        <div uiNumberInput id="count" [(value)]="count" [min]="0" [max]="3">
          <div uiNumberInputGroup>
            <button type="button" uiNumberInputDecrement id="less">-</button>
            <input uiNumberInputControl id="count-control" />
            <button type="button" uiNumberInputIncrement id="more">+</button>
          </div>
        </div>
      </div>
      <div uiPasswordInput id="secret" name="secret" [(value)]="secret">
        <input uiPasswordInputControl id="secret-control" />
        <button type="button" uiPasswordInputToggle id="secret-toggle">
          Show
        </button>
      </div>
      <div
        uiOTPInput
        id="code"
        name="code"
        aria-label="Code"
        [maxLength]="4"
        [(value)]="code"
        (valueCommit)="committed.set($event)"
      >
        <div uiOTPInputGroup>
          @for (index of [0, 1, 2, 3]; track index) {
            <div uiOTPInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </form>
  `,
})
class Page {
  readonly volume = signal<number | number[]>(4)
  readonly to = signal("To")
  readonly score = signal<number | null>(2)
  readonly view = signal<string | null>("list")
  readonly count = signal<number | null>(1)
  readonly secret = signal("hunter2")
  readonly code = signal("")
  readonly committed = signal<OTPInputValueCommit | undefined>(undefined)
}

const el = <T extends HTMLElement = HTMLElement>(
  host: HTMLElement,
  selector: string
) => host.querySelector<T>(selector)!
const data = (host: HTMLElement) =>
  Array.from(new FormData(el<HTMLFormElement>(host, "#form")).entries())
const type = (input: HTMLInputElement, text: string) => {
  input.value = text
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

describe("form controls", () => {
  test("a slider's thumb input is the field's control and moves the value", async () => {
    const { host, instance, settle } = await mount(Page)
    const input = el<HTMLInputElement>(host, "#volume-thumb input")
    const label = el<HTMLLabelElement>(host, "#volume-field label")
    expect(input.type).toBe("range")
    expect(label.htmlFor).toBe(input.id)
    expect(input.value).toBe("4")
    expect(el(host, "#volume-value").textContent).toBe("4")
    expect(data(host)).toContainEqual(["volume", "4"])
    type(input, "7")
    await settle()
    expect(instance.volume()).toBe(7)
    expect(el(host, "#volume-value").textContent).toBe("7")
    expect(data(host)).toContainEqual(["volume", "7"])
  })

  test("a range's thumbs take the names the author gave them", async () => {
    const { host, instance, settle } = await mount(Page)
    const inputs = host.querySelectorAll<HTMLInputElement>(
      "#range input[type=range]"
    )
    expect(
      Array.from(inputs, (input) => input.getAttribute("aria-label"))
    ).toEqual(["From", "To"])
    expect(Array.from(inputs, (input) => input.value)).toEqual(["2", "8"])
    expect(host.querySelector("#range [uiSliderThumb][aria-label]")).toBeNull()
    expect(data(host)).toContainEqual(["range", "2/8"])
    instance.to.set("Until")
    await settle()
    expect(inputs[1]!.getAttribute("aria-label")).toBe("Until")
  })

  test("a rating renders a radio per star and takes a press", async () => {
    const { host, instance, settle } = await mount(Page)
    const radios = host.querySelectorAll<HTMLElement>("#stars [role=radio]")
    expect(radios).toHaveLength(5)
    expect(radios[1]!.getAttribute("aria-checked")).toBe("true")
    expect(data(host)).toContainEqual(["stars", "2"])
    radios[3]!.click()
    await settle()
    expect(instance.score()).toBe(4)
    expect(data(host)).toContainEqual(["stars", "4"])
  })

  test("a segmented control checks the pressed item", async () => {
    const { host, instance, settle } = await mount(Page)
    const [list, grid] = host.querySelectorAll<HTMLElement>("#view button")
    expect(list!.getAttribute("aria-checked")).toBe("true")
    grid!.click()
    await settle()
    expect(instance.view()).toBe("grid")
    expect(data(host)).toContainEqual(["view", "grid"])
  })

  test("a number input steps, stops at its limits and submits the number", async () => {
    const { host, instance, settle } = await mount(Page)
    const control = el<HTMLInputElement>(host, "#count-control")
    const label = el<HTMLLabelElement>(host, "#count-field label")
    expect(label.htmlFor).toBe("count-control")
    expect(control.value).toBe("1")
    const press = async (selector: string) => {
      const button = el(host, selector)
      button.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, button: 0 })
      )
      button.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))
      button.click()
      await settle()
    }
    await press("#more")
    expect(instance.count()).toBe(2)
    expect(control.value).toBe("2")
    expect(data(host)).toContainEqual(["count", "2"])
    await press("#more")
    expect(instance.count()).toBe(3)
    expect(el<HTMLButtonElement>(host, "#more").disabled).toBe(true)
  })

  test("a password input shows and hides its text", async () => {
    const { host, instance, settle } = await mount(Page)
    const control = el<HTMLInputElement>(host, "#secret-control")
    expect(control.type).toBe("password")
    expect(control.value).toBe("hunter2")
    expect(control.name).toBe("secret")
    el(host, "#secret-toggle").click()
    await settle()
    expect(control.type).toBe("text")
    type(control, "hunter3")
    await settle()
    expect(instance.secret()).toBe("hunter3")
  })

  test("an OTP input fills its slots and commits a full code", async () => {
    const { host, instance, settle } = await mount(Page)
    const input = el<HTMLInputElement>(host, "input#code")
    expect(input.getAttribute("aria-label")).toBe("Code")
    expect(el(host, "[uiOTPInput]").hasAttribute("aria-label")).toBe(false)
    type(input, "12")
    await settle()
    expect(instance.code()).toBe("12")
    const slots = host.querySelectorAll("[uiOTPInputSlot]")
    expect(Array.from(slots, (slot) => slot.textContent)).toEqual([
      "1",
      "2",
      "",
      "",
    ])
    type(input, "1234")
    await settle()
    expect(instance.committed()?.value).toBe("1234")
    expect(data(host)).toContainEqual(["code", "1234"])
  })
})
