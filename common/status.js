
const ACTIVE_MAIN = {
    "todo": "todo",
    "waiting": "wtg",
    "in-progress": "ip",
    "hold": "hld",
    "blocked": "blkd",
};

const INACTIVE_MAIN = {
    "finished": "fin",
    "complete": "cmpt",
    "n/a": "na",
    "empty": null,
};

const ACTIVE_VIDEO = {
    "watch-later": "watch-later",
};

const INACTIVE_VIDEO = {
    "watched": "watched",
};

const ACTIVE_ALL = {...ACTIVE_MAIN, ...ACTIVE_VIDEO};

const INACTIVE_ALL = {...INACTIVE_MAIN, ...INACTIVE_VIDEO};

module.exports = {
    active: ACTIVE_MAIN,
    inactive: INACTIVE_MAIN,
    videoActive: ACTIVE_VIDEO,
    videoInactive: INACTIVE_VIDEO,
    allActive: {...ACTIVE_MAIN, ...ACTIVE_VIDEO},
    allInactive: {...INACTIVE_MAIN, ...INACTIVE_VIDEO},
    activeValues: Object.values(ACTIVE_MAIN),
    inactiveValues: Object.values(INACTIVE_MAIN),
    activeVideoValues: Object.values(ACTIVE_VIDEO),
    inactiveVideoValues: Object.values(INACTIVE_VIDEO),
    allActiveValues: Object.values(ACTIVE_ALL),
    allInactiveValues: Object.values(INACTIVE_ALL),
};