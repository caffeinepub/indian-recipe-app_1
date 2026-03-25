import { useState } from "react";

type LegalType = "privacy" | "terms" | null;

export function LegalModal() {
  const [open, setOpen] = useState<LegalType>(null);

  return (
    <>
      {/* Footer Links */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <button
          type="button"
          onClick={() => setOpen("terms")}
          className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: "oklch(0.55 0.18 142)" }}
        >
          Terms &amp; Conditions
        </button>
        <span style={{ color: "oklch(0.30 0.01 0)" }}>|</span>
        <button
          type="button"
          onClick={() => setOpen("privacy")}
          className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: "oklch(0.55 0.18 142)" }}
        >
          Privacy Policy
        </button>
      </div>

      {/* Modal */}
      {open && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close is supplementary
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setOpen(null)}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation only */}
          <div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.11 0.008 0)",
              border: "1px solid oklch(0.22 0.01 0)",
              maxHeight: "85vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "oklch(0.22 0.01 0)" }}
            >
              <h2
                className="font-bold text-base"
                style={{ color: "oklch(0.93 0.01 0)" }}
              >
                {open === "terms" ? "Terms & Conditions" : "Privacy Policy"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-sm transition-opacity hover:opacity-70"
                style={{
                  background: "oklch(0.20 0.01 0)",
                  color: "oklch(0.70 0.01 0)",
                }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="overflow-y-auto px-5 py-5 space-y-4 text-sm leading-relaxed"
              style={{ color: "oklch(0.70 0.01 0)", maxHeight: "70vh" }}
            >
              {open === "terms" ? <TermsContent /> : <PrivacyContent />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TermsContent() {
  return (
    <div className="space-y-4">
      <p style={{ color: "oklch(0.50 0.01 0)" }}>
        <strong style={{ color: "oklch(0.80 0.01 0)" }}>App Name:</strong>{" "}
        Kitchen — Indian &amp; International Recipes
        <br />
        <strong style={{ color: "oklch(0.80 0.01 0)" }}>Owner:</strong> Binjo
        <br />
        <strong style={{ color: "oklch(0.80 0.01 0)" }}>Effective Date:</strong>{" "}
        March 2026
      </p>

      <Section title="1. Acceptance of Terms">
        By using the Kitchen app, you agree to these Terms and Conditions. If
        you do not agree, please stop using the app.
      </Section>

      <Section title="2. Use of the App">
        <ul className="list-disc pl-4 space-y-1">
          <li>This app is for personal, non-commercial use only.</li>
          <li>
            You may not copy, reproduce, or resell any content (recipes, photos,
            text) without written permission.
          </li>
          <li>
            You may not attempt to hack, reverse-engineer, or misuse any part of
            the app.
          </li>
        </ul>
      </Section>

      <Section title="3. User-Generated Content (Reviews)">
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Any rating or comment you submit will be publicly visible to all
            users.
          </li>
          <li>You agree not to post false, abusive, or illegal content.</li>
          <li>We reserve the right to remove any review at our discretion.</li>
        </ul>
      </Section>

      <Section title="4. Recipe & Content Accuracy">
        Recipes are provided for informational purposes only. We do not
        guarantee specific cooking results. For dietary needs or allergies,
        please consult a doctor or nutritionist.
      </Section>

      <Section title="5. Advertisements">
        The app may display ads through Google AdSense / AdMob. Ads are managed
        by third parties — we are not responsible for their content.
      </Section>

      <Section title="6. Intellectual Property">
        The Kitchen app name, logo, AI-generated photos, and all content are our
        intellectual property. No content may be reproduced without written
        permission.
      </Section>

      <Section title="7. Limitation of Liability">
        The Kitchen app is provided "as is." We are not liable for any indirect,
        incidental, or consequential damages arising from use of the app.
      </Section>

      <Section title="8. Changes to Terms">
        We may update these Terms at any time. Continued use of the app means
        you accept the updated Terms.
      </Section>

      <Section title="9. Governing Law">
        These Terms are governed by Indian law. Any disputes shall fall under
        the jurisdiction of courts in India.
      </Section>

      <Section title="10. Contact Us">
        Email:{" "}
        <a
          href="mailto:pk1668733@gmail.com"
          style={{ color: "oklch(0.55 0.18 142)" }}
        >
          pk1668733@gmail.com
        </a>
      </Section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-4">
      <p style={{ color: "oklch(0.50 0.01 0)" }}>
        <strong style={{ color: "oklch(0.80 0.01 0)" }}>App Name:</strong>{" "}
        Kitchen — Indian &amp; International Recipes
        <br />
        <strong style={{ color: "oklch(0.80 0.01 0)" }}>Owner:</strong> Binjo
        <br />
        <strong style={{ color: "oklch(0.80 0.01 0)" }}>Last Updated:</strong>{" "}
        March 2026
      </p>

      <Section title="1. Introduction">
        Kitchen respects the privacy of our users. This Privacy Policy explains
        what information we collect, how we use it, and your rights as a user.
      </Section>

      <Section title="2. Information We Collect">
        We do not collect any personal information such as name, email, or phone
        number. No sign-up or account is required.
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>
            Anonymous usage data — which recipes are viewed, which categories
            are popular.
          </li>
          <li>
            Ratings &amp; Reviews — star ratings and comments (no personal info
            required).
          </li>
          <li>
            Shopping List data — saved only on your device's local storage.
          </li>
        </ul>
      </Section>

      <Section title="3. Third-Party Services">
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong style={{ color: "oklch(0.80 0.01 0)" }}>
              Google AdSense / AdMob
            </strong>{" "}
            — to display advertisements.
          </li>
          <li>
            <strong style={{ color: "oklch(0.80 0.01 0)" }}>
              Google Translate
            </strong>{" "}
            — for automatic language detection.
          </li>
          <li>
            <strong style={{ color: "oklch(0.80 0.01 0)" }}>YouTube</strong> —
            for embedded video tutorials.
          </li>
        </ul>
      </Section>

      <Section title="4. Cookies & Local Storage">
        The app uses basic browser local storage to save your shopping list and
        preferences. No tracking cookies are used.
      </Section>

      <Section title="5. Children's Privacy">
        This app is not intended for children under the age of 13. We do not
        knowingly collect data from children.
      </Section>

      <Section title="6. Data Security">
        Your data is stored on secure servers. We take reasonable security
        measures, however, 100% security on the internet cannot be guaranteed.
      </Section>

      <Section title="7. Contact Us">
        For any privacy-related questions:
        <br />
        Email:{" "}
        <a
          href="mailto:pk1668733@gmail.com"
          style={{ color: "oklch(0.55 0.18 142)" }}
        >
          pk1668733@gmail.com
        </a>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="font-semibold mb-1"
        style={{ color: "oklch(0.85 0.01 0)" }}
      >
        {title}
      </h3>
      <div style={{ color: "oklch(0.62 0.01 0)" }}>{children}</div>
    </div>
  );
}
