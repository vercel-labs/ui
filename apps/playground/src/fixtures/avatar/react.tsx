import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  avatarAction,
  avatarFixture,
  type AvatarFixtureItem,
} from "tests/fixtures/avatar.ts"

function Fixture() {
  const [action, setAction] = React.useState("")
  const [src, setSrc] = React.useState<string | undefined>(
    avatarFixture.items[0].src
  )
  const [mounts, setMounts] = React.useState(0)
  const [first, ...rest] = avatarFixture.items

  const avatar = (
    item: AvatarFixtureItem,
    props: Partial<React.ComponentProps<typeof Avatar>> = {}
  ) => (
    <Avatar className="avatar" {...props}>
      {item.src !== undefined && (
        <AvatarImage
          className="avatar-image"
          src={item.src}
          alt={item.name}
          referrerPolicy={item.referrerPolicy}
          crossOrigin={item.crossOrigin}
        />
      )}
      <AvatarFallback className="avatar-fallback" delay={item.delay}>
        {item.initials}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <div className="fixture">
      <button>Before</button>
      <React.Fragment key={mounts}>
        {avatar(
          { ...first, src },
          {
            onLoadingStatusChange: (status, details) =>
              setAction(avatarAction(status, details.reason)),
          }
        )}
      </React.Fragment>
      {rest.map((item) => (
        <React.Fragment key={item.name}>{avatar(item)}</React.Fragment>
      ))}
      <button onClick={() => setSrc(avatarFixture.nextSrc)}>
        Change image
      </button>
      <button onClick={() => setSrc(undefined)}>Remove image</button>
      <button onClick={() => setMounts((count) => count + 1)}>Remount</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
