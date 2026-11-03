import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/react/file-input"
import { UserIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [value, setValue] = React.useState<File[]>([])
  const [url, setUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!value[0]) {
      setUrl(null)
      return
    }
    const next = URL.createObjectURL(value[0])
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [value])

  return (
    <FileInput accept="image/*" maxSize={5_000_000} value={value} onValueChange={setValue}>
      <FileInputDropzone data-variant="avatar">
        {url ? <img src={url} alt="" /> : <UserIcon aria-hidden="true" />}
      </FileInputDropzone>
      <div data-slot="stack">
        <div data-slot="row">
          <FileInputTrigger>{url ? "Change photo" : "Upload photo"}</FileInputTrigger>
          {url && (
            <button type="button" onClick={() => setValue([])}>
              Remove
            </button>
          )}
        </div>
        <p data-slot="hint">Or drop an image on the avatar. Up to 5 MB.</p>
      </div>
    </FileInput>
  )
}
