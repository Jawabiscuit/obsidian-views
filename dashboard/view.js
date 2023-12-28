const status = self.require("_modules/status.js");
const views = self.require("_views/common/views.js");
const category = self.require("_modules/category.js");

const pageFindMethods = {
    daily: findPagesActiveRanged,
};

const categories = Object.keys(category);
const noteInfoBatch = collectNoteInfo(categories);

dv.header(1, "Dashboard");
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
            if (Object.hasOwn(pageFindMethods, key))
                noteInfo.pages = pageFindMethods[key](`#${key}`);
            else
                noteInfo.pages = findPagesActive(`#${key}`);
            result.push(noteInfo);
        }
    }
    return result;
}

/**
 * Searches for pages based on searchTerm that have an active status.
 * @param {string} searchTerm - Term used to search for pages.
 * @return {Array<object>} Array of pages matching criteria, excluding those under 'template' path.
 */
function findPagesActive(searchTerm) {
    return dv.pages(searchTerm)
        .where(p => !p.file.path.includes("template"))
        .where(p => status.allActiveValues.includes(p.status));
}

/**
 * Searches for pages based on searchTerm within a desired date range.
 * @param {string} searchTerm - Term used to search for pages.
 * @param {string} [interval="7 days"] - When subtracted from the current day yields the start of the date range.
 * @return {Array<object>} Array of pages matching criteria, excluding those under 'template' path.
 */
function findPagesActiveRanged(searchTerm, interval="7 days") {
    return dv.pages(searchTerm)
        .where(p => !p.file.path.includes("template"))
        .where(p => p.file.day && p.file.day > dv.date("now") - dv.duration(`${interval}`))
        .where(p => status.allActiveValues.includes(p.status));
}
