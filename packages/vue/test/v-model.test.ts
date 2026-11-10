// @vitest-environment jsdom
// Plain `v-model` binds a component's main value, the way Vue developers
// expect, next to `v-model:<key>`.
import { createApp, defineComponent, h, nextTick, ref } from "vue"
import { expect, test } from "vitest"
import { Checkbox } from "../src/checkbox"
import { Field, FieldLabel } from "../src/field"
import { Input } from "../src/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../src/navigation-menu"
import { Slider, SliderControl, SliderThumb, SliderTrack } from "../src/slider"
import { Tabs, TabsList, TabsTab } from "../src/tabs"

Element.prototype.getAnimations ??= () => []

function mount(render: () => unknown) {
  const el = document.body.appendChild(document.createElement("div"))
  const app = createApp(defineComponent({ setup: () => render }))
  app.mount(el)
  return { el, unmount: () => (app.unmount(), el.remove()) }
}

test("v-model selects a tab and hears the selection", async () => {
  const value = ref("account")
  const { el, unmount } = mount(() =>
    h(
      Tabs,
      {
        modelValue: value.value,
        "onUpdate:modelValue": (next: string) => (value.value = next),
      },
      () =>
        h(TabsList, null, () => [
          h(TabsTab, { value: "account" }, () => "Account"),
          h(TabsTab, { value: "billing" }, () => "Billing"),
        ])
    )
  )
  const [account, billing] = el.querySelectorAll<HTMLElement>('[role="tab"]')
  expect(account.getAttribute("aria-selected")).toBe("true")
  billing.click()
  await nextTick()
  expect(value.value).toBe("billing")
  value.value = "account"
  await nextTick()
  expect(account.getAttribute("aria-selected")).toBe("true")
  unmount()
})

test("v-model checks a checkbox and fills an input", async () => {
  const checked = ref<boolean | "indeterminate">(false)
  const text = ref("Ada")
  const { el, unmount } = mount(() => [
    h(Checkbox, {
      "aria-label": "Terms",
      modelValue: checked.value,
      "onUpdate:modelValue": (next: boolean | "indeterminate") =>
        (checked.value = next),
    }),
    h(Input, {
      modelValue: text.value,
      "onUpdate:modelValue": (next: string) => (text.value = next),
    }),
  ])
  const box = el.querySelector<HTMLElement>('[role="checkbox"]')!
  box.click()
  await nextTick()
  expect(checked.value).toBe(true)
  expect(box.getAttribute("aria-checked")).toBe("true")
  const input = el.querySelector(
    "input:not([type=checkbox]):not([aria-hidden])"
  ) as HTMLInputElement
  expect(input.value).toBe("Ada")
  text.value = "Grace"
  await nextTick()
  expect(input.value).toBe("Grace")
  unmount()
})

test("a value of null stays controlled, like a navigation menu with nothing open", async () => {
  const { el, unmount } = mount(() =>
    h(NavigationMenu, { value: null, "aria-label": "Main" }, () =>
      h(NavigationMenuList, null, () =>
        h(NavigationMenuItem, { value: "products" }, () => [
          h(NavigationMenuTrigger, null, () => "Products"),
          h(NavigationMenuContent, null, () => "Catalog"),
        ])
      )
    )
  )
  el.querySelector("button")!.click()
  await nextTick()
  expect(el.querySelector("button")!.getAttribute("aria-expanded")).toBe(
    "false"
  )
  unmount()
})

// A range is a group the field's label names, and its thumbs keep their own
// names. One thumb is the control the label names.
test.each(["value", "modelValue"])(
  "a slider's %s decides whether a field labels its group or its thumb",
  async (key) => {
    const value = ref<number | number[]>([20, 80])
    const { el, unmount } = mount(() =>
      h(Field, null, () => [
        h(FieldLabel, null, () => "Price"),
        h(
          Slider,
          key === "value"
            ? { value: value.value }
            : { modelValue: value.value },
          () =>
            h(SliderControl, null, () =>
              h(SliderTrack, null, () =>
                [value.value]
                  .flat()
                  .map((_, index) =>
                    h(SliderThumb, { index, "aria-label": `Thumb ${index}` })
                  )
              )
            )
        ),
      ])
    )
    const labelled = async () => {
      await new Promise((resolve) => setTimeout(resolve))
      const label = el.querySelector("label")!.id
      return Array.from(
        el.querySelectorAll('[data-slot="slider"], input[type="range"]')
      )
        .filter((node) => node.getAttribute("aria-labelledby") === label)
        .map((node) => node.tagName)
    }
    expect(await labelled()).toEqual(["DIV"])
    value.value = 50
    expect(await labelled()).toEqual(["INPUT"])
    value.value = [20, 80]
    expect(await labelled()).toEqual(["DIV"])
    unmount()
  }
)
