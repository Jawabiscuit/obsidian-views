/*
    previous/next note by date for Daily Notes
    Also works for other files having a `date:` YAML entry.
    MCH 2021-06-14
    more flexible formating alternatives besides ISO, const-correctness
    JA 2023-11-06
*/
const dateFmt = "ddd Do MMM";
const none = "(none)";
const page = dv.page(input.file);
const regex = /^(\d{4}-\d{2}-\d{2})(.*)$/;
const pages = dv.pages(`"${page.file.folder}"`)
    .where(p => p.file.day)
    .where(p => p.file.name.match(regex)[2] === page.file.name.match(regex)[2])
    .map(p => [p.file.name, p.file.day])
    .sort(p => p[1]);
const isoDate = page.file.day ? page.file.day.toISODate() : dv.date.now().toISODate();

// Obsidian uses moment.js; Luxon’s format strings differ!
// const format = app['internalPlugins']['plugins']['daily-notes']['instance']['options']['format'] || 'YYYY-MM-DD';

const current = `(${moment(isoDate).format(dateFmt)})`;
const today = pages.find(p => p[1].toISODate() == isoDate);
const next = pages.find(p => p[1].toISODate() > isoDate);
let prev;
pages.forEach(function(p, i) {
    if (p[1].toISODate() < isoDate)
        prev = p;
});

const nav = [];
nav.push(prev ? `[[${prev[0]}|${moment(prev[1].toISODate()).format(dateFmt)}]]` : none);
nav.push(today ? moment(today[1].toISODate()).format(dateFmt) : current);
nav.push(next ? `[[${next[0]}|${moment(next[1].toISODate()).format(dateFmt)}]]` : none);

dv.paragraph("◀ " + nav[0] + " | " + nav[1] + " | " + nav[2] + " ▶");
