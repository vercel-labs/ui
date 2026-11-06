import { DocsArticle } from "@/components/docs-article"
import { DocsLayout } from "@/components/docs-layout"
import { getMDXComponents } from "@/components/mdx"
import { getStarted } from "@/lib/get-started"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: getStarted.title,
  description: getStarted.description,
}

export default function GetStartedPage() {
  const { h2: H2, p: P, Cards, Card } = getMDXComponents()

  return (
    <DocsLayout section="core">
      <DocsArticle
        title={getStarted.title}
        description={getStarted.description}
        next={{ name: "Introduction", url: "/docs/core" }}
        toc={getStarted.toc}
        url="/docs"
      >
        {getStarted.questions.map((question) => (
          <section key={question.id}>
            <H2 id={question.id}>{question.title}</H2>
            <P>{question.description}</P>
            <Cards>
              {question.tiles.map((tile) => (
                <Card key={tile.href} {...tile} />
              ))}
            </Cards>
          </section>
        ))}
      </DocsArticle>
    </DocsLayout>
  )
}
