import { Component } from "@angular/core"
import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/angular/avatar"

@Component({
  imports: [Avatar, AvatarFallback, AvatarImage],
  template: `
    <div data-slot="row">
      <span uiAvatar>
        <img uiAvatarImage [src]="person.src" [alt]="person.name" />
        <span *uiAvatarFallback
          ><span aria-hidden="true">CN</span
          ><span data-slot="visually-hidden">shadcn</span></span
        >
      </span>
    </div>
  `,
})
class Example {
  readonly person = {
    name: "shadcn",
    src: "https://github.com/shadcn.png",
  }
}

export { Example }
