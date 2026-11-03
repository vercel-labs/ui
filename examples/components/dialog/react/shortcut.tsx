import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { FileIcon, SearchIcon } from "lucide-react"

const pages = ["Introduction", "Installation", "Dialog", "Alert Dialog", "Menu"]

function Example() {
  return (
    <Dialog>
      <DialogTrigger shortcut="mod+j">
        <SearchIcon aria-hidden="true" />
        Search docs
        <DialogShortcut />
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <DialogTitle>Search docs</DialogTitle>
        <input aria-label="Search" placeholder="Search…" />
        <div data-slot="stack">
          {pages.map((page) => (
            <DialogClose key={page} value={page}>
              <FileIcon aria-hidden="true" />
              {page}
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
