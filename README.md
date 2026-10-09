# c3nsor Tech Employee Playbook

Interactive onboarding playbook for developers joining the c3nsor privacy extension team. It covers the stack, IDE setup, Scrum, Git controls, Trello, AI agent controls, code quality, testing, and hosting procedures.

**Live site:** https://michael-peterson.com/c3nsor-playbook/

The page uses the same look as the c3nsor website (https://michael-peterson.com/IS-581/) and adds a sticky table of contents that highlights the section you're reading. On phones, the contents collapse into a menu under the header.

## Project layout

| Path | Purpose |
| --- | --- |
| `docs/index.html` | The playbook content |
| `docs/playbook.css` | Styling, matched to the c3nsor site |
| `docs/playbook.js` | Contents highlighting and the mobile contents menu |
| `tests/playbook.test.mjs` | Tests for the highlighting logic and page integrity |
| `.github/workflows/pages.yml` | Runs tests, then publishes `docs/` to GitHub Pages |

There are no npm dependencies and no build step.

## Preview locally

```bash
npm run serve
```

Then open http://localhost:8080. The page loads `playbook.js` as an ES module, so open it through a local server rather than as a file.

## Test

Requires Node.js 22.

```bash
npm test
```

## Publish

Every push to `main` runs the tests and, if they pass, deploys `docs/` to GitHub Pages. Pull requests into `main` run the tests without deploying.

## Editing content

The content in `docs/index.html` was converted from `Tech_Employee_Playbook.docx` without rewording. When you edit it:

- Give every new `h2` or `h3` a unique `id`, and add a matching link to the contents list in the `pb-toc` nav.
- Keep scripts and styles in their own files. The page's Content Security Policy blocks inline scripts, inline styles, and inline event handlers, and the tests check for them.
- Open outside links in a new tab with `target="_blank" rel="noopener noreferrer"`.

## Visibility

This repository and site are public. The page asks search engines not to index it (`noindex`), but anyone with the link can read it. Don't add credentials, private links, or personal details.
