# ATU Vet Nursing Society website

This is the website for the ATU Vet Nursing Society, published at
`https://[username].github.io/atu_vetnurse_soc/`.

You do **not** need to know how to code to keep this site up to date. Almost
everything — events, committee members, photos, resources — is managed from a
Google Sheet. This guide walks through everything, step by step.

---

## 1. Adding or editing an event, committee member, photo or resource

All of this content lives in one Google Sheet, with a separate tab for each
type of content: **Events**, **Committee**, **Gallery**, **Resources**.

1. Open the Google Sheet (ask a committee member for the link, or see
   "One-time setup" below if it doesn't exist yet).
2. Click the tab at the bottom for the thing you want to change (e.g.
   "Events").
3. Each row is one item. To add something new, add a new row and fill in
   each column. To edit something, just change the text in that row. To
   remove something without deleting your history of it, put `no` in the
   `show` column instead of deleting the row — the item will disappear from
   the site but the row stays in the sheet.
4. Keep the column headings (the first row) exactly as they are — the site
   reads columns by name, so don't rename or reorder them.

**Column reference:**

| Tab | Columns | Notes |
|---|---|---|
| Events | `title, date, start_time, end_time, location, price, description, image, signup_url, show` | `date` must be written as `YYYY-MM-DD` (e.g. `2026-11-20`). `start_time`/`end_time` as `HH:MM` in 24-hour time (e.g. `18:00`). Leave `price` blank or `0` for a free event. Leave `signup_url` blank if there's no sign-up link — the "Sign up" button just won't show. `image` is optional — see photo naming below. |
| Committee | `name, role, bio, fun_fact, photo, order, show` | `order` is a number controlling the order people appear in (1 = first). `photo` is optional. For `bio`, put each fact on its own line inside the cell (in Google Sheets, press Alt+Enter — or Option+Enter on a Mac — to start a new line without moving to the next cell), written as `Label: detail`, e.g. `From: Galway`. The site shows each line as its own bullet with the label in bold, exactly as typed — it doesn't rewrite anything. |
| Gallery | `image, caption, album, date, show` | `album` groups photos together for the album filter on the Gallery page. `date` is `YYYY-MM-DD`, used to sort newest-first. |
| Resources | `section, title, description, url, order, show` | `section` must be exactly one of: `Placement tips`, `Careers info`, or `Wellbeing support`. `url` is optional. |

A blank `show` column is treated as "yes" — you only need to type something
there if you want to hide a row.

Past events disappear from the Events page and the homepage automatically
once their date has passed — you don't need to delete them.

---

## 2. Uploading photos

Photos referenced in the Sheet (committee photos, event images, gallery
photos) need to be uploaded into this GitHub repository, in the `images`
folder, in the right subfolder:

- Committee photos → `images/committee/`
- Event photos → `images/events/`
- Gallery photos → `images/gallery/`

**To upload a photo using the GitHub website (no software needed):**

1. Go to the repository on github.com and open the right `images/...`
   subfolder.
2. Click **Add file → Upload files**.
3. Drag your photo in, or click to choose it from your computer.
4. Scroll down and click **Commit changes**.

**Naming your photo:** use lowercase letters, numbers and hyphens only, no
spaces (e.g. `sarah-committee-photo.jpg`, `farm-visit-2026.jpg`). Then, in
the Google Sheet, type that exact filename into the `photo` or `image`
column for the matching row.

You can also just paste a full image URL (starting with `http://` or
`https://`) directly into the `photo`/`image` column instead of uploading a
file, if you'd rather host the photo elsewhere.

If a photo is missing or the filename doesn't match, the site shows a
friendly placeholder instead of a broken image — so don't worry about
getting it wrong, nothing will look broken.

---

## 3. How long changes take to appear

Once you edit the Google Sheet, it can take **a few minutes** for the
published version to update — Google needs to re-publish it. If your change
doesn't show up straight away:

- Wait a couple of minutes and try again.
- Do a hard refresh in your browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on
  Mac) to make sure you're not looking at a cached version.

Photo uploads and any direct edits to files on GitHub (like this README or
`js/config.js`) usually appear within a minute or two of committing.

---

## 4. Changing the SU link, email, Instagram and colours

These live in one file: **`js/config.js`**. To edit it on the GitHub
website:

