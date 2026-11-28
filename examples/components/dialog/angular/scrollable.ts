import { Component } from "@angular/core"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger>Scrollable Content</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent="{ initialFocus: 'content' }">
        <div data-slot="stack">
          <h2 uiDialogTitle>Terms of service</h2>
          <p uiDialogDescription>Please read before you continue.</p>
        </div>
        <div data-slot="scroll">
          @for (paragraph of paragraphs; track paragraph) {
            <p>{{ paragraph }}</p>
          }
        </div>
        <div data-slot="row">
          <button uiDialogClose>Decline</button>
          <button uiDialogClose data-variant="solid" value="accept">
            Accept
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly paragraphs = [
    "These terms govern your use of the service. By creating an account, you agree to them and to the privacy policy that explains how we handle your data.",
    "You're responsible for the content you upload and for keeping your password safe. Tell us right away if you think someone else has used your account.",
    "We may change the service, and these terms, as the product grows. When a change affects you, we'll let you know by email at least 30 days before it takes effect.",
    "You can stop using the service at any time. We'll keep your data for 30 days after you close your account, so you can export it, and then delete it.",
    "The service is provided as is. To the extent the law allows, we aren't liable for indirect damages, lost profits or lost data.",
    "If you have questions about these terms, write to us. We read every message and reply within two working days.",
  ]
}

export { Example }
