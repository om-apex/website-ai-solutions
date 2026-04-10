import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Om AI Solutions LLC terms of service.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf4fb_100%)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-950">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: April 9, 2026</p>

        <div className="prose prose-slate mt-8 max-w-none text-[15px] leading-relaxed">
          <section>
            <h2>1. Acceptance</h2>
            <p>
              By using this website, submitting a form, or engaging with Om AI Solutions LLC content, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2>2. Permitted Use</h2>
            <p>
              You may use this website for lawful business, research, and informational purposes. You may not misuse the site,
              interfere with its operation, or attempt unauthorized access to any systems or data.
            </p>
          </section>

          <section>
            <h2>3. Product and Service Information</h2>
            <p>
              Website content, survey outputs, product descriptions, and roadmap references are provided for general informational purposes.
              They may change without notice as our products and services evolve.
            </p>
          </section>

          <section>
            <h2>4. No Professional Reliance</h2>
            <p>
              Nothing on this website should be treated as legal, financial, accounting, or other regulated professional advice.
              You are responsible for evaluating whether any output or recommendation is appropriate for your business.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              All site content, branding, product names, visuals, and written materials are the property of Om AI Solutions LLC
              or its licensors, unless otherwise stated.
            </p>
          </section>

          <section>
            <h2>6. Third-Party Links</h2>
            <p>
              This site may link to external services or affiliated products. We are not responsible for the availability or content of third-party sites.
            </p>
          </section>

          <section>
            <h2>7. Disclaimer</h2>
            <p>
              This website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind,
              to the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Om AI Solutions LLC will not be liable for indirect, incidental, special,
              or consequential damages arising from your use of this website.
            </p>
          </section>

          <section>
            <h2>9. Updates</h2>
            <p>
              We may revise these Terms of Service from time to time by posting an updated version on this page.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
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
