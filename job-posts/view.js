const page = dv.page(input.file);
const posts = page.file.inlinks.where(p => {
    const mp = dv.page(p.path);
    return (
        mp.type === "reference"
        && mp.tags?.includes("vfx-job")
        && mp.active === true
    )
}
);

if (posts.length > 0) {
    dv.header(2, posts.length > 1 ? "📌 Posts" : "📌 Post");
    dv.list(posts);
}