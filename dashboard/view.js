const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js")

dv.header(1, "Dashboard");

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
            (!["fin", "na", "cmpt"].includes(p.status) ? btn.createButton(dv, "status", "fin", p.file.path) : null),
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
            (!["fin", "na", "cmpt"].includes(p.status) ? btn.createButton(dv, "status", "fin", p.file.path) : null),
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
            (!["fin", "watched"].includes(p.status) ? btn.createButton(dv, "status", "watched", p.file.path) : null),
        ])
    );
}