// const input = {
//     interval: "7",
//     file: dv.current().file.name, // "2023-12-03",
// };

const {DateTime} = dv.luxon;

const views = self.require("_views/common/views.js");
const category = self.require("_modules/category.js");

const thisPage = dv.page(input.file);
const tags = input.tags;
const interval = input.interval ?? "7";
const linked = input.linked ?? false;
const intervalDays = `${interval} days`;
const dateStr = dv.func.regexreplace(input.file, "^([0-9]+-[0-9]+-[0-9]+)(.*)", "$1");
const STARTDAY = DateTime.fromMillis(dv.date(dateStr) - dv.duration(intervalDays));
const ENDDAY = dv.date(dateStr);

const args = [];
if (Array.isArray(tags) && tags.length) {
    args.push(tags);
    if (parseInt(interval) > 0)
        args.push(STARTDAY, ENDDAY);
    else
        args.push(null, null);
    if (linked)
        args.push(thisPage);
} else {
    args.push(Object.keys(category));
}

const noteInfoBatch = collectNoteInfo(...args);
views.createSections(dv, noteInfoBatch);


/**                             Helper Functions                              */

/**
 * Get info used when displaying a view.
 *
 * Search for linked pages if provided a Dataview page otherwise all files are searched.
 *
 * If a date range (startDay and endDay) is not specified, the search for notes is unbounded.
 * @param {Array<string>} tags - Array of category keys
 * @param {DateTime} startDay - (Optional) Beginning of a time period for searching
 * @param {DateTime} endDay - (Optional) Ending of a time period for searching
 * @param {Object} page - Dataview page
 * @return {Array<objects>} An array of info objects filtered by key
 */
function collectNoteInfo(tags, startDay, endDay, page) {
    const result = [];
    for (const key of tags) {
        if (Object.hasOwn(category, key)) {
            const noteInfo = {...category[key]};
            if (startDay && endDay)
                noteInfo.pages = findPagesRanged(`#${key}`, startDay, endDay, page);
            else
                noteInfo.pages = findPages(`#${key}`, page);
            result.push(noteInfo);
        }
    }
    return result;
}

/**
 * Searches for pages based on searchTerm within a specified date range.
 * @param {string} searchTerm - Term used to search for pages.
 * @param {Date} startDay - Start day of the date range.
 * @param {Date} endDay - End day of the date range.
 * @param {Object} page - Dataview page
 *
 * @return {Array<object>} Array of pages matching criteria, excluding those under 'template' path.
 */
function findPagesRanged(searchTerm, startDay, endDay, page) {
    return findPages(searchTerm, page)
        .where(p => p.file.day && p.file.day >= startDay)
        .where(p => p.file.day && p.file.day <= endDay);
}

/**
 * Searches for pages based on searchTerm.
 *
 * Will search for linked pages if provided a Dataview page
 * otherwise all files are searched.
 *
 * @param {string} searchTerm - Term used to search for pages.
 * @param {Object} page - Dataview page
 *
 * @return {Array<object>} Array of pages matching criteria, excluding those under 'template' path.
 */
function findPages(searchTerm, page) {
    if (page) {
        const links = page.file.inlinks.where(p => {
            const mp = dv.page(p.path);
            return mp.tags?.includes(searchTerm.replace("#", ""));
        });
        return links.map(p => dv.page(p.path))
            .sort(p => p.file.ctime, "desc");
    }
    return dv.pages(searchTerm)
        .where(p => p != thisPage)
        .where(p => !p.file.path.includes("template"))
        .where(p => !p.file.name.includes("tags"))
        .sort(p => p.file.ctime, "desc");
}
