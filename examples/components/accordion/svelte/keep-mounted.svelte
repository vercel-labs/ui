<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  } from "@ui-sdk/svelte/accordion"
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
</script>

<Accordion defaultValue={["reply"]}>
  <AccordionItem value="reply">
    <AccordionHeader>
      <AccordionTrigger>
        Reply to this thread
        <ChevronDownIcon aria-hidden="true" />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel keepMounted>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <FieldControl rows="3" placeholder="Write a reply…">
          {#snippet render({ props })}
            <textarea {...props}></textarea>
          {/snippet}
        </FieldControl>
      </Field>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem value="formatting">
    <AccordionHeader>
      <AccordionTrigger>
        Formatting
        <ChevronDownIcon aria-hidden="true" />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>
      <p>Use **bold**, _italics_ and `code`. Links paste as previews.</p>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
