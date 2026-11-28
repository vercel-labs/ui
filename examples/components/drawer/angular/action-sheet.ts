import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@ui-sdk/angular/drawer"

type PhotoAction = "share" | "duplicate" | "delete" | "cancel"

@Component({
  imports: [
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
  ],
  template: `
    <div data-slot="row">
      <button type="button" (click)="choose()">Photo Options</button>
      <ng-container uiDrawer [controller]="photoActions">
        <div *uiDrawerBackdrop></div>
        <div *uiDrawerContent>
          <div data-slot="stack">
            <h2 uiDrawerTitle>Beach.jpg</h2>
            <p uiDrawerDescription>Taken today at 9:41.</p>
          </div>
          <div data-slot="stack">
            <button uiDrawerClose value="share">Share</button>
            <button uiDrawerClose value="duplicate">Duplicate</button>
            <button uiDrawerClose value="delete">Delete</button>
            <button uiDrawerClose value="cancel">Cancel</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly photoActions = createDrawerController<undefined, PhotoAction>()

  async choose() {
    const { returnValue = "cancel" } = await this.photoActions.open()
    this.log(returnValue === "cancel" ? "Canceled" : `Chose ${returnValue}`)
  }
}

export { Example }
