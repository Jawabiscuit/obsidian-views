var pages;
var fields;
const page = await dv.page(input.file);

// TODO: sort by date applied then date created
const posts = page.file.inlinks.where(p => {
    const mp = dv.page(p.path);
    return (
        mp.type === "reference"
        && (mp.tags?.includes("vfx-job") || mp.tags?.includes("games-job"))
        && mp.active === true
    )
}
);

if (posts.length > 0) {
    pages = posts.map(p => dv.page(p.path));
    fields = pages.map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        (p["direct link"] ?? p["recruiter link"]),
        (p["job type"] ?? "-"),
        (p["work from"] ?? "-"),
    ]);
    dv.header(2, posts.length > 1 ? "📌 Posts" : "📌 Post");
    dv.table(["Role", "Post", "Type", "Work From"], fields);
}

const rejects = page.file.inlinks.where(p => {
    const mp = dv.page(p.path);
    return (
        mp.type === "reference"
        && (mp.tags?.includes("vfx-job") || mp.tags?.includes("games-job"))
        && mp.status === "rejected"
    )
}
);

if (rejects.length > 0) {
    pages = rejects.map(p => dv.page(p.path));
    fields = pages.map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        (p["direct link"] ?? p["recruiter link"]),
        (p["job type"] ?? "-"),
        (p["work from"] ?? "-"),
    ]);
    dv.header(2, rejects.length > 1 ? "👎 Rejections" : "👎 Denied");
    dv.table(["Role", "Post", "Type", "Work From"], fields);;
}

const interviews = page.file.inlinks.where(p => {
    const mp = dv.page(p.path);
    return (
        mp.type === "reference"
        && (mp.tags?.includes("vfx-job") || mp.tags?.includes("games-job"))
        && mp.status === "interviewing"
    )
}
);

if (interviews.length > 0) {
    pages = interviews.map(p => dv.page(p.path));
    fields = pages.map(p => [
        (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
        (p["direct link"] ?? p["recruiter link"]),
        (p["job type"] ?? "-"),
        (p["work from"] ?? "-"),
    ]);
    dv.header(2, interviews.length > 1 ? "📞 Interviews" : "📞 Interview");
    dv.table(["Role", "Post", "Type", "Work From"], fields);;
}
