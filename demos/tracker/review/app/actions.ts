"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { store, type Comment } from "@/lib/comments"
import { readSource } from "@/lib/files"
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
  const file = String(input.file).slice(0, 500)
  const { line, endLine } = await linesIn(input.framework, file, input.line, input.endLine)
  return write((current) =>
    current.save({
      id: randomUUID(),
      framework: input.framework,
      file,
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

// The comment's lines, kept only when they're lines of the file.
async function linesIn(framework: Comment["framework"], file: string, line: unknown, endLine: unknown) {
  const source = await readSource(framework, file)
  const count = source ? source.code.split("\n").length : 0
  const isLine = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= count
  if (!isLine(line)) return { line: null, endLine: null }
  return { line, endLine: isLine(endLine) && endLine > line ? endLine : null }
}

async function removeComment(id: string) {
  if (!uuid.test(id)) return { error: null }
  return write((current) => current.remove(id))
}

export { addComment, removeComment }
