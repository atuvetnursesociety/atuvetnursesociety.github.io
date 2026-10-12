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
  suJoinUrl: "https://donegal.atusulife.ie/society/veterinary",

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
  eventsCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTosgc14KMfgz_CXmsYfXSviIV7qECg3HrU5ib5LZgruDsrN6edK_iZWOeMrZJbguYtzJQ_LMYxfQZ_/pub?gid=1237458216&single=true&output=csv",
  committeeCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTosgc14KMfgz_CXmsYfXSviIV7qECg3HrU5ib5LZgruDsrN6edK_iZWOeMrZJbguYtzJQ_LMYxfQZ_/pub?gid=1208955717&single=true&output=csv",
  galleryCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTosgc14KMfgz_CXmsYfXSviIV7qECg3HrU5ib5LZgruDsrN6edK_iZWOeMrZJbguYtzJQ_LMYxfQZ_/pub?gid=801687777&single=true&output=csv",
  resourcesCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTosgc14KMfgz_CXmsYfXSviIV7qECg3HrU5ib5LZgruDsrN6edK_iZWOeMrZJbguYtzJQ_LMYxfQZ_/pub?gid=1671987721&single=true&output=csv",

  // --- Suggestion box -----------------------------------------------------
  // Paste the embed URL of a Google Form here to show it on the Suggestions
  // page. To get it: open your Form → Send (top right) → the "<>" embed
  // tab → copy the "src" value out of the <iframe> code shown there (it
  // looks like https://docs.google.com/forms/d/e/.../viewform?embedded=true).
  // Leave blank and the page will show a plain "email us your suggestions"
  // message instead, so it never looks broken.
  suggestionFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdPZc-ELzMGxFy_30I90wYb613eycXOr5BwniF5kS1xt_zWlw/viewform?embedded=true",
};
