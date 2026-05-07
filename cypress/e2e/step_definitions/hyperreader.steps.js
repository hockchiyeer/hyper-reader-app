const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

const viewLabels = {
  queue: "阅读队列",
  reader: "深读室",
  graph: "外链图谱",
  diagnose: "文本诊断",
  trail: "阅读路径",
  sources: "来源库"
};

Given("I open HyperReader with a clean workspace", () => {
  cy.openHyperReader();
  cy.contains(".brand-title strong", "HyperReader").should("be.visible");
});

When("I reload the app", () => {
  cy.reload();
});

When("I switch locale to {string}", locale => {
  cy.get("#localeSelect").select(locale);
});

Then("the selected locale should still be {string}", locale => {
  cy.get("#localeSelect").should("have.value", locale);
});

Then("the document language should be {string}", language => {
  cy.document().its("documentElement.lang").should("eq", language);
});

Then("the interface should show {string}", text => {
  cy.contains(text).should("be.visible");
});

Then("the search placeholder should be {string}", placeholder => {
  cy.get("#searchInput").should("have.attr", "placeholder", placeholder);
});

Then("the reading queue should contain at least {int} cards", count => {
  cy.get("#feed .article-card").its("length").should("be.gte", count);
});

Then("the reading queue should contain exactly {int} card", count => {
  cy.get("#feed .article-card").should("have.length", count);
});

Then("the reading queue should show {string}", text => {
  cy.get("#feed").should("contain", text);
});

When("I search for {string}", term => {
  cy.get("#searchInput").clear().type(term);
});

When("I clear the search", () => {
  cy.get("#searchInput").clear();
});

When("I filter the queue by {string}", filter => {
  cy.get(`[data-filter="${filter}"]`).click();
});

Then("the queue subtitle should mention total items", () => {
  cy.get("#queueSubtitle").should("contain", "总条目");
});

When("I open the article {string}", title => {
  cy.contains("#feed .article-card", title).click();
});

Then("the reader should show {string}", text => {
  cy.get("#view-reader").should("have.class", "active");
  cy.get("#readerArticle").should("contain", text);
});

Then("the reader should show {int} score rows", count => {
  cy.get("#readerScores .score-row").should("have.length", count);
});

When("I save the current reader item", () => {
  cy.get("#view-reader .panel-head button[title='保存']").first().click();
});

Then("the saved count should be at least {int}", count => {
  cy.get("#navSavedCount")
    .invoke("text")
    .then(text => {
      expect(Number(text)).to.be.at.least(count);
    });
});

When("I build a trail from the reader", () => {
  cy.get("#view-reader .panel-head button[title='生成路径']").last().click();
});

Then("the trail should contain {int} steps", count => {
  cy.get("#view-trail").should("have.class", "active");
  cy.get("#trailList .trail-step").should("have.length", count);
});

When("I copy the trail as Markdown", () => {
  cy.contains("button", "复制 Markdown").click();
});

Then("the clipboard should include {string}", text => {
  cy.get("@clipboardWrite").should("have.been.calledWithMatch", text);
});

When("I open the {string} view", view => {
  cy.contains(".nav-item", viewLabels[view]).click();
});

Then("the active view should be {string}", view => {
  cy.get(`#view-${view}`).should("have.class", "active");
});

When("I run diagnosis without input", () => {
  cy.contains("button", "开始诊断").click();
});

Then("the toast should show {string}", text => {
  cy.get("#toast").should("have.class", "show").and("contain", text);
});

When("I diagnose the sample text", () => {
  const sample = [
    "专家表示这个政策马上改变所有人的生活。",
    "研究显示它会导致长期影响。",
    "https://example.org/report",
    "https://indieweb.org/note"
  ].join("\n");

  cy.get("#diagnosisInput").clear().type(sample, { delay: 0 });
  cy.get("#diagnosisMode").select("search");
  cy.get("#diagnosisGoal").select("debate");
  cy.contains("button", "开始诊断").click();
});

Then("the diagnosis result should show {string}", text => {
  cy.get("#diagnosisResult").should("contain", text);
});

When("I copy the diagnosis", () => {
  cy.get("#view-diagnose .panel-head button[title='复制']").click();
});

When("I submit an empty source", () => {
  cy.contains("button", "加入阅读队列").click();
});

When("I add a source titled {string}", title => {
  cy.get("#addTitle").clear().type(title);
  cy.get("#addUrl").clear().type("https://example.net/open-knowledge");
  cy.get("#addType").select("research");
  cy.get("#addLinks").clear().type("12");
  cy.get("#addSummary").clear().type("A controlled source for Cypress coverage.");
  cy.contains("button", "加入阅读队列").click();
});

When("I pause the source {string}", sourceName => {
  cy.contains(".source-card", sourceName).find(".toggle").click();
});

When("I export the source library", () => {
  cy.contains("button", "导出").click();
});

Then("the exported data should include {string}", text => {
  cy.readFile(`${Cypress.config("downloadsFolder")}/hyperreader-openweb.json`)
    .then(content => {
      expect(JSON.stringify(content)).to.include(text);
    });
});

Then("the graph canvas should be drawn", () => {
  cy.get("#linkCanvas").should($canvas => {
    const canvas = $canvas[0];
    expect(canvas.width).to.be.greaterThan(0);
    expect(canvas.height).to.be.greaterThan(0);
    expect(canvas.toDataURL("image/png").length).to.be.greaterThan(5000);
  });
});
