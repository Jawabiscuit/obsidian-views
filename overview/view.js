// const input = {
//     interval: "7",
//     file: dv.current().file.name, // "2023-12-03",
// };

const {DateTime} = dv.luxon;
const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js");
const statuses = require(app.vault.adapter.basePath + "/_views/common/status.js");

const interval = input.interval ?? "7";
const intervalDays = `${interval} days`;
const dateStr = dv.func.regexreplace(input.file, "^([0-9]+-[0-9]+-[0-9]+)(.*)", "$1");
const startDay = DateTime.fromMillis(dv.date(dateStr) - dv.duration(intervalDays));
const endDay = dv.date(dateStr);

const noteInfo = {
    goal: {
        icon: "🎯",
        header: "Goal",
        headerPlural: "Goals",
        view: "table",
    },
    project: {
        icon: "🏗",
        header: "Project",
        headerPlural: "Projects",
        view: "table",
    },
    daily: {
        icon: "📆",
        header: "Daily",
        headerPlural: "Dailies",
        view: "table",
    },
    // View these from within projects
    //    journal: {
    //        icon: "📓",
    //        header: "Journal",
    //        headerPlural: "Journals",
    //        view: "table",
    //    },
    //    reference: {
    //        icon: "📚",
    //        header: "Reference",
    //        headerPlural: "Reference",
    //        view: "table",
    //    },
    meeting: {
        icon: "🧛‍♂🧛‍♀",
        header: "Meeting",
        headerPlural: "Meetings",
        view: "table",
    },
    yt: {
        icon: "📼",
        header: "Video",
        headerPlural: "Videos",
        view: "table",
    },
    chat: {
        icon: "🤖💬",
        header: "Chat",
        headerPlural: "Chats",
        view: "table",
    },
};

for (const categoryKey in noteInfo) {
    // For codebases that do support ES2022
    // Guard clause - only proceed if noteInfo has its own property named categoryKey
    if (Object.hasOwn(noteInfo, categoryKey)) {
        const pages = findPages(`#${categoryKey}`, startDay, endDay);
        createElement(pages, noteInfo[categoryKey]);
    }
}

//* * Helper Functions */

/**
 * Searches for pages based on searchTerm within a specified date range.
 *
 * @param {string} searchTerm - Term to search in pages.
 * @param {Date} startDay - Start day of the date range.
 * @param {Date} endDay - End day of the date range.
 *
 * @return {Array<object>} Array of pages matching criteria, excluding those under 'template' path.
 */
function findPages(searchTerm, startDay, endDay) {
    return dv.pages(searchTerm)
        .where(p => !p.file.path.includes("template"))
        .where(p => p.file.day && p.file.day >= startDay)
        .where(p => p.file.day && p.file.day <= endDay);
}

/**
 * Creates an element based on given pages information.
 * @param {Array} pages - Array containing page data.
 * @param {Object} noteInfo - Object containing note information like icon, header etc.
 */
function createElement(pages, noteInfo) {
    const HEADER_LEVEL = 2;

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
        !statuses.allInactiveValues.includes(p.status) ?
            btn.createButton(dv, "status", determineInactiveStatus(p), p.file.path) :
            null,
    ]);

    dv.table(["Status", "Progress", "Update"], mappedPages);
}

/**
 * Determines the inactive status of a page based on its current status value.
 * @param {Object} page - Page object with a 'status' property.
 * @return {string} Status string (E.g. 'fin', 'watched', or 'unknown').
 */
function determineInactiveStatus(page) {
    return statuses.activeValues.includes(page.status) ?
        "fin" :
        statuses.activeVideoValues.includes(page.status) ?
            "watched" :
            "unknown";
}
