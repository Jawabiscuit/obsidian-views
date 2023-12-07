const views = require(app.vault.adapter.basePath + "/_views/common/views.js");

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

const noteInfo = {
    icon,
    header,
    headerPlural,
    pages,
    view: input.list ? "list" : input.view ?? "table",
};
views.createSection(dv, noteInfo);
