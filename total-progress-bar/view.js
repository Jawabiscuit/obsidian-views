const pb = self.require("_views/common/progress-bar.js");

const page = dv.page(input.file);
const searchTerms = pb.getSearchTerms(input);
const pages = pb.findLinkedPages(dv, page, searchTerms);
pages.values.unshift(page);
const total = pb.getTotalTasks(pages.values);
const complete = pb.getCompletedTasks(pages.values);

dv.paragraph(pb.progressBar(total, complete));
