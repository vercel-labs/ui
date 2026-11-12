import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// The background already holds the logo and a Select drawn with its behaviors,
// rendered at twice the size. Only the text is drawn here. The
// fonts have no kerning table: Satori spaces words unevenly with one.
const folder = join(process.cwd(), "app/og")

const size = { width: 1200, height: 630 }

async function renderOgImage({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  const [regular, light, background] = await Promise.all([
    readFile(join(folder, "geist-regular.ttf")),
    readFile(join(folder, "geist-light.ttf")),
    readFile(join(folder, "background.png")),
  ])

  return new ImageResponse(
    <div style={{ fontFamily: "Geist" }} tw="flex h-full w-full">
      <img
        alt=""
        width={size.width}
        height={size.height}
        src={`data:image/png;base64,${background.toString("base64")}`}
      />
      <div tw="absolute flex flex-col left-[64px] top-[186px] w-[500px]">
        <div tw="flex text-[56px] leading-[0.99] tracking-[-2.52px] text-[#0a0a0a]">
          {title}
        </div>
        {description && (
          <div
            style={{ fontWeight: 300, textWrap: "balance" }}
            tw="mt-[22px] max-w-[460px] text-[26px] leading-[1.32] tracking-[-0.52px] text-[#6e6e6e]"
          >
            {description}
          </div>
        )}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: light, weight: 300 },
      ],
    }
  )
}

export { renderOgImage, size as ogImageSize }
