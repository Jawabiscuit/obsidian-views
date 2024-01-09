const status = self.require("_modules/status.js");
const views = self.require("_views/common/views.js");
const category = self.require("_modules/category.js");

const page = await dv.page(input.file);
const tags = input.tags;

let noteInfoBatch;
if (Array.isArray(tags) && tags.length) {
    noteInfoBatch = collectNoteInfo(page, tags);
} else {
    collectNoteInfo(page, ["vfx-job", "games-job", "job-denied", "interview-accepted"]);
}

views.createSections(dv, noteInfoBatch);

/**                             Helper Functions                              */

/**
 * Get info used when displaying a view.
 * For now, categories equate to tags in Obsidian but it's an abstraction in case support
 * for paths is desired.
 * @param {object} page - Dataview page object
 * @param {Array<string>} categories - Array of category keys
 * @return {Array<objects>} An array of info objects filtered by key
 */
function collectNoteInfo(page, categories) {
    const result = [];
    for (const key of categories) {
        if (Object.hasOwn(category, key)) {
            noteInfo = {...category[key]};
            if (status.activeJobKeys.includes(key)) {
                noteInfo.pages = findLinkedPages(
                    page, status.jobActive[key], null, "reference");
            } else if (status.inactiveJobKeys.includes(key)) {
                noteInfo.pages = findLinkedPages(
                    page, status.jobInactive[key], null, "reference");
            } else {
                noteInfo.pages = findLinkedPages(page, null, [key], "reference");
            }
            result.push(noteInfo);
        }
    }
    return result;
}

/**
 * Finds linked pages based on given criteria.
 * This function takes in a Dataview page object and optional parameters for additional filtering.
 * It returns an array of linked pages that match the given criteria. If no criteria are provided,
 * it will return all active linked pages.
 * @param {object} page - Dataview page object
 * @param {string} status - Status to match against each page's status property.
 * @param {Array<string>} tags - An array of tags to match against each page's tags. If any tags in the
 * given array match any page tags then that constitutes a match.
 * @param {string} type - Type metadata key to match against each page's type.
 * @param {boolean} active - Active key to match against each page's active status.
 * @return {Array<Object>} An array of page objects containing all pages that match the criteria.
 * @example
 *   // Find all active 'reference' type linked pages tagged as either 'vfx-job' or 'games-job'
 *   let filteredPages = findLinkedPages(dv, myPage, null, ["vfx-job", "games-job"], "reference");
 *
 *   // Find all linked pages (no filtering)
 *   let unfilteredPages = findLinkedPages(dv, myPage);
 *   // Expected result: true
 *   unfilteredPages.length === myPage.file.inlinks.length
 */
function findLinkedPages(page, status, tags, type, active) {
    return page.file.inlinks
        .where(p => {
            const mp = dv.page(p.path);
            return (
                ((mp.hasOwnProperty("status") && typeof status === "string") ? mp.status === status : true) &&
                ((!mp.hasOwnProperty("status") && typeof status === "string") ? false : true) &&
                ((mp.hasOwnProperty("tags") && Array.isArray(tags)) ? tags.some(tag => mp.tags.includes(tag)) : true) &&
                ((!mp.hasOwnProperty("tags") && Array.isArray(tags)) ? false : true) &&
                ((mp.hasOwnProperty("type") && typeof type === "string") ? mp.type === type : true) &&
                ((!mp.hasOwnProperty("type") && typeof type === "string") ? false : true) &&
                ((mp.hasOwnProperty("active") && typeof active === "boolean") ? mp.active : true) &&
                ((!mp.hasOwnProperty("active") && typeof active === "boolean") ? false : true)
            );
        }).map(p => dv.page(p.path));
}
