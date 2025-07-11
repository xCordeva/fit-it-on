export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h1 className="text-4xl font-bold mb-6">Fit It On - Privacy Policy</h1>
      <p className="text-gray-600 mb-8">Last Updated: July 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          At <strong>FitItOn</strong>, we respect your privacy and are committed
          to protecting your personal information. This Privacy Policy explains
          how we collect, use, and safeguard your data when you use our website,
          apps, and services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Scope of this Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          This policy applies to all services provided by{" "}
          <strong>FitItOn</strong>. Third-party services integrated with our
          offerings have their own privacy policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Information Collection</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          We collect information in the following ways:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <strong>Direct Collection:</strong> Information you provide such as
            contact details, and content you upload or share.
          </li>
          <li>
            <strong>Automatic Collection:</strong> Device info, geolocation (if
            enabled), and usage data like pages visited and interactions.
          </li>
          <li>
            <strong>Third-Party Sources:</strong> Additional data from partners
            like social networks or service providers.
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          <strong>Photo Privacy:</strong> Photos uploaded for virtual try-on are
          only stored to enhance your experience. They are never shared with
          third parties, not used for training AI, and can be deleted by you at
          any time from your gallery settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Use of Information</h2>
        <p className="text-gray-700 leading-relaxed">
          Your information is used to:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Provide and improve our services.</li>
          <li>Communicate updates, offers, and customer support.</li>
          <li>Ensure security and legal compliance.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Information Sharing</h2>
        <p className="text-gray-700 leading-relaxed">
          We share your data only:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>With your consent.</li>
          <li>With trusted service providers to support our services.</li>
          <li>
            To comply with legal obligations or protect rights and safety.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Data Protection</h2>
        <p className="text-gray-700 leading-relaxed">
          We implement industry-standard measures to protect your data. In case
          of a data breach, we will notify affected users promptly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Data Retention</h2>
        <p className="text-gray-700 leading-relaxed">
          Personal data is kept only as long as necessary to fulfill the
          purposes described here and to comply with legal requirements.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          You have rights regarding your personal data, including access,
          correction, deletion, and objection to processing where applicable.
        </p>
        <p className="text-gray-700 leading-relaxed mb-2">
          Depending on your location, you may also have rights under laws such
          as the GDPR (EU/UK/Switzerland) or CCPA (California).
        </p>
        <p className="text-gray-700 leading-relaxed">
          <strong>Account Deletion:</strong> When you delete your account, all
          associated personal data — including uploaded photos and try-on
          history — is permanently deleted from our systems. This action is
          irreversible and the data cannot be recovered.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Changes to this Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this policy occasionally. Updates will be posted on our
          website with an updated effective date. Continued use of our services
          after changes implies your acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          For questions or to exercise your rights, please contact us at{" "}
          <a
            href="mailto:legal@fititon.app"
            className="text-blue-600 underline"
          >
            legal@fititon.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
