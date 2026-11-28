import { Component, signal } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
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
    LucideMinus,
    LucidePlus,
  ],
  template: `
    <ng-container uiDrawer>
      <button uiDrawerTrigger>Open Drawer</button>
      <div *uiDrawerBackdrop></div>
      <div *uiDrawerContent>
        <div data-slot="grip" aria-hidden="true"></div>

        <div data-slot="stack">
          <h2 uiDrawerTitle>Move goal</h2>
          <p uiDrawerDescription>Set your daily activity goal.</p>
        </div>

        <div data-slot="row">
          <button
            type="button"
            aria-label="Decrease"
            [disabled]="calories() <= goal.min"
            (click)="calories.set(calories() - goal.step)"
          >
            <svg lucideMinus></svg>
          </button>
          <div data-slot="stack">
            <div aria-live="polite">{{ calories() }}</div>
            <div data-slot="hint">Calories/day</div>
          </div>
          <button
            type="button"
            aria-label="Increase"
            [disabled]="calories() >= goal.max"
            (click)="calories.set(calories() + goal.step)"
          >
            <svg lucidePlus></svg>
          </button>
        </div>

        <div data-slot="stack">
          <button uiDrawerClose data-variant="solid" value="submit">
            Submit
          </button>
          <button uiDrawerClose>Cancel</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly goal = { initial: 350, min: 200, max: 400, step: 10 }

  readonly calories = signal(this.goal.initial)
}

export { Example }
