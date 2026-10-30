import { Combobox } from "../src/combobox"
import { Listbox } from "../src/listbox"
import { Select } from "../src/select"

declare const labels: string[]
declare const setLabels: (labels: string[]) => void

// A list held in a variable types `multiple` as a list written out does.
;<Combobox multiple value={labels} onValueChange={(value) => setLabels(value)} />
;<Select multiple value={labels} onValueChange={(value) => setLabels(value)} />
;<Listbox multiple value={labels} onValueChange={(value) => setLabels(value)} />
