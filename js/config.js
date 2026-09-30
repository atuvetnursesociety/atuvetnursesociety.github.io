/* ============================================================
   SITE CONFIG — the society's "control panel"
   ============================================================
   COMMITTEE MEMBERS: this is the one file you should need to edit
   for contact links and (together with css/style.css) colors.
   See README.md, section "Changing the SU link, email, Instagram
   and colours", for step-by-step instructions on editing this file
   using the GitHub website — no coding knowledge needed.

   Every value below is a piece of text between quote marks "like
   this". To change one, replace the text between the quotes and
   keep the quote marks and the comma at the end of the line.
   ============================================================ */

window.SITE_CONFIG = {
  // --- Society identity -------------------------------------------------
  // TODO: replace with the real society name, campus and one-liner.
  societyName: "ATU Vet Nursing Society", // full name, shown in the header/footer and page titles
  societyShortName: "ATU VNS", // short version, used where space is tight
  campus: "ATU [campus name]", // e.g. "ATU Galway" — TODO: fill in the real campus
  tagline: "A community for vet nursing students to learn, socialise and support each other.", // shown on the home page hero — TODO: replace with your own line if you'd like a different one

  // --- Joining & contact --------------------------------------------------
  // TODO: replace with the real Students' Union membership page link.
  suJoinUrl: "https://example.com/TODO-su-membership-link",

  email: "atuvetnursesociety@gmail.com",

  instagramHandle: "@atuvetnursesociety",
  instagramUrl: "https://www.instagram.com/atuvetnursesociety/",

  // --- Content data sources -------------------------------------------------
  // Each of these should be the URL you get from:
  //   Google Sheet → File → Share → Publish to web → choose the tab →
  //   choose "Comma-separated values (.csv)" → Publish → copy the link.
  // Leave any of these blank ("") and the site will automatically use the
  // sample data in the /data folder instead, so the site never looks broken.
  // See README.md, section "One-time setup", for the full walkthrough.
  eventsCsvUrl: "",
  committeeCsvUrl: "",
  galleryCsvUrl: "",
  resourcesCsvUrl: "",
};
