const pb = require(app.vault.adapter.basePath + "/_views/common/progress-bar.js");

const page = dv.page(input.file);
const total = pb.getTotalTasks([page]);
const complete = pb.getCompletedTasks([page]);

dv.paragraph(pb.progressBar(total, complete));
