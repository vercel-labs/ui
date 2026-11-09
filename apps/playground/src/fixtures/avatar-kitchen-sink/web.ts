import "@ui-sdk/web/avatar"
import type { AvatarEvents } from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  images,
  initialSource,
  sourceControls,
  statusMessage,
  type Person,
  type Variant,
} from "./variants"

// The <img> a source renders: none for undefined, one without `src` for null.
function imageMarkup(variant: Variant, person: Person, source: string | null) {
  const props = variant.imageProps ?? {}
  const attributes = [
    source !== null && `src="${source}"`,
    `alt="${person.name}"`,
    props.crossOrigin && `crossorigin="${props.crossOrigin}"`,
    props.referrerPolicy && `referrerpolicy="${props.referrerPolicy}"`,
    props.srcSet && `srcset="${props.srcSet}"`,
    props.sizes && `sizes="${props.sizes}"`,
  ]
  return `<img class="${classes.image}" ${attributes.filter(Boolean).join(" ")}>`
}

// Render functions are React and Vue only, so those variants show the default parts here.
function avatarMarkup(variant: Variant, person: Person, index: number) {
  const source = initialSource(variant, person, index)
  const image = source === undefined ? "" : imageMarkup(variant, person, source)
  const delay = variant.delay === undefined ? "" : ` delay="${variant.delay}"`
  const debug = variant.debug ? " debug" : ""
  return `<ui-avatar class="${classes.avatar} ${classes.sizes[variant.size ?? "md"]}" data-person="${index}"${debug}>${image}<ui-avatar-fallback class="${classes.fallback}"${delay}>${person.initials}</ui-avatar-fallback></ui-avatar>`
}

function markup(variant: Variant) {
  const avatars = variant.people
    .map((person, index) => avatarMarkup(variant, person, index))
    .join("")
  return variant.people.length > 1
    ? `<div class="${classes.group}">${avatars}</div>`
    : avatars
}

// Sets the first avatar's image the way the other frameworks render it.
function setSource(
  avatar: HTMLElement,
  variant: Variant,
  person: Person,
  source: string | null | undefined
) {
  const current = avatar.querySelector(":scope > img")
  if (source === undefined) {
    return current?.remove()
  }
  if (!current) {
    return avatar.insertAdjacentHTML(
      "afterbegin",
      imageMarkup(variant, person, source)
    )
  }
  if (source === null) {
    current.removeAttribute("src")
  } else {
    current.setAttribute("src", source)
  }
}

function listen(slot: HTMLElement, variant: Variant, env: Env) {
  slot.addEventListener(
    "loadingstatuschange",
    (event) => {
      const { value, reason } = (event as AvatarEvents["loadingstatuschange"])
        .detail
      const index = Number((event.target as HTMLElement).dataset.person)
      env.log(statusMessage(variant.people[index], value, reason))
    },
    { capture: true }
  )
}

function controls(slot: HTMLElement, variant: Variant, env: Env) {
  const first = slot.querySelector<HTMLElement>("ui-avatar")!
  const [person] = variant.people
  if (variant.arrivesAfter && person.image) {
    setTimeout(
      () => setSource(first, variant, person, images[person.image!]),
      variant.arrivesAfter
    )
  }
  if (variant.sources) {
    env.controls(
      sourceControls.map(([label, next]) => [
        label,
        () => setSource(first, variant, person, next),
      ])
    )
  }
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = markup(variant)
    listen(slot, variant, env)
    controls(slot, variant, env)
  })
}

export { mount }
