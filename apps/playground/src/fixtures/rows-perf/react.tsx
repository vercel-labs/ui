import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { createRoot } from "react-dom/client"
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

function Row({ label }: { label: string }) {
  return (
    <div className="row" style={{ display: "flex", gap: 8 }}>
      <Menu>
        <MenuTrigger
          render={(props) => {
            countRender("trigger")
            return <button {...props} />
          }}
        >
          Menu {label}
        </MenuTrigger>
        <MenuContent className="popup">
          {actions.map((action) => (
            <MenuItem
              key={action}
              className="item"
              value={action}
              render={(props) => {
                countRender("menuItem")
                return <div {...props} />
              }}
            >
              {action}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>
      <Select defaultValue={options[0].value}>
        <SelectTrigger
          aria-label={`Select ${label}`}
          className="trigger"
          render={(props) => {
            countRender("trigger")
            return <button {...props} />
          }}
        >
          <SelectValue
            render={(props) => {
              countRender("value")
              return <span {...props} />
            }}
          />
        </SelectTrigger>
        <SelectContent className="popup list-popup">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              className="item"
              value={option.value}
              label={option.label}
              render={(props) => {
                countRender("option")
                return <div {...props} />
              }}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger
          render={(props) => {
            countRender("trigger")
            return <button {...props} />
          }}
        >
          Tip {label}
        </TooltipTrigger>
        <TooltipContent
          className="tooltip"
          render={(props) => {
            countRender("tooltip")
            return <div {...props} />
          }}
        >
          Hint {label}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function Fixture() {
  return (
    <div
      className="fixture"
      style={{ flexDirection: "column", alignItems: "start" }}
    >
      <button>Before</button>
      {rows.map((row) => (
        <Row key={row.value} label={row.label.slice(5)} />
      ))}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
