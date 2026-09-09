import React from "react";


const PRIVACY_SECTIONS = [
  {
    id: 1,
    title: "1. Information We Collect",
    content: "We only collect information that is necessary to provide and improve our services at Ebliko-Hub. This includes details you actively provide when creating an account, managing your Watchlist, or customizing your profile."
  },
  {
    id: 2,
    title: "2. How We Use Your Data",
    content: "Your personal data, including your anime ratings, comments, and list statistics, is used solely to render your personal dashboard and dynamically sync your interactions across devices using safe storage solutions like local storage and secured databases."
  },
  {
    id: 3,
    title: "3. Data Retention and Syncing",
    content: "Your filter preferences, design theme configurations (light or dark mode), and visual sessions are securely stored. We do not sell, trade, or transfer your analytical profile data to third-party tracking services."
  },
  {
    id: 4,
    title: "4. Cookies and Theme Settings",
    content: "We use functional identifiers to preserve your active interface layouts (such as hiding or showing scrollbars, keeping filter states active, and identifying authorization scopes). You can manage or purge these states through your browser settings at any moment."
  },
  {
    id: 5,
    title: "5. Contact Us",
    content: "If you have questions about this Privacy Policy or data flow optimizations within the application, feel free to contact our development core team directly through the support hub."
  }
];

export default function Privacy() {
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border/60 shadow-xs">
        
       
        <div className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-foreground/50">
            Last updated: June 25, 2026
          </p>
        </div>

        
        <div className="flex flex-col gap-8 text-foreground/80 leading-relaxed text-sm sm:text-base">
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.id} className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-primary uppercase tracking-wide">
                {section.title}
              </h2>
              <p className="text-foreground/90">
                {section.content}
              </p>
            </section>
          ))}
        </div>
        
      </div>
    </div>
  );
}