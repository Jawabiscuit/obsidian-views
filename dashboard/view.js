const { update } = app.plugins.plugins["metaedit"].api
dv.header(1, "Dashboard");

const createButton = (pn, pv, fpath) => {
    const btn = dv.container.createEl('button', { "text": `Done (${pv})` });
    const file = app.vault.getAbstractFileByPath(fpath)
    btn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        await update(pn, pv, file);
    });
    return btn;
}

let icon;
let header;
let headerPlural;
let pages;

icon = "🎯";
header = "Goal";
headerPlural = header + "s";
pages = dv.pages("#goal")
    .where(p => p.status != "fin")
    .where(p => !p.file.path.includes("template"));
dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
dv.table([], dv.pages("#goal")
    .sort(p => p.created, "desc")
    .where(p => p.status != "fin")
    .where(p => !p.file.path.includes("template"))
    .map(p => [
        (p.img ? `<img class="myTableImg" src="${app.vault.adapter.basePath}/${p.img.path}">` : null),
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.bar]
    )
);

icon = "🏗";
header = "Project";
headerPlural = header + "s";
pages = dv.pages("#project")
    .where(p => p.status === "ip")
    .where(p => !p.file.path.includes("template"));
dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
dv.table([], dv.pages("#project")
    .sort(p => p.created, "desc")
    .where(p => p.status === "ip")
    .where(p => !p.file.path.includes("template"))
    .map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.subtitle,
        p.bar,
        p.goal]
    )
);

icon = "📓";
header = "Daily";
headerPlural = "Dailies";
pages = dv.pages("#daily")
    .where(p => p.status !== "fin")
    .where(p => !p.file.path.includes("template"))
    .where(p => p.file.day && p.file.day > dv.date("now") - dv.duration("30 days"));
if (pages.length) {
    dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
    dv.table([], dv.pages("#daily")
        .sort(p => p.created, "desc")
        .where(p => p.status !== "fin")
        .where(p => !p.file.path.includes("template"))
        .where(p => p.file.day && p.file.day > dv.date("now") - dv.duration("30 days"))
        .map(p => [
            (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
            p.bar,
            createButton('status', 'fin', p.file.path),
        ])
    );
}

icon = "📚";
header = "Reference";
headerPlural = header + "s";
pages = dv.pages("#reference")
    .where(p => !["fin", "na", null].includes(p.status))
    .where(p => !p.file.path.includes("template"))
    .where(p => p.file.day && p.file.day > dv.date("now") - dv.duration("30 days"));
if (pages.length) {
    dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
    dv.table([], dv.pages("#reference")
        .sort(p => p.created, "desc")
        .where(p => !["fin", "na", null].includes(p.status))
        .where(p => !p.file.path.includes("template"))
        .where(p => p.file.day && p.file.day > dv.date("now") - dv.duration("30 days"))
        .map(p => [
            (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
            p.subtitle,
            createButton('status', 'fin', p.file.path),
        ])
    );
}

icon = "📼";
header = "Video";
headerPlural = header + "s";
pages = dv.pages("#yt")
    .where(p => p.status != "watched")
    .where(p => !p.file.path.includes("template"));
if (pages.length) {
    dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
    dv.table([], dv.pages("#yt")
        .sort(p => p.created, "desc")
        .where(p => !p.file.path.includes("template"))
        .where(p => p.status != "watched")
        .map(p => [
            (p.thumbnailUrl ? `<img class="myTableImg" src="${p.thumbnailUrl}">` : null),
            (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
            p.status,
            (p.ogDescription ?? p.title),
            createButton('status', 'watched', p.file.path)
        ])
    );
}