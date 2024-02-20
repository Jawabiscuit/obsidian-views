/**
 * Deprecated:
 *   Use metadatamenu fieldModifier instead.
 *
 * Usage:
 *
 *   const btn = self.require("_views/common/update-button.js");
 *   const pages = dv.pages("#daily").where(p => !p.file.path.includes("template"));
 *   const sortedPages = [pages].sort((a, b) => a.created - b.created);
 *   const mappedPages = sortedPages.map(p => [
 *       (p.thumbnailUrl ? `<img class="myTableImg" src="${p.thumbnailUrl.replace(/<|>/g, "")}">` : null),
 *       (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
 *       (p.ogDescription ?? p.title),
 *       (status.activeVideoValues.includes(p.status) ?
 *           btn.createButton(dv, "status", status.determineInactiveStatus(p), p.file.path) :
 *           null),
 *   ]);
 *   dv.table(["Thumnail", "File", "Description", "Status"], mappedPages);
 *
 */
const {update} = app.plugins.plugins["metaedit"].api;


/**
 * Deprecated: Use metadatamenu fieldModifier instead.
 *
 * Creates a button that updates a file parameter when pressed.
 * @param {Object} dv - dataview object
 * @param {string} paramName - name of parameter to edit
 * @param {string} paramValue - new value for the parameter
 * @param {string} filePath - file that contains the parameter to edit
 * @return {string} an HTML button
 */
const createButton = (dv, paramName, paramValue, filePath) => {
    const btn = dv.container.createEl("button", {"text": `Done (${paramValue})`});
    const file = app.vault.getAbstractFileByPath(filePath);
    btn.addEventListener("click", async evt => {
        evt.preventDefault();
        await update(paramName, paramValue, file);
    });
    return btn;
};

exports.createButton = createButton;
