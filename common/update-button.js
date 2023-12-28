const {update} = app.plugins.plugins["metaedit"].api;


/**
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
