
const JOB_POST_INFO = {
    icon: "📌",
    header: "Post",
    headerPlural: "Posts",
    view: "jobPostTV",
};

const JOB_DENIED = {
    icon: "👎",
    header: "Denied",
    headerPlural: "Denied",
    view: "jobPostTV",
};

const INTERVIEW_ACCEPTED = {
    icon: "📞",
    header: "Interview",
    headerPlural: "Interviews",
    view: "jobPostTV",
};

module.exports = {
    "goal": {
        icon: "🎯",
        header: "Goal",
        headerPlural: "Goals",
        view: "progressImageTV",
    },
    "project": {
        icon: "🏗",
        header: "Project",
        headerPlural: "Projects",
        view: "projectTV",
    },
    "daily": {
        icon: "📆",
        header: "Daily",
        headerPlural: "Dailies",
        view: "progressButtonTV",
    },
    "journal": {
        icon: "📓",
        header: "Journal",
        headerPlural: "Journals",
        view: "progressButtonTV",
    },
    "reference": {
        icon: "📚",
        header: "Reference",
        headerPlural: "Reference",
        view: "progressButtonTV",
    },
    "meeting": {
        icon: "🧛‍♂🧛‍♀",
        header: "Meeting",
        headerPlural: "Meetings",
        view: "progressButtonTV",
    },
    "yt": {
        icon: "📼",
        header: "Video",
        headerPlural: "Videos",
        view: "youTubeTV",
    },
    "chat": {
        icon: "🤖💬",
        header: "Chat",
        headerPlural: "Chats",
        view: "progressButtonTV",
    },
    "games-job": JOB_POST_INFO,
    "vfx-job": JOB_POST_INFO,
    "job-denied": JOB_DENIED,
    "interview-accepted": INTERVIEW_ACCEPTED,
};
