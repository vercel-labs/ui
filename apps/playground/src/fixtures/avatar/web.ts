import "@ui-sdk/web/avatar"
import type { AvatarEvents } from "@ui-sdk/web"
import {
  avatarAction,
  avatarFixture,
  type AvatarFixtureItem,
} from "tests/fixtures/avatar.ts"

function avatar(item: AvatarFixtureItem, id = "") {
  const attributes = [
    item.referrerPolicy && `referrerpolicy="${item.referrerPolicy}"`,
    item.crossOrigin && `crossorigin="${item.crossOrigin}"`,
  ]
    .filter(Boolean)
    .join(" ")
  const image =
    item.src === undefined
      ? ""
      : `<img class="avatar-image" src="${item.src}" alt="${item.name}" ${attributes}>`
  const delay = item.delay ? ` delay="${item.delay}"` : ""
  return `<ui-avatar class="avatar"${id}>${image}<ui-avatar-fallback class="avatar-fallback"${delay}>${item.initials}</ui-avatar-fallback></ui-avatar>`
}

function mount(root: HTMLElement) {
  const [first, ...rest] = avatarFixture.items
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <span id="first">${avatar(first)}</span>
      ${rest.map((item) => avatar(item)).join("")}
      <button id="change">Change image</button>
      <button id="remove">Remove image</button>
      <button id="remount">Remount</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  const status = root.querySelector("output")!
  const holder = root.querySelector<HTMLElement>("#first")!
  holder.addEventListener(
    "loadingstatuschange",
    (event) => {
      const { value, reason } = (event as AvatarEvents["loadingstatuschange"])
        .detail
      status.textContent = avatarAction(value, reason)
    },
    { capture: true }
  )
  root
    .querySelector("#change")!
    .addEventListener("click", () =>
      holder.querySelector("img")?.setAttribute("src", avatarFixture.nextSrc)
    )
  root
    .querySelector("#remove")!
    .addEventListener("click", () => holder.querySelector("img")?.remove())
  root.querySelector("#remount")!.addEventListener("click", () => {
    const src = holder.querySelector("img")?.getAttribute("src") ?? undefined
    holder.innerHTML = avatar({ ...first, src })
  })
}

export { mount }
