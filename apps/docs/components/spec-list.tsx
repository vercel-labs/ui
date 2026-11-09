import { listOf, sentence, specGroups } from "@/lib/spec-groups"
import { Frame } from "./frame"

// Behavior written as the tests that prove it, with the frameworks they run
// in. A test that runs in fewer than the rest says which.
async function SpecList({ spec, only }: { spec: string; only?: string[] }) {
  const { groups, frameworks } = await specGroups(spec, only)
  return (
    <div className="my-6 flex flex-col gap-4 text-sm">
      {groups.map((group) => (
        <Frame variant="flat" key={group.title} className="overflow-hidden">
          {group.title && (
            <div className="border-b border-border/70 px-4 py-2.5 font-medium text-foreground">
              {sentence(group.title)}
            </div>
          )}
          <ul className="divide-y divide-border/60 text-foreground/75">
            {group.tests.map((test) => (
              <li
                key={test.title}
                className="flex gap-2.5 px-4 py-2.5 leading-relaxed"
              >
                <span aria-hidden className="text-subtle">
                  ✓
                </span>
                <span>
                  {sentence(test.title)}.
                  {test.frameworks.length > 0 &&
                    test.frameworks.length < frameworks.length && (
                      <span className="text-subtle">
                        {" "}
                        {sentence(listOf(test.frameworks))} only.
                      </span>
                    )}
                </span>
              </li>
            ))}
          </ul>
        </Frame>
      ))}
      {frameworks.length > 0 && (
        <p className="text-subtle">Runs in {listOf(frameworks)}.</p>
      )}
    </div>
  )
}

export { SpecList }
