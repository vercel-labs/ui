import "@ui-sdk/web/button"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <p>
      Didn't get the email?
      <ui-button>
        <button data-variant="link">
          Resend code
        </button>
      </ui-button>
    </p>
  `
}
