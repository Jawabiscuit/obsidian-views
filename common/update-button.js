const { update } = app.plugins.plugins["metaedit"].api

const createButton = (dv, pn, pv, fpath) => {
    const btn = dv.container.createEl('button', { "text": `Done (${pv})` });
    const file = app.vault.getAbstractFileByPath(fpath)
    btn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        await update(pn, pv, file);
    });
    return btn;
}

exports.createButton = createButton;