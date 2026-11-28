import { Component } from "@angular/core"
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/angular/drawer"

@Component({
  imports: [
    Drawer,
    DrawerBackdrop,
    DrawerContent,
    DrawerDescription,
    DrawerHandle,
    DrawerTitle,
    DrawerTrigger,
  ],
  template: `
    <ng-container
      uiDrawer
      [snapPoints]="[0.25, 0.5, 1]"
      [defaultSnapPoint]="0.5"
      expandOnScroll
    >
      <button uiDrawerTrigger>Find a Place</button>
      <div *uiDrawerBackdrop></div>
      <div *uiDrawerContent>
        <button uiDrawerHandle aria-label="Resize"></button>
        <div data-slot="stack">
          <h2 uiDrawerTitle>Places nearby</h2>
          <p uiDrawerDescription>
            Drag the drawer, or press the handle, to see more.
          </p>
        </div>
        <div data-slot="scroll">
          <ul data-slot="list">
            @for (place of places; track place.name) {
              <li>
                <div>{{ place.name }}</div>
                <div data-slot="hint">{{ place.detail }}</div>
              </li>
            }
          </ul>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly places = [
    { name: "Blue Bottle Coffee", detail: "Coffee · 0.2 mi" },
    { name: "Tartine Bakery", detail: "Bakery · 0.4 mi" },
    { name: "Dolores Park", detail: "Park · 0.5 mi" },
    { name: "Mission Dolores", detail: "Landmark · 0.6 mi" },
    { name: "Ritual Coffee Roasters", detail: "Coffee · 0.7 mi" },
    { name: "Bi-Rite Creamery", detail: "Ice cream · 0.7 mi" },
    { name: "Alamo Square", detail: "Park · 1.1 mi" },
    { name: "The Castro Theatre", detail: "Cinema · 1.2 mi" },
    { name: "Ferry Building", detail: "Market · 2.3 mi" },
    { name: "Coit Tower", detail: "Landmark · 2.9 mi" },
    { name: "Golden Gate Park", detail: "Park · 3.0 mi" },
    { name: "Lands End", detail: "Trail · 5.4 mi" },
  ]
}

export { Example }
