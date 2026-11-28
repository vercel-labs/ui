import { Component, DestroyRef, inject } from "@angular/core"
import { Tree } from "@ui-sdk/angular/tree"
import { treeLinksFixture } from "../../../../../tests/fixtures/tree"
import { mountAngular, state } from "../../angular-mount"
import { Items } from "../tree/angular"

// A tree of links, rendered with the tree fixture's classes. The current page follows the address.
@Component({
  imports: [Items, Tree],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTree
        class="tree"
        mode="none"
        [attr.aria-label]="f.label"
        [items]="f.items"
        [current]="current()"
      >
        <div [fixtureItems]="f.items"></div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ current() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = treeLinksFixture
  readonly current = state(location.hash.slice(1) || "usage")

  constructor() {
    const changed = () => this.current.set(location.hash.slice(1))
    window.addEventListener("hashchange", changed)
    inject(DestroyRef).onDestroy(() =>
      window.removeEventListener("hashchange", changed)
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
