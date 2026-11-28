import { Component, Directive, inject, input } from "@angular/core"
import { usePart, usePrimitive } from "@ui-sdk/angular/primitive"
import { reactions } from "../reactions-keyboard"

@Directive({ selector: "[appReactions]" })
class Reactions {
  readonly handle = usePrimitive(reactions, () => ({}))

  constructor() {
    usePart(this.handle, "root")
  }
}

@Directive({ selector: "[appReaction]" })
class Reaction {
  readonly value = input.required<string>()

  constructor() {
    usePart(inject(Reactions).handle, "reaction", () => ({
      value: this.value(),
    }))
  }
}

@Component({
  imports: [Reaction, Reactions],
  template: `
    <div appReactions>
      <button appReaction value="thumbs-up">👍</button>
      <button appReaction value="heart">❤️</button>
      <button appReaction value="laugh">😂</button>
      <button appReaction value="celebrate">🎉</button>
    </div>
  `,
})
class Example {}

export { Example, Reaction, Reactions }
