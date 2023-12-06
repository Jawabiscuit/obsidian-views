
const unknown = "unknown";

const finished = "fin";

const watched = "watched";

const ACTIVE_MAIN = {
    "todo": "todo",
    "waiting": "wtg",
    "in-progress": "ip",
    "hold": "hld",
    "blocked": "blkd",
};

const INACTIVE_MAIN = {
    "finished": finished,
    "complete": "cmpt",
    "n/a": "na",
    "empty": null,
};

const ACTIVE_VIDEO = {
    "watch-later": "watch-later",
};

const INACTIVE_VIDEO = {watched};

const ACTIVE_ALL = {...ACTIVE_MAIN, ...ACTIVE_VIDEO};

const INACTIVE_ALL = {...INACTIVE_MAIN, ...INACTIVE_VIDEO};

const ACTIVE_VALUES = Object.values(ACTIVE_MAIN);

const INACTIVE_VALUES = Object.values(INACTIVE_MAIN);

const ACTIVE_VIDEO_VALUES = Object.values(ACTIVE_VIDEO);

const INACTIVE_VIDEO_VALUES = Object.values(INACTIVE_VIDEO);

const ALL_ACTIVE_VALUES = Object.values(ACTIVE_ALL);

const ALL_INACTIVE_VALUES = Object.values(INACTIVE_ALL);

const ANTI_STATUSES = {
    "fin": ACTIVE_VALUES,
    "watched": ACTIVE_VIDEO_VALUES,
};

/**
 * Determines the inactive status of a page based on its current status value.
 * @param {Object} page - Page object with a 'status' property.
 * @return {string} Status string (E.g. 'fin', 'watched', or 'unknown').
 */
function determineInactiveStatus(page) {
    for (const key in ANTI_STATUSES) {
        if (Object.hasOwn(ANTI_STATUSES, key)) {
            if (ANTI_STATUSES[key].includes(page.status))
                return key;
        }
    }
    return unknown;
}

module.exports = {
    active: ACTIVE_MAIN,
    inactive: INACTIVE_MAIN,
    videoActive: ACTIVE_VIDEO,
    videoInactive: INACTIVE_VIDEO,
    allActive: {...ACTIVE_MAIN, ...ACTIVE_VIDEO},
    allInactive: {...INACTIVE_MAIN, ...INACTIVE_VIDEO},
    activeValues: ACTIVE_VALUES,
    inactiveValues: INACTIVE_VALUES,
    activeVideoValues: ACTIVE_VIDEO_VALUES,
    inactiveVideoValues: INACTIVE_VIDEO_VALUES,
    allActiveValues: ALL_ACTIVE_VALUES,
    allInactiveValues: ALL_INACTIVE_VALUES,
    determineInactiveStatus,
};
