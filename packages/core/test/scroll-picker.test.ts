// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest"
import {
  bindScrollPicker,
  nearestEnabled,
  pickerPosition,
} from "../src/foundation/lists/scroll-picker"

afterEach(() => {
  document.body.innerHTML = ""
})

describe("pickerPosition", () => {
  const centers = [20, 60, 100, 140]

  test("is the index of the option whose center it is", () => {
    expect(pickerPosition(centers, 20)).toBe(0)
    expect(pickerPosition(centers, 100)).toBe(2)
    expect(pickerPosition(centers, 140)).toBe(3)
  })

  test("is fractional between two centers", () => {
    expect(pickerPosition(centers, 80)).toBe(1.5)
    expect(pickerPosition(centers, 70)).toBe(1.25)
  })

  test("carries on at the spacing of the last two past either end", () => {
    expect(pickerPosition(centers, 0)).toBe(-0.5)
    expect(pickerPosition(centers, 160)).toBe(3.5)
  })

  test("follows options of different sizes", () => {
    expect(pickerPosition([10, 40, 120], 80)).toBe(1.5)
  })

  test("is 0 with fewer than two options", () => {
    expect(pickerPosition([], 50)).toBe(0)
    expect(pickerPosition([25], 50)).toBe(0)
  })
})

describe("nearestEnabled", () => {
  const none = () => false

  test("rounds to the nearest option", () => {
    expect(nearestEnabled(1.4, 5, none)).toBe(1)
    expect(nearestEnabled(1.6, 5, none)).toBe(2)
  })

  test("stays within the options", () => {
    expect(nearestEnabled(-0.8, 5, none)).toBe(0)
    expect(nearestEnabled(7, 5, none)).toBe(4)
  })

  test("skips a disabled option for the closer neighbor", () => {
    const disabled = (index: number) => index === 2
    expect(nearestEnabled(2.2, 5, disabled)).toBe(3)
    expect(nearestEnabled(1.8, 5, disabled)).toBe(1)
  })

  test("skips several disabled options", () => {
    const disabled = (index: number) => index >= 2
    expect(nearestEnabled(4, 5, disabled)).toBe(1)
  })

  test("is -1 when every option is disabled", () => {
    expect(nearestEnabled(1, 3, () => true)).toBe(-1)
  })
})

describe("bindScrollPicker", () => {
  function render() {
    document.body.innerHTML = `
      <div role="listbox" aria-label="Hour">
        <div role="option" aria-selected="false">1</div>
        <div role="option" aria-selected="true">2</div>
        <div role="option" aria-selected="false">3</div>
      </div>`
    return document.querySelector<HTMLElement>('[role="listbox"]')!
  }

  test("writes each option's offset from the center, and removes it on cleanup", () => {
    const list = render()
    const unbind = bindScrollPicker(list)
    const options = [...list.querySelectorAll<HTMLElement>('[role="option"]')]
    expect(
      options.every((option) =>
        option.style.getPropertyValue("--picker-offset")
      )
    ).toBe(true)
    unbind()
    expect(
      options.some((option) => option.style.getPropertyValue("--picker-offset"))
    ).toBe(false)
  })

  test("a Page Down reports the option it moves to", () => {
    const list = render()
    const selected: number[] = []
    const unbind = bindScrollPicker(list, {
      onSelect: (index) => selected.push(index),
    })
    list.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "PageDown",
        bubbles: true,
        cancelable: true,
      })
    )
    expect(selected).toEqual([2])
    unbind()
  })
})
