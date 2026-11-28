import { afterNextRender, Component } from "@angular/core"
import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOutlet,
  DrawerShortcut,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/angular/drawer"
import {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
} from "../../../../../tests/fixtures/drawer"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHandle,
    DrawerOutlet,
    DrawerShortcut,
    DrawerTitle,
    DrawerTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiDrawer
        [controller]="controller"
        [defaultOpen]="options.defaultOpen"
        [snapPoints]="options.snapPoints"
        [defaultSnapPoint]="options.defaultSnapPoint"
        [side]="options.side"
        [modalAbove]="options.modalAbove"
        [dismissible]="options.dismissible"
        [expandOnScroll]="options.expandOnScroll"
        [driver]="options.driver"
        [modal]="options.modal"
        [container]="options.container"
        [themeColor]="options.themeColor"
        (beforeOpenChange)="record('drawer:' + $event.value, $event.reason)"
        (beforeSnapPointChange)="record($event.value, $event.reason)"
        (dismissAttempt)="record('attempt', $event.reason)"
      >
        <button uiDrawerTrigger>{{ f.trigger }}</button>
        @if (parts.backdrop) {
          <div *uiDrawerBackdrop class="drawer-backdrop"></div>
        }
        <div *uiDrawerContent class="drawer">
          <button
            uiDrawerHandle
            class="handle"
            [attr.aria-label]="f.handle"
          ></button>
          <h2 uiDrawerTitle class="title">{{ f.title }}</h2>
          <p uiDrawerDescription class="description">{{ f.description }}</p>
          @if (parts.field) {
            <label class="field">
              {{ f.field }}
              <input />
            </label>
          }
          @if (parts.scroll) {
            <ul class="scroll" [attr.aria-label]="f.scroll.label" tabindex="0">
              @for (item of f.scroll.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          }
          @if (parts.grow) {
            <button (click)="more.set(true)">{{ f.grow.button }}</button>
            @if (more()) {
              <p class="more">{{ f.grow.text }}</p>
            }
          }
          <div class="actions">
            <button (click)="action.set('submit')">{{ f.action }}</button>
            <button uiDrawerClose>{{ f.close }}</button>
          </div>
          @if (parts.nested) {
            <ng-container
              uiDrawer
              (beforeOpenChange)="
                record('nested:' + $event.value, $event.reason)
              "
            >
              <button uiDrawerTrigger>{{ f.nested.trigger }}</button>
              @if (parts.backdrop) {
                <div *uiDrawerBackdrop class="drawer-backdrop"></div>
              }
              <div *uiDrawerContent class="drawer">
                <h2 uiDrawerTitle class="title">{{ f.nested.title }}</h2>
                <button uiDrawerClose>{{ f.nested.close }}</button>
              </div>
            </ng-container>
          }
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.open()">{{ f.controller }}</button>
      <button (click)="action.set('page')">{{ f.page }}</button>
      @if (parts.shortcut) {
        <button
          uiDrawerTrigger
          [controller]="controller"
          [shortcut]="f.shortcut.keys"
        >
          {{ f.shortcut.trigger }} <kbd uiDrawerShortcut></kbd>
        </button>
      }
      @if (parts.outlet) {
        <div
          uiDrawerOutlet
          [controller]="controller"
          class="outlet"
          role="region"
          [attr.aria-label]="f.outlet.label"
          [keyframes]="f.outlet.keyframes"
        ></div>
      }
    </div>
  `,
})
class Fixture {
  readonly f = drawerFixture
  readonly controller = createDrawerController()
  readonly options: {
    defaultOpen?: boolean
    snapPoints?: number[]
    defaultSnapPoint?: number
    side?: "bottom" | "top" | "left" | "right" | "start" | "end"
    modalAbove?: number
    dismissible?: boolean
    expandOnScroll?: boolean
    driver?: "pointer" | "scroll-snap"
    modal?: boolean | "trap-focus"
    container?: HTMLElement | null
    themeColor?: boolean
  } = drawerOptions()
  readonly parts = drawerParts()
  readonly action = state("")
  readonly more = state(false)

  constructor() {
    // In the browser only: the server has no window.
    afterNextRender(() => exposeDrawerFixture(this.controller))
  }

  record(what: unknown, reason: string) {
    recordDrawer(`${what}:${reason}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
