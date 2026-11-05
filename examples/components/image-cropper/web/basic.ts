import "@ui-sdk/web/image-cropper"

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#fde68a"/><circle cx="460" cy="150" r="56" fill="#fff7ed"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a78bfa"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#6d28d9"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#2e1065"/></svg>`,
)}`

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-image-cropper aria-label="Photo" src="${photo}">
      <ui-image-cropper-viewport>
        <ui-image-cropper-image><img alt="Mountains at sunset" /></ui-image-cropper-image>
        <ui-image-cropper-selection>
          <ui-image-cropper-grid></ui-image-cropper-grid>
          <ui-image-cropper-handle position="nw"></ui-image-cropper-handle>
          <ui-image-cropper-handle position="ne"></ui-image-cropper-handle>
          <ui-image-cropper-handle position="se"></ui-image-cropper-handle>
          <ui-image-cropper-handle position="sw"></ui-image-cropper-handle>
        </ui-image-cropper-selection>
      </ui-image-cropper-viewport>
    </ui-image-cropper>
  `
}

export { mount }
