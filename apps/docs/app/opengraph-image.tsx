import { ogImageSize, renderOgImage } from "@/lib/og-image"

const alt = "UI SDK"
const size = ogImageSize
const contentType = "image/png"

export default function Image() {
  return renderOgImage({
    title:
      "A library of behaviors for agents to build the next generation of user interfaces",
  })
}

export { alt, contentType, size }
