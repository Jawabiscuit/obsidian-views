const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js");
const status = require(app.vault.adapter.basePath + "/_views/common/status.js");

/**
 * Takes in a batch of note infos to display an creates the HTML text element for each.
 * @param {object} dv - The dataview object
 * @param {Array<object>} noteInfoBatch - A batch of items each has all the info needed to
 * create a section
 */
function createSections(dv, noteInfoBatch) {
    for (const noteInfo of noteInfoBatch)
        createSection(dv, noteInfo);
}

/**
 * Creates an element based on given pages information.
 * @param {object} dv - The dataview object
 * @param {Object} noteInfo - Object containing note information like icon, header etc.
 */
function createSection(dv, noteInfo) {
    const HEADER_LEVEL = 2;

    const pages = noteInfo.pages;
    if (pages && pages.length > 0) {
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
            createProgressButtonTV(dv, pages);
        }
    }
}

/**
 * Creates a table view for the given pages.
 * The table contains the file alias if any, or file link if none. It also contains
 * the progress bar element if any, and an HTML button to set the status to inactive
 * if the page status is set to any number of active statuses.
 * @param {object} dv - The dataview object
 * @param {Array} pages - Page data to be displayed in the table.
 */
function createProgressButtonTV(dv, pages) {
    const sortedPages = pages.sort((a, b) => a.created - b.created);

    const mappedPages = sortedPages.map(p => [
        p.file.aliases?.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link,
        p.bar,
        status.allActiveValues.includes(p.status) ?
            btn.createButton(dv, "status", status.determineInactiveStatus(p), p.file.path) :
            null,
    ]);

    dv.table(["Status", "Progress", "Update"], mappedPages);
}

module.exports = {
    createSection,
    createSections,
    createProgressButtonTV,
};
