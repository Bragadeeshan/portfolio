# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Bragadeeshan Suppusamy — a static single-page site with no build step, no framework, and no package manager. Open `index.html` directly in a browser to develop.

## Running Locally

No build required. Open `index.html` in a browser, or use any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

## Architecture

Three source files, loaded in order at the bottom of `index.html`:

1. **`data.js`** — Defines the global `PORTFOLIO_CONFIG` object. This is the single source of truth for all content: GitHub username, Web3Forms access key, and the `projects` array. **All content edits start here.**

2. **`app.js`** — Reads from `PORTFOLIO_CONFIG` at runtime. Key responsibilities:
   - `buildProjects()` — async function that renders the projects grid. For any project with a `githubRepo` key, it fetches live repo metadata from the GitHub API (`https://api.github.com/users/{username}/repos`) to populate missing fields like the GitHub URL.
   - Contact modal open/close and Escape key handling
   - Web3Forms `fetch` POST for the contact form (key injected from config)
   - Scroll reveal via `IntersectionObserver` — elements with class `reveal` animate in when visible
   - Custom cursor (`#cursor`, `#cursorRing`) with `requestAnimationFrame` lag effect
   - Nav `scrolled` class toggled after 40px scroll

3. **`styles.css`** — All styling; no preprocessor.

## Adding or Editing Projects

Edit the `projects` array in `data.js`. Each entry supports:

```js
{
  title: "Project Name",
  summary: "Short description shown on the card",
  tech: ["React", "TypeScript"],   // displayed as bullet-separated tags
  image: "assets/projects/name.png",
  liveUrl: "https://...",          // optional — renders "Live Site" button
  githubUrl: "https://...",        // optional — explicit GitHub URL
  githubRepo: "repo-name",         // optional — fetches live GitHub data; githubUrl falls back to fetched html_url
  featured: true                   // optional — adds "featured" CSS class to card
}
```

If `githubRepo` is set and the GitHub API call succeeds, `description` from the API fills the summary if none is provided in config.

## Contact Form

Uses [Web3Forms](https://web3forms.com). The access key lives in `PORTFOLIO_CONFIG.web3formsAccessKey` in `data.js`. The `replyto` hidden field is set to the submitter's email at submit time so replies go directly to them.
