/**
 * Get search terms from input.
 * @param {Object} input - The input object containing searchTerm property.
 * @return {Array.<string>} An array of search terms or ["project"] if no searchTerm provided in input.
 */
function getSearchTerms(input) {
    if (input.searchTerm)
        return input.searchTerm.split(",").map(t => t.trim());
    else
        return ["project"];
}

/**
 * Calculate total tasks across pages.
 * @param {Array.<Object>} pages - The array of page objects containing file.tasks property.
 * @return {number} Total number of tasks across all pages.
 */
function getTotalTasks(pages) {
    return pages.reduce((acc, p) => {
        return acc + p.file.tasks.length;
    }, 0);
}

/**
 * Calculate completed tasks across pages.
 * @param {Array.<Object>} pages - The array of page objects containing file.tasks property.
 * @return {number} Number of completed tasks across all pages.
 */
function getCompletedTasks(pages) {
    return pages.reduce((acc, p) => {
        return acc + p.file.tasks.where(t => t.fullyCompleted === true).length;
    }, 0);
}

/**
 * Find linked pages based on search terms.
 * @param {Object} dv - The dataview object.
 * @param {Object} page - The current page object containing file.inlinks property
 * @param {Array.<string>} searchTerms - Search terms to match against tags in linked pages.
 * @return {Array.<Object>} Linked pages sorted by creation time in descending order.
 */
function findLinkedPages(dv, page, searchTerms) {
    const regex = new RegExp(searchTerms.map(t => `^${t}$`).join("|"), "");

    // This filter cannot be chained with the next
    const pagesWithTags = page.file.inlinks
        .map(l => dv.page(l.path))
        .filter(p => p.tags);

    const linkedPages = pagesWithTags
        .filter(p => (
            typeof p.tags === "string" ? p.tags.match(regex) :
                p.tags.filter(t => t.match(regex)).length))
        .sort(p => p.file.ctime, "desc");

    return linkedPages;
}

/**
 * Create a progress bar with optional text showing the percentage and actual progress.
 * @param {number} target - The target value for the progress bar.
 * @param {number} [progress=0] - The current progress value.
 * @param {"left"|"center"|"right"} [align="center"] - Alignment for the container element.
 * holding the progress bar and optional text.
 * @param {boolean} [showText=true] - Show text indicating percentage and actual progress.
 * @return {string} HTML string representing a div containing a progress bar
 * (and optionally, its textual representation).
 */
function progressBar(target, progress, align="center", showText=true) {
    const containerEl = createDiv();

    Object.assign(containerEl.style, {
        "display": "flex",
        "flex-direction": "column",
        "align-items": align,
        "justify-content": "center",
    });

    const max = target || 0;
    const value = progress || 0;
    const percent = Math.round((value / max) * 100) || 0;

    const progressBar = containerEl.createEl("progress");
    Object.assign(progressBar, {max, value});

    if (showText) {
        const progressText = containerEl.createEl("div");
        Object.assign(progressText, {
            textContent: `${percent}% (${progress}/${target})`,
        });
    }

    return containerEl.innerHTML;
}

exports.getSearchTerms = getSearchTerms;
exports.progressBar = progressBar;
exports.getTotalTasks = getTotalTasks;
exports.findLinkedPages = findLinkedPages;
exports.getCompletedTasks = getCompletedTasks;
