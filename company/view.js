const views = self.require("_views/common/views.js");
const category = self.require("_modules/category.js");

const tag = input.tag;

const noteInfo = collectNoteInfo(tag);

views.createSection(dv, noteInfo);

/**                             Helper Functions                              */

/**
 * Get info used when displaying a view.
 * For now, categories equate to tags in Obsidian but it's an abstraction in case support
 * for paths is desired.
 * @param {string} key - Category key (tag)
 * @return {object} A note info object
 */
function collectNoteInfo(key) {
    let noteInfo;
    const value = category[key];
    if (value) {
        noteInfo = {...category[key]};
        noteInfo.pages = dv.pages(`#${key}`)
            .where(p => !p.file.path.includes("template"));
    }
    return noteInfo;
}