1. Open `js/config.js` in the repository.
2. Click the pencil/edit icon.
3. Find the line for what you want to change (each one has a comment
   explaining what it does) and edit the text **between the quote marks**.
   For example, to change the email address:
   ```
   email: "TODO@example.com",
   ```
   becomes
   ```
   email: "committee@example.ie",
   ```
4. Scroll down and commit your changes.

You can change: the society name, campus, tagline, the Students' Union join
link, the email address, and the Instagram handle/link — all from this one
file.

**Changing colours:** open `css/style.css` and look at the very top of the
file, inside the `:root { ... }` block. Each brand colour is listed as a
hex code (e.g. `--color-seafoam: #89c1be;`). Change the hex code to change
the colour everywhere on the site. If you change a colour that's used for
button backgrounds, check the new colour still has good contrast with the
text on top of it — a free tool like
[WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/)
will tell you.

---

## 5. One-time setup: connecting a real Google Sheet

Right now the site runs on sample data stored directly in this repository
(the `data/` folder), so it works even before a Google Sheet exists. To
switch to a real, committee-editable Sheet:

1. Create a new Google Sheet with four tabs, named exactly: `Events`,
   `Committee`, `Gallery`, `Resources`.
2. In each tab, copy in the matching template from `data/templates/` (open
   the file on GitHub, copy its contents, and paste into row 1 of the
   matching tab) — this gives you the correct column headings and one
   example row to copy the format from.
3. For each tab: **File → Share → Publish to web**. Choose the specific tab
   (not "Entire document"), choose **Comma-separated values (.csv)** as the
   format, then click **Publish**. Copy the link it gives you.
4. Paste each of the four links into the matching line in `js/config.js`
   (`eventsCsvUrl`, `committeeCsvUrl`, `galleryCsvUrl`, `resourcesCsvUrl`),
   between the quote marks.
5. Commit the change. The site will now pull live data from your Sheet —
   if anything goes wrong (wrong link, Sheet not published, etc.) the site
   automatically falls back to the sample data in `data/`, so it will never
   show a broken page.

Share the Google Sheet with anyone on the committee who needs to edit
content, the same way you'd share any Google Doc.

---

## 6. Handing the site over to next year's committee

When your term ends, make sure the next committee has:

- Edit access to the Google Sheet (share it with their college email
  addresses, or transfer ownership).
- Access to this GitHub repository (add them as collaborators, or transfer
  the repository).
- The login details for whatever email/Instagram accounts are used, if
  those aren't already shared accounts.
- A quick read of this README — that's really all they need.

If the SU join link, email address or Instagram handle change with the new
committee, update them in `js/config.js` (see section 4).

---

## For developers

- **Local preview:** this is a plain static site with no build step. From
  the project folder, run:
  ```
  python3 -m http.server
  ```
  then open `http://localhost:8000` in a browser. A local server is
  required (rather than opening the HTML files directly) because the
  browser's fetch of the local `data/*.csv` fallback files is blocked by
  CORS rules under a plain `file://` URL.
- **Stack:** plain HTML/CSS/vanilla JS, no framework, no npm. [Papa
  Parse](https://www.papaparse.com/) (from cdnjs) parses CSV data
  client-side.
- **File structure:**
  - `css/style.css` — all styles; design tokens as CSS custom properties at
    the top.
  - `js/config.js` — site identity and the four published-CSV URLs.
  - `js/data.js` — shared data-fetching/cleaning helpers used by every
    data-driven page.
  - `js/site.js` — shared nav/footer/identity-injection/scroll-reveal
    behaviour, loaded on every page.
  - `js/home.js`, `committee.js`, `events.js`, `gallery.js`, `resources.js`
    — one script per data-driven page.
  - `data/*.csv` — local fallback data, used whenever a Sheet URL in
    `config.js` is blank or fails to load.
  - `data/templates/*.csv` — minimal starter templates for setting up a
    fresh Google Sheet.
- **Deployment:** GitHub repo → Settings → Pages → Deploy from branch →
  `main` / `/ (root)`. The `.nojekyll` file at the repo root stops GitHub
  Pages from running the site through Jekyll, which isn't needed here.
- **Why header/footer markup is duplicated across every `.html` file:**
  there's no server-side include mechanism without a build step, so each
  page has its own copy. If you change the nav or footer, update it in all
  seven HTML files.
