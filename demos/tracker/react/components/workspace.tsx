"use client"

import type { ReactNode } from "react"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable"

const cookieStorage = {
  getItem: (key: string) => {
    const value = document.cookie.match(
      new RegExp(`(?:^|; )${key}=([^;]*)`)
    )?.[1]
    return value === undefined ? null : decodeURIComponent(value)
  },
  setItem: (key: string, value: string) => {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000`
  },
}

function Workspace({
  sizes,
  detail,
  children,
}: {
  sizes: [number, number]
  detail: ReactNode
  children: ReactNode
}) {
  return (
    <Resizable
      autoSaveId="tracker"
      storage={cookieStorage}
      className="min-h-0 flex-1"
    >
      <ResizablePanel
        id="list"
        defaultSize={detail ? sizes[0] : 100}
        minSize={30}
        className={
          detail
            ? "flex min-w-0 flex-col max-md:hidden"
            : "flex min-w-0 flex-col"
        }
      >
        {children}
      </ResizablePanel>
      {detail && (
        <>
          <ResizableHandle
            aria-label="Resize issue details"
            className="max-md:hidden"
          />
          <ResizablePanel
            id="detail"
            defaultSize={sizes[1]}
            minSize={28}
            className="flex min-w-0 flex-col max-md:flex-1!"
          >
            {detail}
          </ResizablePanel>
        </>
      )}
    </Resizable>
  )
}

export { Workspace }
