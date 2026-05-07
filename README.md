# HyperReader App

HyperReader is a static, single-page reading workspace for keeping readers close to the open World Wide Web. It organizes seeded and manually added links, scores source openness, diagnoses pasted text or URLs, builds seven-step reading trails, renders an outbound-link graph, and stores the working state in the browser.

## Features

- Reading queue with search, saved items, high-openness, needs-links, and counterpoint filters.
- Deep reader view with openness radar scores, outbound links, and related next jumps.
- Text and URL diagnosis using local heuristics for link density, source diversity, AI slop risk, and zero-click risk.
- Seven-step reading trail generation with Markdown copy support.
- Source library with source toggles, manual link/source entry, and JSON export.
- Canvas-based outbound-link graph.
- Locale switcher for Simplified Chinese, Traditional Chinese, English, and Malay.

## Project Structure

```text
.
├── hyperreader_full_app.html          # Static HyperReader app
├── package.json                       # Cypress/Cucumber test tooling
├── package-lock.json                  # Locked npm dependency graph
├── cypress.config.js                  # Cypress config and local static test server
├── scripts/run-cypress.cjs            # Cypress launcher that clears Electron env conflicts
└── cypress/
    ├── e2e/hyperreader.feature        # BDD coverage for app workflows
    ├── e2e/step_definitions/          # Cucumber step definitions
    └── support/e2e.js                 # Cypress support command
```

## Running The App

Open `hyperreader_full_app.html` directly in a browser. The app has no backend and no build step. It loads the Tabler icon font from jsDelivr; if offline, the app still works but icons may not render.

Browser state is stored in `localStorage` under:

```text
hyperreader.openweb.v2
```

Clear that key to reset saved items, manually added sources, diagnosis results, trail data, and the selected locale.

## Locales

Use the language selector in the top toolbar to switch between:

- `zh-Hans`: Chinese Simplified
- `zh-Hant`: Chinese Traditional
- `en`: English
- `ms`: Malay

The interface chrome, form labels, generated UI text, toasts, diagnosis labels, and trail notes are localized. Seed article/source content remains authored content.

## Testing

Install dependencies:

```bash
npm install
```

Run the full Cypress Cucumber BDD suite:

```bash
npm run test:e2e
```

Open Cypress interactively:

```bash
npm run cypress:open
```

The test runner uses Cypress `15.14.2` with `@badeball/cypress-cucumber-preprocessor`. `cypress.config.js` starts a temporary local static server, so no separate app server is required.

The BDD suite covers:

- Locale switching and persistence.
- Queue search and filters.
- Reader view, save count, trail generation, and Markdown copy.
- Diagnosis validation, results, and copy behavior.
- Source validation, manual source add, source pause, and JSON export.
- Primary navigation.
- Link graph canvas rendering.

## Cypress Environment Note

Some shells set `ELECTRON_RUN_AS_NODE=1`, which prevents Cypress' Electron binary from verifying or launching correctly. The npm scripts call `scripts/run-cypress.cjs`, which removes that variable only for the Cypress child process.

## Maintenance

To add or update UI copy, edit the `translations` object in `hyperreader_full_app.html`. New DOM text can opt into localization with `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`, or `data-i18n-aria-label`.

To extend test coverage, add Gherkin scenarios to `cypress/e2e/hyperreader.feature` and matching step definitions in `cypress/e2e/step_definitions/hyperreader.steps.js`.
