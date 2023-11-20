function getSearchTerms(input) {
    if (input.searchTerm) {
        return input.searchTerm.split(",").map(t => t.trim());
    } else {
        return ["project"];
    }
}

function getTotalTasks(pages) {
    return pages.reduce((acc, p) => {
        return acc + p.file.tasks.length;
    }, 0);
}

function getCompletedTasks(pages) {
    return pages.reduce((acc, p) => {
        return acc + p.file.tasks.where((t) => t.fullyCompleted === true).length;
    }, 0);
}

function findLinkedPages(dv, page, searchTerms) {
    const regex = new RegExp(searchTerms.map(t => `^${t}$`).join("|"), "")

    // This filter cannot be chained with the next
    const pagesWithTags = page.file.inlinks
        .map(l => dv.page(l.path))
        .filter(p => p.tags)

    const linkedPages = pagesWithTags
        .filter(p => (
            typeof p.tags === "string" ? p.tags.match(regex)
            : p.tags.filter(t => t.match(regex)).length))
        .sort(p => p.file.ctime, "desc");

    return linkedPages;
}

function progressBar(target, progress, align="center", showText=true) {
    const containerEl = createDiv();

    Object.assign(containerEl.style, {
        display: "flex",
        "flex-direction": "column",
        "align-items": align,
        "justify-content": "center",
    });

    const max = target || 0;
    const value = progress || 0;
    const percent = Math.round((value / max) * 100) || 0;

    const progressBar = containerEl.createEl("progress");
    Object.assign(progressBar, { max, value });

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