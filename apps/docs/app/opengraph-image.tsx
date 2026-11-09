import { ogImageSize, renderOgImage } from "@/lib/og-image"

const alt = "UI SDK"
const size = ogImageSize
const contentType = "image/png"

export default function Image() {
  return renderOgImage({
    title:
      "An open source library of behaviors that an agent can use to build components.",
  })
}

export { alt, contentType, size }
