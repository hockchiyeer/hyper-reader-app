Cypress.Commands.add("openHyperReader", () => {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.clear();
      Object.defineProperty(win.navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: () => Promise.resolve()
        }
      });
    }
  });

  cy.window().then(win => {
    cy.stub(win.navigator.clipboard, "writeText").as("clipboardWrite").resolves();
  });
});
