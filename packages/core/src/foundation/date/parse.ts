// Reading a date someone typed, in the order their locale writes dates. The
// order, separators and month names all come from `Intl`, so "16.10.2026" is
// October 16 in German, "10/16/2026" is in American English, and "16 oct 2026"
// works in French and English alike.
import { dateFormatter, monthNames, weekdayNames } from "./format"
import { dateParts, isoDate, type ISODate } from "./plain-date"

/**
 * A date field's part, in the order a locale writes it.
 * @stable
 */
type DateField = "year" | "month" | "day"

/**
 * How a locale writes a date in numbers, from `datePattern`.
 * @stable
 */
type DatePattern = {
  /** The fields in the locale's order, like `["month", "day", "year"]` in American English. */
  fields: DateField[]
  /** What goes between the fields, like `"/"` or `"."`. */
  separator: string
  /** A placeholder for an empty field, like `"MM/DD/YYYY"`, `"TT.MM.JJJJ"` in German or `"ДД.ММ.ГГГГ"` in Russian. */
  placeholder: string
  /** December 31 of this year in the locale's numeric form, like `"12/31/2026"`, for a hint that shows the order. */
  example: string
}

// Marks that set text direction, which right-to-left locales put around
// separators. They're invisible, so neither a hint nor a parser should keep them.
const directionMarks = /[‎‏؜]/g

const fieldLetters = { year: "Y", month: "M", day: "D" }
const numericDate: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" }

const patterns = new Map<string, DatePattern>()

/**
 * How a locale writes a date in numbers: its field order, separator, a placeholder and an example.
 * @stable
 */
function datePattern(locale?: string) {
  const key = locale ?? ""
  let pattern = patterns.get(key)
  if (!pattern) patterns.set(key, (pattern = readPattern(locale)))
  return pattern
}

function readPattern(locale: string | undefined) {
  const year = new Date().getFullYear()
  const parts = dateFormatter(locale, numericDate).formatToParts(Date.UTC(year, 11, 31))
  const names = fieldNames(locale)
  const fields: DateField[] = []
  let separator = ""
  let placeholder = ""
  for (const part of parts) {
    const value = part.value.replace(directionMarks, "")
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      fields.push(part.type)
      placeholder += names[part.type].repeat(part.type === "year" ? 4 : 2)
    } else {
      if (fields.length === 1 && !separator) separator = value
      placeholder += value
    }
  }
  const example = parts.map((part) => part.value.replace(directionMarks, "")).join("")
  return { fields, separator, placeholder, example }
}

// The letter each field's placeholder repeats: the first letter of its name in
// the locale when the script has capitals ("T" for Tag, "J" for Jahr), else
// the English one.
function fieldNames(locale: string | undefined) {
  try {
    const names = new Intl.DisplayNames(locale, { type: "dateTimeField" })
    const letter = (field: DateField) => {
      const first = names.of(field)?.[0]?.toLocaleUpperCase(locale)
      return first && first !== first.toLocaleLowerCase(locale) ? first : fieldLetters[field]
    }
    return { year: letter("year"), month: letter("month"), day: letter("day") }
  } catch {
    return fieldLetters
  }
}

/**
 * The ISO date in text someone typed, or undefined when it isn't a real date.
 * It reads the locale's order with any separator ("16.10.2026", "16/10/26",
 * "16 10 2026"), digits alone ("16102026"), month names ("16 Oct 2026",
 * "October 16"), the locale's own digits, and ISO dates. A missing year is
 * `referenceDate`'s, today's by default. Years read in the locale's calendar,
 * like Buddhist years in Thai. A two-digit year lands in the hundred years that
 * end 20 years after the reference year: "26" is 2026 and "70" is 1970 in 2026.
 * @stable
 */
function parseDate(text: string, locale?: string, options: { referenceDate?: ISODate } = {}) {
  const normalized = toLatinDigits(text.replace(directionMarks, "").trim(), locale)
  if (!normalized) return undefined
  if (dateParts(normalized)) return normalized
  const { fields } = datePattern(locale)
  const referenceYear = Number((options.referenceDate ?? "").slice(0, 4)) || new Date().getFullYear()

  let namedMonth: number | undefined
  const numbers: string[] = []
  for (const token of normalized.toLocaleLowerCase(locale).match(/\p{N}+|\p{L}+/gu) ?? []) {
    if (/^\d+$/.test(token)) {
      numbers.push(token)
      continue
    }
    const month = monthFromName(token, locale)
    if (month !== undefined && namedMonth === undefined) namedMonth = month
    else if (!isPatternWord(token, locale)) return undefined
  }

  const values: Partial<Record<DateField, string>> = {}
  if (namedMonth !== undefined) {
    const rest = fields.filter((field) => field !== "month")
    if (numbers.length > 2 || numbers.length === 0) return undefined
    // With one number beside the name, it's the day: "October 16".
    const order = numbers.length === 1 ? ["day" as const] : rest
    order.forEach((field, index) => (values[field] = numbers[index]))
    values.month = String(namedMonth)
  } else if (numbers.length === 1) {
    const digits = numbers[0]!
    if (digits.length !== 8 && digits.length !== 6) return undefined
    const yearLength = digits.length - 4
    let offset = 0
    for (const field of fields) {
      const length = field === "year" ? yearLength : 2
      values[field] = digits.slice(offset, (offset += length))
    }
  } else if (numbers.length === 2 || numbers.length === 3) {
    const order = numbers.length === 3 ? fields : fields.filter((field) => field !== "year")
    order.forEach((field, index) => (values[field] = numbers[index]))
  } else return undefined

  const offset = yearOffset(locale)
  const year =
    values.year === undefined ? referenceYear : fullYear(values.year, referenceYear + offset) - offset
  return isoDate(year, Number(values.month), Number(values.day))
}

