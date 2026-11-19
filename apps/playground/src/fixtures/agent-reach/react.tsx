import { Button } from "@ui-sdk/react/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { Input } from "@ui-sdk/react/input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { agentReachFixture } from "tests/fixtures/agent-reach.ts"

const { shown, hidden, inert, dialog } = agentReachFixture

function Controls({
  name,
  onAction,
}: {
  name: string
  onAction: (action: string) => void
}) {
  return (
    <>
      <Input
        aria-label={`${name} field`}
        onValueChange={() => onAction(`${name} set`)}
      />
      <Button onClick={() => onAction(`${name} pressed`)}>
        {`${name} button`}
      </Button>
    </>
  )
}

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <section>
        <Controls name={shown} onAction={setAction} />
      </section>
      {hidden.map(({ name, props }) =>
        name === "Details" ? (
          <details key={name}>
            <summary>More</summary>
            <Controls name={name} onAction={setAction} />
          </details>
        ) : (
          <section key={name} {...props}>
            <Controls name={name} onAction={setAction} />
          </section>
        )
      )}
      <section inert>
        <Controls name={inert} onAction={setAction} />
      </section>
      <Dialog>
        <DialogTrigger>{dialog.trigger}</DialogTrigger>
        <DialogContent className="dialog">
          <DialogTitle className="title">{dialog.title}</DialogTitle>
          <Controls name={dialog.name} onAction={setAction} />
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
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
