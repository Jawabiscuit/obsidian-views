const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js")
const pb = require(app.vault.adapter.basePath + "/_views/common/progress-bar.js");

const page = dv.page(input.file);
const searchTerm = input.searchTerm;
const header = input.headerName;
const headerPlural = input.headerNamePlural;
const icon = input.icon;

const links = page.file.inlinks.where(p => {
    const mp = dv.page(p.path);
    return mp.tags?.includes(searchTerm)
});

const pages = links.map(p => dv.page(p.path)).sort(p => p.file.ctime, "desc");

if (pages.length > 0)
{
    const fields = pages.map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.status,
        p.bar,
        (!["fin", "na", "cmpt"].includes(p.status) ? btn.createButton(dv, "status", "fin", p.file.path) : null)
    ]);
    dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
    dv.table([header, "Status", "Progress", "Update"], fields);
}