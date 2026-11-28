import { Component } from "@angular/core"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarLoadingStatusChange,
} from "@ui-sdk/angular/avatar"
import {
  avatarAction,
  avatarFixture,
} from "../../../../../tests/fixtures/avatar"

import { mountAngular, state } from "../../angular-mount"

const [first, ...rest] = avatarFixture.items

@Component({
  imports: [Avatar, AvatarFallback, AvatarImage],
  template: `
    <div class="fixture">
      <button>Before</button>
      @for (key of [mounts()]; track key) {
        <span
          uiAvatar
          class="avatar"
          (beforeLoadingStatusChange)="onStatus($event)"
        >
          @if (src() !== undefined) {
            <img
              uiAvatarImage
              class="avatar-image"
              [src]="src()"
              [alt]="first.name"
            />
          }
          <span *uiAvatarFallback class="avatar-fallback">{{
            first.initials
          }}</span>
        </span>
      }
      @for (item of rest; track item.name) {
        <span uiAvatar class="avatar">
          @if (item.src !== undefined) {
            <img
              uiAvatarImage
              class="avatar-image"
              [src]="item.src"
              [alt]="item.name"
              [attr.referrerpolicy]="item.referrerPolicy"
              [attr.crossorigin]="item.crossOrigin"
            />
          }
          <span
            *uiAvatarFallback="{ delay: item.delay }"
            class="avatar-fallback"
            >{{ item.initials }}</span
          >
        </span>
      }
      <button (click)="src.set(avatarFixture.nextSrc)">Change image</button>
      <button (click)="src.set(undefined)">Remove image</button>
      <button (click)="remount()">Remount</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly avatarFixture = avatarFixture
  readonly first = first
  readonly rest = rest

  readonly action = state("")

  readonly src = state<string | undefined>(first.src)

  readonly mounts = state(0)

  onStatus(change: AvatarLoadingStatusChange) {
    this.action.set(avatarAction(change.value, change.reason))
  }

  remount() {
    this.mounts.set(this.mounts() + 1)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
