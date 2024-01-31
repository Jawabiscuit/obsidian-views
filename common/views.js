const status = self.require("_modules/status.js");
const btn = self.require("_views/common/update-button.js");

const viewConstructors = {
    table: createProgressButtonTV,
    progressButtonTV: createProgressButtonTV,
    progressImageTV: createProgressImageTV,
    companyTV: createCompanyTV,
    projectTV: createProjectTV,
    youTubeTV: createYouTubeTV,
    jobPostTV: createJobPostTV,
};

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
 * Creates a section element based on given pages information.
 *
 * A section consists of
 *   - header
 *   - view
 *
 * A section will only be visible if there are 1 or more pages to display.
 * The view can either be a list view or any number of table views defined in
 * view constructors.
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
            viewConstructors[noteInfo.view](dv, pages);
        }
    }
}

/**
 * Creates a table view with progress bars and status buttons for the given pages.
 *
 * Table view items contain
 *   - [[alias]] or [[filename]]
 *   - progress bar
 *   - status button
 *
 * If the page does not have an alias mapped in aliases then the [[alias]] link will
 * display the [[filename]].
 * If the page has progress bar view metadata then it will be displayed.
 * If the page status is set to any number of active statuses a status button will appear
 * which will allow you to set the status to inactive.
 * If the "cards" css class is used on the page displaying the table, column titles go away.
 * @param {object} dv - The dataview object
 * @param {Array} pages - Page data to be displayed in the table.
 */
function createProgressButtonTV(dv, pages) {
    const sortedPages = [...pages].sort((a, b) => a.created - b.created);
    const mappedPages = sortedPages.map(p => [
        p.file.aliases?.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link,
        p.bar,
        status.allActiveValues.includes(p.status) ?
            btn.createButton(dv, "status", status.determineInactiveStatus(p), p.file.path) :
            null,
    ]);
    dv.table(["File", "Progress", "Status"], mappedPages);
}

/**
 * Creates a table view with progress bars and images for the given pages.
 *
 * Table view items contain
 *   - image
 *   - [[alias]] or [[filename]]
 *   - progress bar
 *
 * If the page has image link metadata then an image will be displayed
 * If the page does not have an alias mapped in aliases then the [[alias]] link will
 * display the [[filename]].
 * If the page has progress bar view metadata then it will be displayed.
 * If the "cards" css class is used on the page displaying the table, column titles go away.
 * @param {object} dv - The dataview object
 * @param {Array} pages - Page data to be displayed in the table.
 */
function createProgressImageTV(dv, pages) {
    const sortedPages = [...pages].sort((a, b) => a.created - b.created);
    const mappedPages = sortedPages.map(p => [
        (p.img ? `<img class="myTableImg" src="${app.vault.adapter.basePath}/${p.img.path}">` : null),
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.bar,
    ]);
    dv.table(["Image", "File", "Progress"], mappedPages);
}

/**
 * Creates a table view with images, links, and posts for the given pages.
 *
 * @param {object} dv - The dataview object
 * @param {Array} pages - Page data to be displayed in the table
*/
function createCompanyTV(dv, pages) {
    const sortedPages = [...pages].sort((a, b) => a.created - b.created);
    const mappedPages = sortedPages.map(p => [
        (p.img ? `<img class="myTableImg" src="${app.vault.adapter.basePath}/${p.img.path}">` : null),
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.posts,
    ]);
    dv.table(["Image", "File", "Posts"], mappedPages);
}

/**
 * Creates a project table view for the given pages.
 *
 * Table view items contain
 *   - [[alias]] or [[filename]]
 *   - subtitle (used for extra info)
 *   - progress bar
 *   - [[goal]]
 *
 * If the page does not have an alias mapped in aliases then the [[alias]] link will
 * display the [[filename]].
 * If the subtitle is set in frontmatter then it is used to display pertinent additional info.
 * If the page has progress bar view metadata then it will be displayed.
 * If the page has [[goal]] metadata then it will be displayed.
 * If the "cards" css class is used on the page displaying the table, column titles go away.
 * @param {object} dv - The dataview object
 * @param {Array} pages - Page data to be displayed in the table.
*/
function createProjectTV(dv, pages) {
    const sortedPages = [...pages].sort((a, b) => a.created - b.created);
    const mappedPages = sortedPages.map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.subtitle,
        p.bar,
        p.goal,
    ]);
    dv.table(["File", "Info", "Progress", "Goal"], mappedPages);
}

/**
 * Creates a YouTube table view for the given pages.
 *
 * Table view items contain
 *   - image
 *   - [[alias]] or [[filename]]
 *   - description or file title
 *   - status button
 *
 * If the page has thumbnail url metadata an image will be displayed
 * If the page does not have an alias mapped in aliases then the [[alias]] link will
 * display the [[filename]].
 * If the page does not have description metadata then the file title is displayed
 * If the page status is set to any number of active statuses a status button will appear
 * which will allow you to set the status to inactive.
 * If the "cards" css class is used on the page displaying the table, column titles go away.
 * @param {object} dv - The dataview object
 * @param {Array} pages - Page data to be displayed in the table.
*/
function createYouTubeTV(dv, pages) {
    const sortedPages = [...pages].sort((a, b) => a.created - b.created);
    const mappedPages = sortedPages.map(p => [
        (p.thumbnailUrl ? `<img class="myTableImg" src="${p.thumbnailUrl}">` : null),
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        (p.ogDescription ?? p.title),
        (status.activeVideoValues.includes(p.status) ?
            btn.createButton(dv, "status", status.determineInactiveStatus(p), p.file.path) :
            null),
    ]);
    dv.table(["Thumnail", "File", "Description", "Status"], mappedPages);
}

/**
 * This function creates a job post table view using dataview object and page data.
 * @param {object} dv - The dataview object
 * @param {Array} pages - Dataview page data to be displayed in the table.
 */
function createJobPostTV(dv, pages) {
    const sortedPages = [...pages].sort((a, b) => a.created - b.created);
    const mappedPages = sortedPages.map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        (p["directLink"] ?? p["recruiter link"]),
        (p["jobType"] ?? null),
        (p["workFrom"] ?? null),
        (p["appSent"] ? "☑" : "🔳"),
    ]);
    dv.table(["Role", "Post", "Type", "Work From", "Applied"], mappedPages);
}

module.exports = {
    createSection,
    createSections,
    createProgressButtonTV,
    createProgressImageTV,
    createCompanyTV,
    createProjectTV,
    createYouTubeTV,
    createJobPostTV,
};
