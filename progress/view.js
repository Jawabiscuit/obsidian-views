const pb = require(app.vault.adapter.basePath + "/_views/common/progress-bar.js");

const page = dv.page(input.file);
const searchTerms = pb.getSearchTerms(input);
const pages = pb.findLinkedPages(dv, page, searchTerms);
pages.values.unshift(page);
const complete = pb.getCompletedTasks(pages.values);

dv.span(complete);