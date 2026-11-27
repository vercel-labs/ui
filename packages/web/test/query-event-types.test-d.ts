// Compiled by `pnpm typecheck`, never run.
import { expectTypeOf } from "vitest"
import "../src/entries/combobox"
import "../src/entries/command"
import "../src/entries/select"

const command = document.createElement("ui-command")
command.addEventListener("valuechange", (event) => {
  expectTypeOf(event.detail.index).toEqualTypeOf<number>()
})
command.addEventListener("querychange", (event) => {
  expectTypeOf(event.detail.composing).toEqualTypeOf<boolean>()
})
document
  .createElement("ui-combobox")
  .addEventListener("querychange", (event) => {
    expectTypeOf(event.detail.composing).toEqualTypeOf<boolean>()
  })
document.createElement("ui-select").addEventListener("querychange", (event) => {
  expectTypeOf(event.detail.composing).toEqualTypeOf<boolean>()
})
