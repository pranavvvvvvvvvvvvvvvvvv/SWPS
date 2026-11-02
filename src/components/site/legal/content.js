// Plain-language legal copy for the SWPS site. Each block is a paragraph
// (string), a bullet list (array of strings), a callout ({ note }) or a table.

export const TERMS = {
  eyebrow: "Legal",
  title: "Terms and Conditions",
  description:
    "The rules for using the SWPS website, dashboard and the data it presents. Please read these before relying on any reading shown here.",
  updated: "2 November 2026",
  sections: [
    {
      id: "acceptance",
      title: "1. About these terms",
      blocks: [
        "SWPS (Smart Water Purification and Quality Monitoring System) is a project website and monitoring dashboard. By creating an account or using the site, you agree to these terms. If you do not agree, please do not use the service.",
        "These terms apply to the public project pages, the monitoring dashboard and any reading, alert, report or prediction displayed in them.",
      ],
    },
    {
      id: "service",
      title: "2. What this service is",
      blocks: [
        "The site explains a low-cost purification unit and monitoring platform, and gives registered users access to live sensor readings, purification control logs, alerts, maintenance status and short-term water quality estimates for the units they are allowed to see.",
        "Some data may come from hardware prototypes, from the built-in device simulator, or from manual test-kit entries. Demo or simulated data is labelled as such where it appears.",
      ],
    },
    {
      id: "not-certified",
      title: "3. Not a substitute for certified testing",
      blocks: [
        "Readings come from low-cost sensors — TDS, turbidity, temperature and level — and from manual test-kit entries. They are indicative and can drift, need calibration and may be interrupted by connectivity problems.",
        {
          note:
            "Nothing shown in this app is a certified laboratory result, medical advice, or a guarantee that water is safe to drink. Official drinking-water compliance requires testing by an accredited laboratory. Do not make health, legal or regulatory decisions on the basis of these readings.",
        },
        "Where the system holds a release valve closed, treat that as a precaution worked out by the control logic, not as a final judgement on the water.",
      ],
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable use",
      blocks: [
        "You agree to use the service only for its intended purpose. You must not:",
        [
          "attempt to access units, accounts or data you have not been given permission to see;",
          "send fabricated sensor readings, or interfere with thresholds, control logs or alerts;",
          "probe, scan, overload or attempt to disrupt the site, its backend functions or the units connected to it;",
          "scrape or bulk-copy content, or resell access to the service;",
          "upload unlawful, misleading or harmful content through any form on the site.",
        ],
        "We may suspend access where these rules are broken or where an account is used in a way that endangers a deployment.",
      ],
    },
    {
      id: "accounts",
      title: "5. Accounts and access",
      blocks: [
        "Accounts are created by invitation or sign-up. You are responsible for keeping your sign-in details secure and for activity carried out through your account. Tell us promptly if you believe your account has been used without permission.",
        "Administrators assign roles and decide which units each account can view or control. Access may be changed or withdrawn when a deployment ends or responsibilities change.",
      ],
    },
    {
      id: "your-content",
      title: "6. Information you enter",
      blocks: [
        "If you submit a message, a manual reading, a threshold or a note, you confirm that the information is accurate to the best of your knowledge and that you are allowed to share it.",
        "Contact messages are stored so they can be answered and, where relevant, followed up on a deployment issue.",
      ],
    },
    {
      id: "ip",
      title: "7. Intellectual property",
      blocks: [
        "The project name, written content, diagrams, control-logic design and interface of this site belong to the project developer. You may quote or cite material for study, reporting or non-commercial reference with clear attribution.",
        "You may not present the project's content or design as your own, or use it commercially, without written permission.",
      ],
    },
    {
      id: "third-party",
      title: "8. Third-party services",
      blocks: [
        "The site uses hosting and database services, an AI service for the project assistant and for on-demand translation, and an email service for alerts and notifications. Those providers handle data under their own terms and privacy policies.",
        "Links to external sites are provided for reference. We do not control their content.",
      ],
    },
    {
      id: "availability",
      title: "9. Availability and changes to the service",
      blocks: [
        "The service is offered on a best-effort basis. It may be unavailable during maintenance, network outages or platform changes, and sensor coverage may be intermittent.",
        "Features, thresholds and documentation may change as the project develops. Material changes to these terms will be reflected on this page with a new date.",
      ],
    },
    {
      id: "liability",
      title: "10. Limitation of liability",
      blocks: [
        "To the extent permitted by law, the project and its developer are not liable for loss or damage arising from reliance on readings, alerts or predictions, from interruptions in availability, or from unauthorised access where reasonable security measures were in place.",
        "Nothing in these terms limits liability that cannot be limited under applicable law.",
      ],
    },
    {
      id: "law",
      title: "11. Governing law",
      blocks: [
        "These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts of Telangana.",
      ],
    },
    {
      id: "contact",
      title: "12. Questions about these terms",
      blocks: [
        "For any question about these terms, or to request changes to an account or submitted content, use the contact page. Messages are recorded against this project and answered by the developer.",
      ],
    },
  ],
};

