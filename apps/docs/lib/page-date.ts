/** A page's date, like "November 5, 2026", the same on the server and in every time zone. */
function pageDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  })
}

export { pageDate }
