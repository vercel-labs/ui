// @vitest-environment jsdom
import * as React from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "../src/autocomplete"
import { ColorPicker, ColorPickerInput } from "../src/color-picker"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../src/combobox"
import { Command, CommandInput, CommandItem, CommandList } from "../src/command"
import { DatePicker, DatePickerInput } from "../src/date-picker"
import { NumberInput, NumberInputControl } from "../src/number-input"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

// Server markup in the page, text typed into the field, then hydration.
async function typeThenHydrate(
  app: React.ReactElement,
  text: string,
  { focused = false } = {}
) {
  const container = document.body.appendChild(document.createElement("div"))
  container.innerHTML = renderToString(app)
  const input = container.querySelector("input")!
  if (focused) {
    input.focus()
  }
  input.value = text
  await React.act(async () => {
    root = hydrateRoot(container, app)
  })
  return container.querySelector("input")!
}

const fruits = ["Apple", "Banana", "Cherry"]

test("a combobox keeps text typed before hydration, and opens while focused", async () => {
  const onQueryChange = vi.fn()
  const onOpenChange = vi.fn()
  const app = (
    <Combobox onQueryChange={onQueryChange} onOpenChange={onOpenChange}>
      <ComboboxInput aria-label="Fruit" />
      <ComboboxContent>
        <ComboboxList>
          {fruits.map((fruit) => (
            <ComboboxItem key={fruit} value={fruit}>
              {fruit}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
  const input = await typeThenHydrate(app, "Ban", { focused: true })
  expect(input.value).toBe("Ban")
  expect(onQueryChange).toHaveBeenCalledWith("Ban", expect.anything())
  expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
})

test("a combobox that lost focus keeps the text and stays closed", async () => {
  const onOpenChange = vi.fn()
  const app = (
    <Combobox onOpenChange={onOpenChange}>
      <ComboboxInput aria-label="Fruit" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="Apple">Apple</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
  const input = await typeThenHydrate(app, "Ap")
  expect(input.value).toBe("Ap")
  expect(onOpenChange).not.toHaveBeenCalled()
})

test("an autocomplete keeps text typed before hydration", async () => {
  const onValueChange = vi.fn()
  const app = (
    <Autocomplete onValueChange={onValueChange}>
      <AutocompleteInput aria-label="Fruit" />
      <AutocompleteContent>
        <AutocompleteList>
          {fruits.map((fruit) => (
            <AutocompleteItem key={fruit} value={fruit}>
              {fruit}
            </AutocompleteItem>
          ))}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
  const input = await typeThenHydrate(app, "Che")
  expect(input.value).toBe("Che")
  expect(onValueChange).toHaveBeenCalledWith("Che", expect.anything())
})

test("a command keeps text typed before hydration", async () => {
  const app = (
    <Command>
      <CommandInput aria-label="Search" />
      <CommandList>
        <CommandItem value="copy">Copy</CommandItem>
        <CommandItem value="paste">Paste</CommandItem>
      </CommandList>
    </Command>
  )
  const input = await typeThenHydrate(app, "Pas")
  expect(input.value).toBe("Pas")
  expect(
    document.querySelectorAll('[data-slot="command-item"]:not([hidden])')
  ).toHaveLength(1)
})

test("a number input commits text typed before hydration once it lost focus", async () => {
  const onValueChange = vi.fn()
  const app = (
    <NumberInput onValueChange={onValueChange}>
      <NumberInputControl aria-label="Quantity" />
    </NumberInput>
  )
  const input = await typeThenHydrate(app, "57")
  expect(input.value).toBe("57")
  expect(onValueChange).toHaveBeenCalledWith(57, expect.anything())
})

test("a date picker keeps text typed before hydration", async () => {
  const onValueChange = vi.fn()
  const app = (
    <DatePicker locale="en-US" onValueChange={onValueChange}>
      <DatePickerInput aria-label="Date" />
    </DatePicker>
  )
  const input = await typeThenHydrate(app, "04/05/2026")
  expect(input.value).toBe("04/05/2026")
  expect(onValueChange).toHaveBeenCalledWith("2026-04-05", expect.anything())
})

test("a color picker keeps text typed before hydration", async () => {
  const onValueChange = vi.fn()
  const app = (
    <ColorPicker defaultValue="#ff0000" onValueChange={onValueChange}>
      <ColorPickerInput aria-label="Color" />
    </ColorPicker>
  )
  await typeThenHydrate(app, "#00ff00")
  expect(onValueChange).toHaveBeenCalled()
  expect(onValueChange.mock.calls.at(-1)?.[0]).toMatch(/^#00ff00/)
})
