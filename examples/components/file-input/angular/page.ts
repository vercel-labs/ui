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
      <div data-slot="row">
        <p data-slot="hint">Drop files anywhere.</p>
        <button uiFileInputTrigger>Upload Files</button>
      </div>
      <div uiFileInputDropzone target="document" data-variant="overlay">
        <div data-slot="stack">
          <svg lucideUpload></svg>
          <p>Drop to attach</p>
        </div>
      </div>
      <div uiFileInputList #list="uiFileInputList" aria-label="Attachments">
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
