import { Component, Directive, inject, input } from "@angular/core"
import { usePart, usePrimitive } from "@ui-sdk/angular/primitive"
import { reactions } from "../reactions"

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
    <div appReactions aria-label="Reactions">
      <button appReaction value="thumbs-up" aria-label="Thumbs up">👍</button>
      <button appReaction value="heart" aria-label="Heart">❤️</button>
      <button appReaction value="laugh" aria-label="Laugh">😂</button>
      <button appReaction value="celebrate" aria-label="Celebrate">🎉</button>
    </div>
  `,
})
class Example {}

export { Example, Reaction, Reactions }
