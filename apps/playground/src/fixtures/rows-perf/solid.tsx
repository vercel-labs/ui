import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import {
  countRender,
  mountWhenAsked,
  perfItems,
  perfOptions,
  perfSize,
} from "tests/fixtures/perf.ts"

// Rows like a table's, each with a closed menu, select and tooltip, for the
// counts specs. Every part counts its renders by kind, so specs
// can tell what mounting a row renders.
const rows = perfItems(perfSize(200))
const options = perfItems(perfOptions())
const actions = ["Rename", "Duplicate", "Delete"]

function Row(props: { label: string }) {
  return (
    <div class="row" style={{ display: "flex", gap: "8px" }}>
      <Menu>
        <MenuTrigger
          render={(part) => {
            countRender("trigger")
            return <button {...part} />
          }}
        >
          Menu {props.label}
        </MenuTrigger>
        <MenuContent class="popup">
          <For each={actions}>
            {(action) => (
              <MenuItem
                class="item"
                value={action}
                render={(part) => {
                  countRender("menuItem")
                  return <div {...part} />
                }}
              >
                {action}
              </MenuItem>
            )}
          </For>
        </MenuContent>
      </Menu>
      <Select defaultValue={options[0].value}>
        <SelectTrigger
          aria-label={`Select ${props.label}`}
          class="trigger"
          render={(part) => {
            countRender("trigger")
            return <button {...part} />
          }}
        >
          <SelectValue
            render={(part) => {
              countRender("value")
              return <span {...part} />
            }}
          />
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          <For each={options}>
            {(option) => (
              <SelectItem
                class="item"
                value={option.value}
                label={option.label}
                render={(part) => {
                  countRender("option")
                  return <div {...part} />
                }}
              >
                {option.label}
              </SelectItem>
            )}
          </For>
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger
          render={(part) => {
            countRender("trigger")
            return <button {...part} />
          }}
        >
          Tip {props.label}
        </TooltipTrigger>
        <TooltipContent
          class="tooltip"
          render={(part) => {
            countRender("tooltip")
            return <div {...part} />
          }}
        >
          Hint {props.label}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function Fixture() {
  return (
    <div
      class="fixture"
      style={{ "flex-direction": "column", "align-items": "start" }}
    >
      <button>Before</button>
      <For each={rows}>{(row) => <Row label={row.label.slice(5)} />}</For>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
