import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createSignal, For } from "solid-js"

type SharedDocument = { name: string; size: string; uploading?: boolean }

const documents: SharedDocument[] = [
  { name: "Budget.xlsx", size: "48 KB" },
  { name: "Roadmap.pdf", size: "1.2 MB" },
  { name: "Launch video.mp4", size: "310 MB", uploading: true },
]

function Example() {
  const share = createDrawerController<SharedDocument, "copy" | "email">()
  const [status, setStatus] = createSignal("")

  async function shareLatest() {
    const { reason, returnValue } = await share.open({ payload: documents[1] })
    setStatus(returnValue ? `Shared from code: ${returnValue}` : `Closed with ${reason}`)
  }

  return (
    <div data-slot="stack">
      <ul data-slot="list">
        <For each={documents}>
          {(file) => (
            <li data-slot="row">
              <span data-slot="row">
                {file.name}
                <span data-slot="hint">{file.uploading ? "Uploading…" : file.size}</span>
              </span>
              <DrawerTrigger
                controller={share}
                payload={file}
                disabled={file.uploading}
                aria-label={`Share ${file.name}`}
              >
                Share
              </DrawerTrigger>
            </li>
          )}
        </For>
      </ul>
      <div data-slot="row">
        <button data-variant="solid" type="button" onClick={shareLatest}>
          Share the roadmap
        </button>
        <span data-slot="hint" role="status">
          {status()}
        </span>
      </div>
      <Drawer
        controller={share}
        onOpenChange={(open, details) =>
          !open && details.returnValue && setStatus(`Shared: ${details.returnValue}`)
        }
      >
        <DrawerBackdrop />
        <DrawerContent<SharedDocument>>
          {(state) => {
            const file = () => state.payload
            return (
              <>
                <div data-slot="grip" aria-hidden="true" />
                <div data-slot="stack">
                  <DrawerTitle>Share {file()?.name}</DrawerTitle>
                  <DrawerDescription>Anyone with the link can view it.</DrawerDescription>
                </div>
                <div data-slot="stack">
                  <DrawerClose data-variant="solid" value="copy">
                    Copy link
                  </DrawerClose>
                  <DrawerClose value="email">Send by email</DrawerClose>
                </div>
              </>
            )
          }}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { Example }
