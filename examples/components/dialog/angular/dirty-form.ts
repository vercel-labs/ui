import { Component, ElementRef, signal, viewChild } from "@angular/core"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldControl,
    FieldLabel,
  ],
  template: `
    <ng-container
      uiDialog
      [open]="open()"
      (openChange)="$event ? open.set(true) : close()"
      [dismissible]="!dirty()"
      (dismissAttempt)="asking.set(true)"
    >
      <button uiDialogTrigger>Write a Post</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>New post</h2>
          <p uiDialogDescription>Share an update with your team.</p>
        </div>
        <div uiField>
          <label uiFieldLabel>Post</label>
          <textarea
            uiFieldControl
            (input)="dirty.set(post.value !== '')"
            #post
            placeholder="What's new?"
          ></textarea>
        </div>
        @if (asking()) {
          <div data-slot="row" role="alert">
            Discard your changes?
            <div data-slot="row">
              <button type="button" (click)="keepEditing()">
                Keep Editing
              </button>
              <button data-variant="solid" type="button" (click)="close()">
                Discard
              </button>
            </div>
          </div>
        } @else {
          <div data-slot="row">
            <button uiDialogClose data-variant="solid" value="post">
              Post
            </button>
          </div>
        }
      </div>
    </ng-container>
  `,
})
class Example {
  readonly open = signal(false)

  readonly dirty = signal(false)

  readonly asking = signal(false)

  readonly post = viewChild<ElementRef<HTMLTextAreaElement>>("post")

  close() {
    this.open.set(false)
    this.dirty.set(false)
    this.asking.set(false)
  }

  keepEditing() {
    this.asking.set(false)
    this.post()?.nativeElement.focus()
  }
}

export { Example }
