const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js");

const HEADER_LEVEL = 2;

const page = dv.page(input.file);
const searchTerm = input.searchTerm;
const header = input.headerName;
const headerPlural = input.headerNamePlural;
const icon = input.icon;

const links = page.file.inlinks.where(p => {
    const mp = dv.page(p.path);
    return mp.tags?.includes(searchTerm);
});

const pages = links.map(p => dv.page(p.path)).sort(p => p.file.ctime, "desc");

if (pages.length > 0) {
    const sectionHeader = pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`;
    dv.header(HEADER_LEVEL, sectionHeader);
    if (input.list) {
        dv.list(pages.map(p => (
            p.file.aliases.length ?
                dv.func.link(p.file.path, p.file.aliases[0]) :
                p.file.link)));
    } else {
        const fields = pages.map(p => [(
            p.file.aliases.length ?
                dv.func.link(p.file.path, p.file.aliases[0]) :
                p.file.link),
        p.status,
        p.bar,
        (!["fin", "na", "cmpt", "watched", null].includes(p.status) ?
            btn.createButton(
                dv, "status", (
                    ["fin", "na", "cmpt", null].includes(p.status) ?
                        "fin" :
                        "watched"), p.file.path) : null),
        ]);
        dv.table([header, "Status", "Progress", "Update"], fields);
    }
}
