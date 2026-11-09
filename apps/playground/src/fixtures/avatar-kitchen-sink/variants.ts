import type { AvatarLoadingStatus } from "@ui-sdk/core/avatar"

// Every scenario in the avatar kitchen sink. Each framework renders the same list.

// A head and shoulders on a colored square, inline so no server is needed.
const portrait = (background: string, figure: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${background}"/><circle cx="32" cy="26" r="12" fill="${figure}"/><path d="M10 64c2-14 12-20 22-20s20 6 22 20z" fill="${figure}"/></svg>`
  )}`

const images = {
  ada: portrait("#c7d2fe", "#4338ca"),
  grace: portrait("#fde68a", "#b45309"),
  alan: portrait("#bbf7d0", "#15803d"),
  // Nothing is served here, so it fails.
  broken: "/does-not-exist.png",
}

type Person = { name: string; initials: string; image?: keyof typeof images }

const people = {
  ada: { name: "Ada Lovelace", initials: "AL", image: "ada" },
  grace: { name: "Grace Hopper", initials: "GH", image: "grace" },
  alan: { name: "Alan Turing", initials: "AT", image: "alan" },
  broken: { name: "Katherine Johnson", initials: "KJ", image: "broken" },
  none: { name: "Hedy Lamarr", initials: "HL" },
} satisfies Record<string, Person>

type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // One avatar each. More than one renders as a group.
  people: Person[]
  // The fallback's delay, in milliseconds.
  delay?: number
  // Attributes the image passes through as they are.
  imageProps?: {
    crossOrigin?: "anonymous"
    referrerPolicy?: "no-referrer"
    srcSet?: string
    sizes?: string
  }
  size?: "sm" | "md" | "lg"
  place?: "rtl"
  // The first avatar's image is added this many milliseconds after it mounts.
  arrivesAfter?: number
  // Buttons that change, break and remove the first avatar's image.
  sources?: boolean
  // A render function, in React and Vue, for this part.
  render?: "root" | "image" | "fallback"
  debug?: boolean
  // Where the first avatar's status settles, which the smoke spec checks.
  settles: AvatarLoadingStatus
}

// The first avatar's image: undefined renders no <img>, null renders one without a `src`.
type Source = string | null | undefined

// What the source buttons set the first avatar's image to.
const sourceControls: [string, Source][] = [
  ["src: Grace", images.grace],
  ["src: broken", images.broken],
  ["remove src", null],
  ["remove image", undefined],
  ["src: Ada", images.ada],
]

// The image a person starts with, or none while it's still to arrive.
const initialSource = (
  variant: Variant,
  person: Person,
  index: number
): Source =>
  person.image && !(index === 0 && variant.arrivesAfter)
    ? images[person.image]
    : undefined

const statusMessage = (person: Person, status: string, reason: string) =>
  `${person.name}: ${status} (${reason})`

// What the props chips show.
function chipsOf(variant: Variant) {
  const [first] = variant.people
  return {
    ...(variant.people.length === 1 && {
      src: first.image ? images[first.image] : "none",
    }),
    ...(variant.people.length > 1 && { avatars: variant.people.length }),
    ...(variant.delay !== undefined && { delay: variant.delay }),
    ...variant.imageProps,
    ...(variant.size && { size: variant.size }),
    ...(variant.arrivesAfter && { arrivesAfter: variant.arrivesAfter }),
    ...(variant.render && { render: variant.render }),
    ...(variant.debug && { debug: true }),
  }
}

const variants: Variant[] = [
  {
    id: "loaded",
    section: "Images",
    title: "Image loads",
    people: [people.ada],
    settles: "loaded",
  },
  {
    id: "broken",
    section: "Images",
    title: "Broken image",
    note: "The fallback stays.",
    people: [people.broken],
    settles: "error",
  },
  {
    id: "no-image",
    section: "Images",
    title: "No image",
    note: "Only the fallback, and the status stays idle.",
    people: [people.none],
    settles: "idle",
  },
  {
    id: "late",
    section: "Images",
    title: "Image added after 1.5s",
    note: "The fallback shows until the image arrives and loads.",
    people: [people.ada],
    arrivesAfter: 1500,
    settles: "loaded",
  },
  {
    id: "debug",
    section: "Images",
    title: "debug",
    note: "Logs every status change to the console.",
    people: [people.ada],
    debug: true,
    settles: "loaded",
  },

  {
    id: "delay-0",
    section: "Fallback delay",
    title: "delay={0}",
    note: "The fallback shows at once.",
    people: [people.broken],
    delay: 0,
    settles: "error",
  },
  {
    id: "delay-300",
    section: "Fallback delay",
    title: "delay={300}",
    people: [people.broken],
    delay: 300,
    settles: "error",
  },
  {
    id: "delay-1000",
    section: "Fallback delay",
    title: "delay={1000}",
    note: "Empty for a second, then the fallback.",
    people: [people.broken],
    delay: 1000,
    settles: "error",
  },
  {
    id: "delay-loaded",
    section: "Fallback delay",
    title: "Fast image with delay={1000}",
    note: "The fallback never flashes.",
    people: [people.ada],
    delay: 1000,
    settles: "loaded",
  },
  {
    id: "delay-late",
    section: "Fallback delay",
    title: "delay={300}, image after 1.5s",
    note: "Empty, then the fallback at 300ms, then the image.",
    people: [people.grace],
    delay: 300,
    arrivesAfter: 1500,
    settles: "loaded",
  },

  {
    id: "sources",
    section: "Source changes",
    title: "Change, break and remove the image",
    note: "A loaded image keeps showing while the next one loads.",
    people: [people.ada],
    sources: true,
    settles: "loaded",
  },
  {
    id: "sources-none",
    section: "Source changes",
    title: "Starts without an image",
    people: [people.none],
    sources: true,
    settles: "idle",
  },
  {
    id: "sources-delay",
    section: "Source changes",
    title: "Changes with delay={600}",
    note: "Breaking the image after it loaded shows the fallback at once.",
    people: [people.alan],
    delay: 600,
    sources: true,
    settles: "loaded",
  },

  {
    id: "cross-origin",
    section: "Image attributes",
    title: "crossOrigin",
    people: [people.alan],
    imageProps: { crossOrigin: "anonymous" },
    settles: "loaded",
  },
  {
    id: "referrer-policy",
    section: "Image attributes",
    title: "referrerPolicy",
    people: [people.grace],
    imageProps: { referrerPolicy: "no-referrer" },
    settles: "loaded",
  },
  {
    id: "src-set",
    section: "Image attributes",
    title: "srcSet and sizes",
    note: "Green on 1x screens, yellow on 2x.",
    people: [people.alan],
    imageProps: {
      srcSet: `${images.alan} 1x, ${images.grace} 2x`,
      sizes: "40px",
    },
    settles: "loaded",
  },
  {
    id: "cross-origin-broken",
    section: "Image attributes",
    title: "crossOrigin and referrerPolicy, broken",
    people: [people.broken],
    imageProps: { crossOrigin: "anonymous", referrerPolicy: "no-referrer" },
    settles: "error",
  },

  {
    id: "size-sm",
    section: "Sizes",
    title: "Small",
    people: [people.ada],
    size: "sm",
    settles: "loaded",
  },
  {
    id: "size-md",
    section: "Sizes",
    title: "Medium",
    people: [people.none],
    size: "md",
    settles: "idle",
  },
  {
    id: "size-lg",
    section: "Sizes",
    title: "Large",
    people: [people.grace],
    size: "lg",
    settles: "loaded",
  },
  {
    id: "size-lg-broken",
    section: "Sizes",
    title: "Large fallback",
    people: [people.broken],
    size: "lg",
    settles: "error",
  },

  {
    id: "group",
    section: "Groups",
    title: "Avatar group",
    note: "Loaded, broken and missing images side by side.",
    people: [people.ada, people.grace, people.broken, people.none, people.alan],
    settles: "loaded",
  },
  {
    id: "group-delay",
    section: "Groups",
    title: "Group with delay={500}",
    people: [people.alan, people.broken, people.none],
    delay: 500,
    settles: "loaded",
  },
  {
    id: "group-rtl",
    section: "Groups",
    title: "Right to left",
    note: "The first avatar sits on the right.",
    people: [people.ada, people.broken, people.grace],
    place: "rtl",
    settles: "loaded",
  },

  {
    id: "render-root",
    section: "Custom rendering",
    title: "Root as a div",
    note: "React and Vue. Its title shows the status.",
    people: [people.ada],
    render: "root",
    settles: "loaded",
  },
  {
    id: "render-image",
    section: "Custom rendering",
    title: "Image render function",
    note: "React and Vue. The image is outlined.",
    people: [people.grace],
    render: "image",
    settles: "loaded",
  },
  {
    id: "render-fallback",
    section: "Custom rendering",
    title: "Fallback content from state",
    note: "React and Vue. The fallback shows the status.",
    people: [people.broken],
    render: "fallback",
    settles: "error",
  },
]

export {
  chipsOf,
  images,
  initialSource,
  people,
  type Person,
  type Source,
  sourceControls,
  statusMessage,
  type Variant,
  variants,
}