export const PRIVACY = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  description:
    "What the SWPS app stores, why it stores it, and how you can ask for it to be corrected or removed.",
  updated: "2 November 2026",
  sections: [
    {
      id: "who",
      title: "1. Who runs this service",
      blocks: [
        "SWPS is a water purification and quality monitoring project — a website plus a monitoring dashboard used by operators, health officers and administrators of deployed units. The service is run by the project developer, Pranav. The contact page is the route for privacy requests.",
      ],
    },
    {
      id: "collect",
      title: "2. Information we collect",
      blocks: [
        "Account information — your name, email address and role, provided when an account is created or when you sign in with a third-party identity provider.",
        "Messages you send — the name, email address, subject and message you enter on the contact page, stored so the enquiry can be answered.",
        "Operational data — sensor readings, manual test-kit entries, thresholds, alerts, control logs, unit locations and the maintenance notes entered by operators. These records are about the water units, not about visitors, but they can show who entered a manual reading or acknowledged an alert.",
        "Assistant conversations — the text you type into the in-app project assistant, processed to produce an answer.",
        "Browser preferences — your chosen theme and language, which stay on your device (see the Cookie Policy).",
      ],
    },
    {
      id: "not-collect",
      title: "3. What we do not collect",
      blocks: [
        "We do not collect payment details — the site sells nothing. We do not build advertising profiles, we do not buy or sell contact lists, and we do not ask for identity documents, health records or precise visitor location.",
      ],
    },
    {
      id: "use",
      title: "4. How the information is used",
      blocks: [
        "to create and secure accounts, and to apply the access each role has been given;",
        "to operate the dashboard — showing readings, raising alerts, recording control actions and producing reports;",
        "to answer contact messages and follow up on deployment issues;",
        "to power the project assistant and to translate the site into the language you select;",
        "to keep the service reliable and to diagnose faults.",
      ],
    },
    {
      id: "ai",
      title: "5. The project assistant and translation",
      blocks: [
        "Questions typed into the assistant, and the text needed to translate a page, are sent to a third-party AI service (Google Gemini) to produce the answer or translation. Results may be stored briefly so the same text is not re-processed.",
        {
          note:
            "Please do not type personal, medical or confidential information into the assistant. It is intended for questions about the system, the sensors, safe limits and the dashboard.",
        },
      ],
    },
    {
      id: "sharing",
      title: "6. Who the information is shared with",
      blocks: [
        "Service providers that make the app work: the hosting and database platform, the email service used for alerts and notifications, and the AI service described above. They process data on the project's instructions or as independent controllers under their own policies.",
        "Administrators of the deployment, who can see operational records and account details for the units they manage.",
        "Authorities, where disclosure is required by law or necessary to protect someone's safety.",
        "We do not sell personal information, and we do not share it for advertising.",
      ],
    },
    {
      id: "cookies",
      title: "7. Cookies and local storage",
      blocks: [
        "The app uses browser storage for sign-in sessions and for your theme, language and translation preferences. Advertising or cross-site tracking cookies are not used. The Cookie Policy lists each item.",
      ],
    },
    {
      id: "retention",
      title: "8. How long information is kept",
      blocks: [
        "Account records are kept while the account is active and for a reasonable period afterwards for security and record-keeping.",
        "Contact messages are kept while the enquiry is being handled and afterwards only where needed for project records.",
        "Sensor readings, control logs and alerts form the historical record of a water unit and may be retained for the life of the deployment, because comparing today's water with past readings is central to the project.",
        "Browser preferences stay on your device until you clear site data.",
      ],
    },
    {
      id: "security",
      title: "9. Security",
      blocks: [
        "Access to the dashboard requires an account and is limited by role. Traffic to the site is encrypted in transit, and private records are served through access-controlled storage.",
        "No system is perfectly secure. If you notice something that looks wrong — a unit or record you should not be able to see — report it through the contact page.",
      ],
    },
    {
      id: "rights",
      title: "10. Your choices and rights",
      blocks: [
        "You can ask to see the personal information held about you, ask for it to be corrected, or ask for your account and messages to be deleted. Where processing relies on consent, you can withdraw it.",
        "Requests are handled through the contact page. We aim to respond within 30 days. Deleting an account may remove access to units you were responsible for, so an administrator may need to reassign that role first.",
        "Some operational records (for example a control action recorded against a device) may have to be retained for the integrity of the water-safety record even after an account request.",
      ],
    },
    {
      id: "children",
      title: "11. Children",
      blocks: [
        "The service is intended for adults managing water units and for researchers and students working on the project. It is not directed at children under 18, and we do not knowingly collect their personal information.",
      ],
    },
    {
      id: "transfers",
      title: "12. Processing outside your country",
      blocks: [
        "The hosting, email and AI providers used by the app may process data in other countries. Reasonable safeguards are used, but local data-protection rules may differ from those where you live.",
      ],
    },
    {
      id: "changes",
      title: "13. Changes to this policy",
      blocks: [
        "If the way information is handled changes, this page will be updated and the date at the top revised. Continued use after a change means the revised policy applies.",
      ],
    },
    {
      id: "contact",
      title: "14. Contact",
      blocks: [
        "Privacy questions, access requests and deletion requests all go through the contact page, so they are logged against this project and answered by the developer.",
      ],
    },
  ],
};

