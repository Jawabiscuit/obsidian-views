// const input = {
//     interval: "7",
//     file: dv.current().file.name, // "2023-12-03",
// };

const { DateTime } = dv.luxon;
const btn = require(app.vault.adapter.basePath + "/_views/common/update-button.js");
const statuses = require(app.vault.adapter.basePath + "/_views/common/status.js");

const interval = input.interval ?? "7";
const intervalDays = `${interval} days`;
const dateStr = dv.func.regexreplace(input.file, "^([0-9]+-[0-9]+-[0-9]+)(.*)", "$1");
const startDay = DateTime.fromMillis(dv.date(dateStr) - dv.duration(intervalDays));
const endDay = dv.date(dateStr);

const noteInfo = {
    goal: {
        icon: "🎯",
        header: "Goal",
        headerPlural: "Goals",
        view: "table",
    },
    project: {
        icon: "🏗",
        header: "Project",
        headerPlural: "Projects",
        view: "table",
    },
    daily: {
        icon: "📆",
        header: "Daily",
        headerPlural: "Dailies",
        view: "table",
    },
// View these from within projects
//    journal: {
//        icon: "📓",
//        header: "Journal",
//        headerPlural: "Journals",
//        view: "table",
//    },
//    reference: {
//        icon: "📚",
//        header: "Reference",
//        headerPlural: "Reference",
//        view: "table",
//    },
    meeting: {
        icon: "🧛‍♂🧛‍♀",
        header: "Meeting",
        headerPlural: "Meetings",
        view: "table",
    },
    yt: {
        icon: "📼",
        header: "Video",
        headerPlural: "Videos",
        view: "table",
    },
    chat: {
        icon: "🤖💬",
        header: "Chat",
        headerPlural: "Chats",
        view: "table",
    },
};

for (let categoryKey in noteInfo) {
    const pages = findPages(`#${categoryKey}`, startDay, endDay);
    createElement(pages, noteInfo[categoryKey]);
}

//** Helper Functions */

function findPages(searchTerm, startDay, endDay) {
    return dv.pages(searchTerm)
      .where(p => !p.file.path.includes("template"))
      .where(p => p.file.day && p.file.day >= startDay)
      .where(p => p.file.day && p.file.day <= endDay);
}

function createElement(pages, noteInfo) {
    if (pages.length) {
        dv.header(2, pages.length > 1 ? `${noteInfo.icon} ${noteInfo.headerPlural}` : `${noteInfo.icon} ${noteInfo.header}`);

        if (noteInfo.view === "list") {
            dv.list(pages.map(p => (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link)));
        } else {
            dv.table(["Status", "Progress", "Update"], pages.sort((a, b) => a.created - b.created).map(p => [
               (p.file.aliases.length ? dv.func.link(p.file.path, p.file.aliases[0]) : p.file.link),
               p.bar,
               (!statuses.allInactiveValues.includes(p.status) ?
                btn.createButton(
                    dv, "status", (statuses.activeValues.includes(p.status) ? "fin" : statuses.activeVideoValues.includes(p.status) ? "watched" : "unknown"), p.file.path
                ) : null),]));
        }
    }
}