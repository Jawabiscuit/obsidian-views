// const input = {
//     interval: "7",
//     file: dv.current().file.name, // "2023-12-03",
// };

const {DateTime} = dv.luxon;
const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js");
const status = require(app.vault.adapter.basePath + "/_views/common/status.js");
const category = require(app.vault.adapter.basePath + "/_views/common/category.js");

const tags = input.tags;
const interval = input.interval ?? "7";
const intervalDays = `${interval} days`;
const dateStr = dv.func.regexreplace(input.file, "^([0-9]+-[0-9]+-[0-9]+)(.*)", "$1");
const STARTDAY = DateTime.fromMillis(dv.date(dateStr) - dv.duration(intervalDays));
const ENDDAY = dv.date(dateStr);

let noteInfoBatch;
if (Array.isArray(tags) && tags.length)
    noteInfoBatch = collectNoteInfo(tags);
else
    noteInfoBatch = collectNoteInfo(Object.keys(category));

createElements(noteInfoBatch);


/**                             Helper Functions                              */

/**
 * Get info used when displaying a view.
 * For now, categories equate to tags but it's an abstraction in case support for paths is desired.
 * @param {string} categories - Array of category keys
 * @return {Array<objects>} An array of info objects filtered by key
 */
function collectNoteInfo(categories) {
    const result = [];
    for (const key in categories) {
        if (Object.hasOwn(categories, key)) {
            for (const categoryKey in Object.keys(category)) {
                // For codebases that do support ES2022.
                // Guard clause - only proceed if category has its own property named
                // whatever the value for categoryKey is.
                if (Object.hasOwn(category, categoryKey)) {
                    if (categoryKey == key) {
                        // TODO: Is this good enough or do I need to make a new object?
                        noteInfo = category[key];
                        noteInfo.pages = findPagesRanged(`#${key}`, STARTDAY, ENDDAY);
                        result.push(noteInfo);
                    }
                }
            }
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


/**
 * Takes in a batch of note infos to display an creates the HTML text element for each.
 * @param {Array<object>} noteInfoBatch
 */
function createElements(noteInfoBatch) {
    for (const noteInfo in noteInfoBatch) {
        if (Object.hasOwn(noteInfoBatch, noteInfo))
            createElement(noteInfo);
    }
}

/**
 * Creates an element based on given pages information.
 * @param {Object} noteInfo - Object containing note information like icon, header etc.
 */
function createElement(noteInfo) {
    const HEADER_LEVEL = 2;

    const pages = noteInfo.pages;
    if (pages.length > 0) {
        const headerText = pages.length > 1 ?
            `${noteInfo.icon} ${noteInfo.headerPlural}` :
            `${noteInfo.icon} ${noteInfo.header}`;

        dv.header(HEADER_LEVEL, headerText);

        if (noteInfo.view === "list") {
            const listItems = pages.map(p => p.file.aliases?.length ?
                dv.func.link(p.file.path, p.file.aliases[0]) :
                p.file.link);

            dv.list(listItems);
        } else {
            createTableView(pages);
        }
    }
}

/**
 * Creates a table view for the given pages.
 * The table contains the file alias if any, or file link if none. It also contains
 * the progress bar element if any, and an HTML button to set the status to inactive
 * if the page status is set to any number of active statuses.
 * @param {Array} pages - Page data to be displayed in the table.
 */
function createTableView(pages) {
    const sortedPages = pages.sort((a, b) => a.created - b.created);

    const mappedPages = sortedPages.map(p => [
        p.file.aliases?.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link,
        p.bar,
        !status.allInactiveValues.includes(p.status) ?
            btn.createButton(dv, "status", status.determineInactiveStatus(p), p.file.path) :
            null,
    ]);

    dv.table(["Status", "Progress", "Update"], mappedPages);
}
