import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/solid/avatar"
import { render } from "@solidjs/web"
import { createSignal, For, Show, type ComponentProps } from "solid-js"
import {
  avatarAction,
  avatarFixture,
  type AvatarFixtureItem,
} from "tests/fixtures/avatar.ts"

function Fixture() {
  const [action, setAction] = createSignal("")
  const [src, setSrc] = createSignal<string | undefined>(
    avatarFixture.items[0].src
  )
  const [mounts, setMounts] = createSignal(0)
  const [first, ...rest] = avatarFixture.items

  // The item is read through an accessor so the first avatar's source stays live.
  const avatar = (
    item: () => AvatarFixtureItem,
    props: Partial<ComponentProps<typeof Avatar>> = {}
  ) => (
    <Avatar class="avatar" {...props}>
      <Show when={item().src !== undefined}>
        <AvatarImage
          class="avatar-image"
          src={item().src}
          alt={item().name}
          referrerpolicy={item().referrerPolicy}
          crossorigin={item().crossOrigin}
        />
      </Show>
      <AvatarFallback class="avatar-fallback" delay={item().delay}>
        {item().initials}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <div class="fixture">
      <button>Before</button>
      <Show when={mounts() + 1} keyed>
        {avatar(() => ({ ...first, src: src() }), {
          onLoadingStatusChange: (status, details) =>
            setAction(avatarAction(status, details.reason)),
        })}
      </Show>
      <For each={rest}>{(item) => avatar(() => item)}</For>
      <button onClick={() => setSrc(avatarFixture.nextSrc)}>
        Change image
      </button>
      <button onClick={() => setSrc(undefined)}>Remove image</button>
      <button onClick={() => setMounts((count) => count + 1)}>Remount</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
