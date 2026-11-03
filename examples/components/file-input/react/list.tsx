import {
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/react/file-input"
import { PlusIcon, XIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  return (
    <FileInput multiple accept="image/*">
      <FileInputTrigger>
        <PlusIcon aria-hidden="true" />
        Add images
      </FileInputTrigger>
      <FileInputList aria-label="Images" data-variant="grid">
        <FileInputItem>
          {({ file, index }) => (
            <>
              <Preview file={file} />
              <span>
                {index + 1}. {file.name}, {formatFileSize(file.size)}
              </span>
              <FileInputItemRemove>
                <XIcon aria-hidden="true" />
              </FileInputItemRemove>
            </>
          )}
        </FileInputItem>
      </FileInputList>
    </FileInput>
  )
}

function Preview({ file }: { file: File }) {
  const [url, setUrl] = React.useState<string>()
  React.useEffect(() => {
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url ? <img src={url} alt="" /> : null
}
