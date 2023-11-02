dv.header(1, "Dashboard");

icon = "🎯";
header = "Goal";
headerPlural = header + "s";
pages = dv.pages("#goal").where(p => !p.file.path.includes("template"));
dv.header(2, pages.length > 1 ? `${icon} ${headerPlural}` : `${icon} ${header}`);
dv.table([], dv.pages("#goal")
.sort(p => p.created, "desc")
    .where(p => p.status != "fin")
    .where(p => !p.file.path.includes("template"))
    .map(p => [
        `<img class="myTableImg" src="${this.app.vault.adapter.basePath}/${p.img.path}">`,
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        p.bar]
    )
)

icon = "🏗";
header = "Project";
headerPlural = header + "s";
pages = dv.pages("#project").where(p => !p.file.path.includes("template"));
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
)