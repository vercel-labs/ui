import { isFramework } from "@/lib/frameworks"
import { sectionLabel } from "@/lib/sections"
import { source } from "@/lib/source"
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// Fonts and the background sit next to this route, and every build reads them from here.
const folder = join(process.cwd(), "app/og/docs/[...slug]")

// The Open Graph image for a docs page: /docs/react/components/menu has
// /og/docs/react/components/menu/image.png.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) return new Response("Not found", { status: 404 })

  const [section] = page.slugs
  const title = isFramework(section) ? `${page.data.title} for ${sectionLabel(section)}` : page.data.title
  const [regular, semibold, background] = await Promise.all([
    readFile(join(folder, "geist-sans-regular.ttf")),
    readFile(join(folder, "geist-sans-semibold.ttf")),
    readFile(join(folder, "background.png")),
  ])

  return new ImageResponse(
    <div style={{ fontFamily: "Geist" }} tw="flex h-full w-full bg-black">
      <img alt="" width={1200} height={628} src={`data:image/png;base64,${background.toString("base64")}`} />
      <div tw="flex flex-col absolute h-full w-[750px] justify-center left-[50px] pr-[50px] pt-[116px] pb-[86px]">
        <div
          style={{ textWrap: "balance" }}
          tw="text-5xl font-medium text-white tracking-tight flex leading-[1.1] mb-4"
        >
          {title}
        </div>
        <div style={{ color: "#8B8B8B", lineHeight: "44px", textWrap: "balance" }} tw="text-[32px]">
          {page.data.description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semibold, weight: 500 },
      ],
    },
  )
}

export const dynamicParams = false

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: [...page.slugs, "image.png"] }))
}
