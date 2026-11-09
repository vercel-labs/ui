import { DocsLayout } from "@/components/docs-layout"
import { isSection } from "@/lib/sections"
import { notFound } from "next/navigation"

export default async function Layout({
  children,
  params,
}: LayoutProps<"/docs/[section]">) {
  const { section } = await params
  if (!isSection(section)) {
    notFound()
  }
  return <DocsLayout section={section}>{children}</DocsLayout>
}
