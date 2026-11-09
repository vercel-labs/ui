import { Textarea } from "@ui-sdk/react/textarea"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/react/trigger-menu"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  fixtureTriggers,
  selectAction,
  triggerMenuFixture as f,
  triggerMenuOptions,
} from "tests/fixtures/trigger-menu.ts"

function Composer({
  name,
  onAction,
  onOpen,
}: {
  name: string
  onAction: (action: string) => void
  onOpen: (open: string) => void
}) {
  const { input, textarea, empty, autoHighlight } = triggerMenuOptions()
  const [triggers] = React.useState(fixtureTriggers)
  const id = React.useId()
  return (
    <TriggerMenu
      triggers={triggers}
      autoHighlight={autoHighlight}
      onOpenChange={(open, details) => onOpen(`${open}:${details.reason}`)}
      onSelect={(value, details) =>
        onAction(selectAction(value, details.arguments))
      }
    >
      <label className="label" htmlFor={id}>
        {name}
      </label>
      <TriggerMenuInput
        id={id}
        name="message"
        className="input"
        render={
          input ? <input /> : textarea ? <Textarea autoResize /> : undefined
        }
      />
      <TriggerMenuHint className="hint" />
      <TriggerMenuStatus className="status" />
      <TriggerMenuContent className="popup list-popup">
        {empty && (
          <TriggerMenuEmpty className="empty">{f.empty}</TriggerMenuEmpty>
        )}
        <TriggerMenuList>
          {(state) =>
            (state.items as TriggerMenuDataItem[]).map((item) => (
              <TriggerMenuItem
                key={item.value}
                value={item.value}
                label={item.label}
                disabled={item.disabled}
                className="item"
              >
                {item.label}
              </TriggerMenuItem>
            ))
          }
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

function Fixture() {
  const { twice } = triggerMenuOptions()
  const [action, setAction] = React.useState("")
  const [open, setOpen] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        className="composer"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get("message")))
        }}
      >
        <Composer name={f.label} onAction={setAction} onOpen={setOpen} />
        {twice && (
          <Composer name="Second" onAction={setAction} onOpen={setOpen} />
        )}
        <button type="submit">{f.submit}</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Open">
        {open}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
