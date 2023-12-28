// const input = {
//     interval: "7",
//     file: dv.current().file.name, // "2023-12-03",
// };

const {DateTime} = dv.luxon;

const views = self.require("_views/common/views.js");
const category = self.require("_views/common/category.js");

const tags = input.tags;
const interval = input.interval ?? "7";
const intervalDays = `${interval} days`;
const dateStr = dv.func.regexreplace(input.file, "^([0-9]+-[0-9]+-[0-9]+)(.*)", "$1");
const STARTDAY = DateTime.fromMillis(dv.date(dateStr) - dv.duration(intervalDays));
const ENDDAY = dv.date(dateStr);

let noteInfoBatch;
if (Array.isArray(tags) && tags.length) {
    noteInfoBatch = collectNoteInfo(tags);
} else {
    const categories = Object.keys(category);
    noteInfoBatch = collectNoteInfo(categories);
}

views.createSections(dv, noteInfoBatch);


/**                             Helper Functions                              */

/**
 * Get info used when displaying a view.
 * For now, categories equate to tags in Obsidian but it's an abstraction in case support
 * for paths is desired.
 * @param {Array<string>} categories - Array of category keys
 * @return {Array<objects>} An array of info objects filtered by key
 */
function collectNoteInfo(categories) {
    const result = [];
    for (const key of categories) {
        if (Object.hasOwn(category, key)) {
            noteInfo = {...category[key]};
            noteInfo.pages = findPagesRanged(`#${key}`, STARTDAY, ENDDAY);
            result.push(noteInfo);
        }
    }
    return result;
}

/**
 * Searches for pages based on searchTerm within a specified date range.
 * @param {string} searchTerm - Term to search in pages.
 * @param {Date} startDay - Start day of the date range.
 * @param {Date} endDay - End day of the date range.
 *
 * @return {Array<object>} Array of pages matching criteria, excluding those under 'template' path.
 */
function findPagesRanged(searchTerm, startDay, endDay) {
    return dv.pages(searchTerm)
        .where(p => !p.file.path.includes("template"))
        .where(p => p.file.day && p.file.day >= startDay)
        .where(p => p.file.day && p.file.day <= endDay);
}
