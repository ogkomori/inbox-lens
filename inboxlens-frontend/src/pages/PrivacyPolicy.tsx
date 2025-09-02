import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="text-lg text-muted-foreground space-y-6">
        <div>
          <strong>InboxLens Privacy Policy</strong><br />
          <span className="text-sm">Last Updated: September 2025</span>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>InboxLens ("we", "our", or "us") is a personal email assistant that integrates with Gmail to generate concise summaries of daily emails and manage actionable emails. We respect your privacy and are committed to protecting your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li>Google Account information (email address, profile information) provided through OAuth2 login.</li>
            <li>Gmail message metadata and content strictly related to actionable email detection and tracking.</li>
            <li>User-provided account details (if you sign up within InboxLens).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Information</h2>
          <ul className="list-disc ml-6">
            <li>To identify and organize actionable emails into your InboxLens dashboard.</li>
            <li>To provide account access and personalized features.</li>
            <li>We do not use your Gmail data for advertising or marketing.</li>
            <li>We do not sell or share your data with third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Google API Services</h2>
          <p>Our use of information obtained from Google APIs complies with the Google API Services User Data Policy, including the Limited Use requirements. Gmail data is only accessed to identify and organize actionable emails, and is never transferred to any third party.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Data Sharing and Disclosure</h2>
          <p>We do not share your personal data with third parties except:</p>
          <ul className="list-disc ml-6">
            <li>As required by law or valid legal process.</li>
            <li>To service providers strictly necessary to operate InboxLens (e.g., database hosting).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Data Storage and Security</h2>
          <ul className="list-disc ml-6">
            <li>Data is stored securely in our databases with industry-standard security practices.</li>
            <li>OAuth tokens are encrypted and stored only to maintain your Gmail connection.</li>
            <li>We do not allow human access to Gmail data except with your consent, for security reasons, or to comply with law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. User Control and Data Deletion</h2>
          <ul className="list-disc ml-6">
            <li>You may revoke InboxLens access to your Gmail account at any time via your <a href="https://myaccount.google.com/permissions" className="underline text-primary">Google Account settings</a>.</li>
            <li>You may request deletion of your account and data by contacting us at the email below.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Cookies and Tracking</h2>
          <p>InboxLens uses session cookies and tokens strictly for authentication and security purposes. We do not use third-party tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify users by updating the "Last Updated" date at the top of this page.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
          <p className="font-mono">inboxlens.app@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
