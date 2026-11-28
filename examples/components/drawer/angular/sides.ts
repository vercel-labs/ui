import { Component } from "@angular/core"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/angular/drawer"

@Component({
  imports: [
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  ],
  template: `
    <div data-slot="row">
      @for (item of sides; track item.side) {
        <ng-container
          uiDrawer
          [side]="item.side"
          [preventEdgeSwipe]="item.side === 'left' || item.side === 'right'"
        >
          <button uiDrawerTrigger>{{ item.label }}</button>
          <div *uiDrawerBackdrop></div>
          <div *uiDrawerContent>
            <div data-slot="stack">
              <h2 uiDrawerTitle>{{ item.title }}</h2>
              <p uiDrawerDescription>{{ item.description }}</p>
            </div>
            <button uiDrawerClose data-variant="solid">Close</button>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  readonly sides = [
    {
      side: "top",
      label: "Top",
      title: "Notifications",
      description: "You're all caught up.",
    },
    {
      side: "right",
      label: "Right",
      title: "Cart",
      description: "2 items, $84.00.",
    },
    {
      side: "bottom",
      label: "Bottom",
      title: "Share",
      description: "Send this page to your team.",
    },
    {
      side: "left",
      label: "Left",
      title: "Menu",
      description: "Jump to a section of the docs.",
    },
  ] as const
}

export { Example }