const yearOffsets = new Map<string, number>()

// How far the years a locale writes are from Gregorian years, like 543 for
// the Buddhist years of Thai. Japanese years restart with each era, so they read as Gregorian.
function yearOffset(locale: string | undefined) {
  const key = locale ?? ""
  let offset = yearOffsets.get(key)
  if (offset === undefined) yearOffsets.set(key, (offset = readYearOffset(locale)))
  return offset
}

function readYearOffset(locale: string | undefined) {
  const formatter = dateFormatter(locale, numericDate)
  const parts = formatter.formatToParts(Date.UTC(2026, 11, 31))
  const year = Number(toLatinDigits(parts.find((part) => part.type === "year")?.value ?? "", locale))
  if (!year || formatter.resolvedOptions().calendar === "japanese") return 0
  return year - 2026
}

function fullYear(text: string, referenceYear: number) {
  const year = Number(text)
  if (text.length > 2) return year
  // The century that puts a two-digit year 80 years before to 20 after the reference.
  const century = Math.floor((referenceYear + 20) / 100) * 100
  return century + year > referenceYear + 20 ? century - 100 + year : century + year
}

const monthLookups = new Map<string, Map<string, number>>()

// The month a word names, matching the locale's long and short names in both
// grammatical forms, and any unambiguous start of three letters or more.
function monthFromName(word: string, locale: string | undefined) {
  const key = locale ?? ""
  let lookup = monthLookups.get(key)
  if (!lookup) monthLookups.set(key, (lookup = monthLookup(locale)))
  const exact = lookup.get(word)
  if (exact !== undefined || word.length < 3) return exact
  let found: number | undefined
  for (const [name, month] of lookup)
    if (name.startsWith(word)) {
      if (found !== undefined && found !== month) return undefined
      found = month
    }
  return found
}

function monthLookup(locale: string | undefined) {
  const lookup = new Map<string, number>()
  const add = (name: string, month: number) =>
    lookup.set(name.toLocaleLowerCase(locale).replace(/\.$/, ""), month)
  for (const width of ["long", "short"] as const) {
    monthNames(locale, width).forEach((name, index) => add(name, index + 1))
    // Inside a date, some languages use another form: "16 января", not "январь".
    const inDate = dateFormatter(locale, { day: "numeric", month: width })
    for (let index = 0; index < 12; index++) {
      const name = inDate.formatToParts(Date.UTC(2026, index, 16)).find((part) => part.type === "month")
      if (name) add(name.value, index + 1)
    }
  }
  return lookup
}

const patternWords = new Map<string, Set<string>>()

// Words a typed or pasted date may carry besides the month: the ones a locale
// writes between a date's numbers, like Korean "년" or Spanish "de", and
// weekday names, as in "Fri, Oct 16, 2026".
function isPatternWord(word: string, locale: string | undefined) {
  const key = locale ?? ""
  let words = patternWords.get(key)
  if (!words) {
    words = new Set()
    for (const options of [{ dateStyle: "short" }, { dateStyle: "long" }] as const)
      for (const part of dateFormatter(locale, options).formatToParts(Date.UTC(2026, 9, 16)))
        if (part.type === "literal")
          for (const literal of part.value.toLocaleLowerCase(locale).match(/\p{L}+/gu) ?? [])
            words.add(literal)
    for (const width of ["long", "short"] as const)
      for (const name of weekdayNames(locale, width))
        words.add(name.toLocaleLowerCase(locale).replace(/\.$/, ""))
    patternWords.set(key, words)
  }
  return words.has(word)
}

const digitMaps = new Map<string, Map<string, string>>()

// The text with the locale's own digits, like Arabic-Indic "١٦", read as Latin ones.
function toLatinDigits(text: string, locale: string | undefined) {
  const key = locale ?? ""
  let digits = digitMaps.get(key)
  if (!digits) {
    const native = new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)
    digits = new Map([...native].map((digit, index) => [digit, String(9 - index)]))
    digitMaps.set(key, digits)
  }
  const latin = digits
  return text.replace(/\p{Nd}/gu, (digit) => latin.get(digit) ?? digit)
}

export { type DateField, datePattern, type DatePattern, parseDate }