export const COOKIES = {
  eyebrow: "Legal",
  title: "Cookie Policy",
  description:
    "The cookies and browser storage the SWPS app relies on, what each one does, and how to remove them.",
  updated: "2 November 2026",
  sections: [
    {
      id: "what",
      title: "1. What this policy covers",
      blocks: [
        "This policy covers cookies and similar browser storage — localStorage and sessionStorage — used by the SWPS site and dashboard.",
        "The site does not run advertising networks or cross-site trackers. The storage described here either keeps you signed in or remembers a preference you chose.",
      ],
    },
    {
      id: "necessary",
      title: "2. Strictly necessary",
      blocks: [
        "These are required for the app to work. Without them you cannot stay signed in or reach the dashboard.",
        {
          table: [
            ["Item", "Purpose", "Lifetime"],
            ["Session token", "Keeps you signed in between page visits; set by the hosting platform after sign-in.", "Until you sign out or clear site data"],
            ["MFA check (app-mfa-pkce:*)", "Holds a temporary verifier while a two-step sign-in completes.", "The current browser session"],
            ["Access-control cookies", "Carry your session so the dashboard can check which units and records you may see.", "Your session, or until sign-out"],
          ],
        },
      ],
    },
    {
      id: "preferences",
      title: "3. Preferences and convenience",
      blocks: [
        "These are optional in the sense that the site still loads without them — but you will lose your chosen display settings and some pages will feel slower.",
        {
          table: [
            ["Item", "Purpose", "Lifetime"],
            ["swps-theme", "Remembers light or dark mode.", "Until cleared"],
            ["swps-lang", "Remembers your chosen language.", "Until cleared"],
            ["swps-auto-translations", "Caches AI translations so a page is not translated again on every visit.", "Until cleared"],
            ["swps:last-readings", "Keeps the most recent readings on your device so the dashboard opens instantly while fresh data loads.", "Until cleared, refreshed on each visit"],
            ["swps-splash-seen", "Stops the opening animation replaying within the same session.", "The current browser session"],
          ],
        },
      ],
    },
    {
      id: "no-tracking",
      title: "4. What we do not use",
      blocks: [
        "No advertising or remarketing cookies; no social-media pixels; no cross-site behavioural tracking; no fingerprinting.",
        "The hosting platform and email service keep ordinary technical logs (request timing, error reports, delivery status) needed to run and protect the service. These are not used to advertise to you.",
      ],
    },
    {
      id: "third-party",
      title: "5. Third-party resources",
      blocks: [
        "Font files are loaded from Google Fonts. Like any request for a file on the web, this passes your IP address and browser details to Google; the site does not set cookies for this and does not use it to identify you.",
        "The interactive map on the dashboard loads map tiles from an external map provider, which receives the same kind of ordinary request information.",
      ],
    },
    {
      id: "manage",
      title: "6. Managing or removing them",
      blocks: [
        "Change the theme and language at any time from the header controls — the choice is stored again with your new preference.",
        "To clear stored data, use your browser's site-data settings for this site ('Clear cookies and site data', or 'Site settings'). Doing so signs you out; you can sign in again straight away. Removing the preference entries simply resets the display to its default.",
        {
          note:
            "Blocking all storage will prevent sign-in and therefore the dashboard. If you are only concerned about preferences, leave the session entries alone.",
        },
      ],
    },
    {
      id: "changes",
      title: "7. Changes to this policy",
      blocks: [
        "If the storage used by the app changes — for example a new preference is added — this page and the date at the top will be updated.",
      ],
    },
    {
      id: "contact",
      title: "8. Contact",
      blocks: [
        "Questions about cookies or browser storage can be sent through the contact page.",
      ],
    },
  ],
};
