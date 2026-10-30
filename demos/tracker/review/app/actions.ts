"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { store, type Comment } from "@/lib/comments"
import { isFramework } from "@/lib/frameworks"

const missingStore = "Comments need a Blob store: connect one to this project and redeploy."

async function write(task: (current: NonNullable<typeof store>) => Promise<void>) {
  if (!store) return { error: missingStore }
  try {
    await task(store)
  } catch (error) {
    console.error(error)
    return { error: "Couldn't save that. Try again." }
  }
  revalidatePath("/")
  return { error: null }
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

async function addComment(input: Omit<Comment, "id" | "createdAt">) {
  const body = String(input.body).trim().slice(0, 5000)
  const author = String(input.author).trim().slice(0, 80)
  if (!body || !author || !isFramework(input.framework)) return { error: null }
  const line = Number.isInteger(input.line) ? input.line : null
  const endLine =
    line !== null &&
    typeof input.endLine === "number" &&
    Number.isInteger(input.endLine) &&
    input.endLine > line
      ? input.endLine
      : null
  return write((current) =>
    current.save({
      id: randomUUID(),
      framework: input.framework,
      file: String(input.file).slice(0, 500),
      line,
      endLine,
      quote: input.quote ? String(input.quote).slice(0, 2000) : null,
      path: String(input.path).slice(0, 500),
      author,
      body,
      createdAt: new Date().toISOString(),
    }),
  )
}

async function removeComment(id: string) {
  if (!uuid.test(id)) return { error: null }
  return write((current) => current.remove(id))
}

export { addComment, removeComment }
