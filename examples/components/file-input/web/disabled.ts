import "@ui-sdk/web/file-input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input disabled>
      <ui-file-input-dropzone>
        <span data-slot="hint">Uploads are paused</span>
        <ui-file-input-trigger><button>Browse</button></ui-file-input-trigger>
      </ui-file-input-dropzone>
    </ui-file-input>
  `
}
