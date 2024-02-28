/*
 * Examples of bar content
 *
 *  [[2023-12-03|Sun 3 Dec]] ◀ Mon 4 Dec ▶ [[2023-12-04|Tue 5 Dec]]
 *  [[2023-12-03|Sun 3 Dec]] ◀ Mon 4 Dec
 *  Mon 3 Dec ▶ [[2023-12-04|Tue 4 Dec]]
 *  null
*/
const {toMoment, PREFIXED_REGEX} = self.require("_modules/periodic.js");

const dateFmt = "ddd Do MMM";
const page = dv.page(input.file);
const regex = /^(\d{4}-\d{2}-\d{2})(.*)$/;
const match = page.file.name.match(PREFIXED_REGEX);
const suffix = match?.groups.suffix;
const pageDate = toMoment(page.file.name);

const pages = dv.pages(`"${page.file.folder}"`)
    .where(p => suffix ? p.file.name.match(PREFIXED_REGEX)?.groups.suffix === suffix : p.type && p.type === page.type)
    .map(p => [p.file.name, toMoment(p.file.name)])
    .sort(p => p[1]);
const next = pages.find(p => p[1] > pageDate);
const prev = pages.values.toReversed().find(p => p[1] < pageDate);

const nav = [];
nav.push(prev ? `[[${prev[0]}|${prev[1].format(dateFmt)}]] ◀` : null);
nav.push((prev || next) ? pageDate.format(dateFmt) : null);
nav.push(next ? `▶ [[${next[0]}|${next[1].format(dateFmt)}]]` : null);

dv.span(nav.join(" "));