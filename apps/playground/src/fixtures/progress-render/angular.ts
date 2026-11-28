import { Component } from "@angular/core"
import { Avatar, AvatarFallback } from "@ui-sdk/angular/avatar"
import { OTPInput, OTPInputSlot } from "@ui-sdk/angular/otp-input"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/angular/progress"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Avatar,
    AvatarFallback,
    OTPInput,
    OTPInputSlot,
    Progress,
    ProgressIndicator,
    ProgressTrack,
    ProgressValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <section
        uiProgress
        #progress="uiProgress"
        aria-label="Export"
        [value]="value()"
        [class]="'gauge is-' + progress.state().status"
      >
        <span uiProgressValue>{{ progress.state().percent }}% done</span>
        <div uiProgressTrack class="gauge-track">
          <div uiProgressIndicator class="gauge-indicator"></div>
        </div>
      </section>
      <div uiAvatar class="avatar">
        <span
          uiAvatarFallback
          #fallback="uiAvatarFallback"
          [class]="'avatar-fallback is-' + fallback.state().loadingStatus"
        >
          RF
        </span>
      </div>
      <section uiOTPInput aria-label="PIN" class="otp" [maxLength]="4">
        @for (index of [0, 1, 2, 3]; track index) {
          <div
            uiOTPInputSlot
            #slot="uiOTPInputSlot"
            class="otp-slot"
            [index]="index"
            [class.is-active]="slot.state().active"
            [textContent]="slot.state().char ?? '·'"
          ></div>
        }
      </section>
      <button (click)="value.set(100)">Finish</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  readonly value = state(40)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
