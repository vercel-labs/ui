import { Component } from "@angular/core"
import { LucideFile, LucideUpload, LucideX } from "@lucide/angular"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/angular/file-input"

@Component({
  imports: [
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
    LucideFile,
    LucideUpload,
    LucideX,
  ],
  template: `
    <div uiFileInput multiple>
      <div uiFileInputDropzone>
        <svg lucideUpload></svg>
        <p>Drag and drop files here</p>
        <p data-slot="hint">Or paste them from your clipboard.</p>
        <button uiFileInputTrigger>Browse Files</button>
      </div>
      <div uiFileInputList #list="uiFileInputList" aria-label="Files">
        @for (file of list.state().value; track file) {
          <div uiFileInputItem [file]="file">
            <svg lucideFile></svg>
            <span>{{ file.name }}</span>
            <span data-slot="hint">{{ formatFileSize(file.size) }}</span>
            <button uiFileInputItemRemove>
              <svg lucideX></svg>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly formatFileSize = formatFileSize
}

export { Example }
