// What every Avatar fixture renders. Labels, sources and order are the
// contract the specs rely on, so change them here and nowhere else. Images
// come from /avatars/, which specs serve with `routeAvatars` (see
// tests/specs/avatar.helpers.ts); without it they fail and fallbacks show.
type AvatarFixtureItem = {
  name: string
  initials: string
  src?: string
  delay?: number
  referrerPolicy?: "no-referrer"
  crossOrigin?: "anonymous"
}

const avatarFixture = {
  // The first avatar's image changes with the "Change image" button and
  // goes with "Remove image". "Remount" renders the first avatar again.
  items: [
    { name: "Ada Lovelace", initials: "AL", src: "/avatars/ada.png" },
    { name: "Grace Hopper", initials: "GH", src: "/avatars/missing.png" },
    { name: "Alan Turing", initials: "AT" },
    {
      name: "Katherine Johnson",
      initials: "KJ",
      src: "/avatars/slow.png",
      delay: 600,
    },
    {
      name: "Hedy Lamarr",
      initials: "HL",
      src: "/avatars/private.png",
      referrerPolicy: "no-referrer",
      crossOrigin: "anonymous",
    },
  ] satisfies AvatarFixtureItem[] as AvatarFixtureItem[],
  nextSrc: "/avatars/ada-2.png",
}

// What the "Last action" status says after the first avatar's status changes.
const avatarAction = (status: string, reason: string) =>
  `ada: ${status} (${reason})`

// A 2x2 PNG.
const avatarPng =
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAEElEQVR4nGMwTpsJRAwQCgAf7gTJ/qZDUgAAAABJRU5ErkJggg=="

export { avatarAction, avatarFixture, type AvatarFixtureItem, avatarPng }
