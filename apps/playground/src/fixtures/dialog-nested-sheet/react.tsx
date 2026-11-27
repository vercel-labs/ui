import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Dialog container={document.body} presentation="sheet">
        <DialogTrigger>Open filters</DialogTrigger>
        <DialogContent
          className="popup"
          style={{ height: "60dvh", width: "100%" }}
        >
          <DialogTitle>Filters</DialogTitle>
          <Select presentation="sheet" defaultValue="all">
            <SelectTrigger aria-label="Date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="popup" style={{ width: "100%" }}>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
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
