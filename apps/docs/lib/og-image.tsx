import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// The background already holds the frame, the logo, the homepage drawing and the
// footer, rendered at twice the size. Only the text is drawn here.
const folder = join(process.cwd(), "app/og")

const size = { width: 1200, height: 630 }

async function renderOgImage({ title, description }: { title: string; description?: string }) {
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
      <div tw="absolute flex flex-col left-[112px] bottom-[144px] w-[452px]">
        <div tw="flex text-[52px] leading-[1.04] tracking-[-2.34px] text-[#0a0a0a]">{title}</div>
        {description && (
          <div
            style={{ fontWeight: 300, textWrap: "balance" }}
            tw="mt-[14px] max-w-[380px] text-[24px] leading-[1.32] tracking-[-0.48px] text-[#6e6e6e]"
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
    },
  )
}

export { renderOgImage, size as ogImageSize }
