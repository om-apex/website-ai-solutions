import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Om AI Solutions LLC privacy policy.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf4fb_100%)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-950">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: April 9, 2026</p>

        <div className="prose prose-slate mt-8 max-w-none text-[15px] leading-relaxed">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Om AI Solutions LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to
              protecting the information you share with us through our website, contact forms, surveys, and related services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <ul>
              <li>Contact details you submit, such as name, email, phone number, and company name.</li>
              <li>Messages, survey responses, and product-interest information you choose to provide.</li>
              <li>Basic device and usage data such as browser type, page visits, and referring URLs.</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Information</h2>
            <ul>
              <li>Respond to inquiries and route conversations to the appropriate product or service.</li>
              <li>Improve our website, surveys, and AI product direction.</li>
              <li>Send follow-up communications related to the request you submitted.</li>
              <li>Maintain site security and prevent abuse.</li>
            </ul>
          </section>

          <section>
            <h2>4. Sharing</h2>
            <p>
              We do not sell your personal information. We may share information with service providers that help us operate
              our website, forms, analytics, and communications infrastructure.
            </p>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>
              We keep information only as long as reasonably necessary for business, legal, operational, or support purposes.
            </p>
          </section>

          <section>
            <h2>6. Your Choices</h2>
            <p>
              You may request access, correction, or deletion of your personal information by contacting us at{' '}
              <a href="mailto:info@omaisolutions.com">info@omaisolutions.com</a>.
            </p>
          </section>

          <section>
            <h2>7. Third-Party Services</h2>
            <p>
              Our site may link to or rely on third-party services. Those services maintain their own privacy practices and policies.
            </p>
          </section>

          <section>
            <h2>8. Updates</h2>
            <p>
              We may update this Privacy Policy from time to time by posting a revised version on this page.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Om AI Solutions LLC
              <br />
              Email: <a href="mailto:info@omaisolutions.com">info@omaisolutions.com</a>
              <br />
              Website: <a href="https://omaisolutions.com">omaisolutions.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
