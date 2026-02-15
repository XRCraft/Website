import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | XRCraftMC',
  description: 'Terms of Use for XRCraftMC Minecraft Server and Website.',
};

export default function TermsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">Terms of Use</h1>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Acceptance of Terms</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          By accessing or using the XRCraftMC website, Minecraft server, or Discord community (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Use (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Services.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          These Terms apply to all visitors, users, and others who access or use the Service. Any individuals who have already joined or participated in the community are considered to have already agreed to these terms.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. User Conduct</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          As a user of XRCraftMC, you agree to follow our community guidelines and rules. Specifically, you agree not to:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300 ml-4">
          <li>Violate any applicable laws or regulations.</li>
          <li>Infringe upon the rights of others, including intellectual property rights.</li>
          <li>Engage in harassment, hate speech, or abusive behavior.</li>
          <li>Attempt to disrupt or compromise the security of our servers or website.</li>
          <li>Use unauthorized modifications (cheats/hacks) on our Minecraft server.</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          Please refer to our <Link href="/rules" className="text-blue-500 hover:text-blue-700 underline">Rules Page</Link> for a complete list of server rules.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Intellectual Property</h2>
        <p className="text-gray-600 dark:text-gray-300">
          The XRCraftMC website and its original content, features, and functionality are owned by XRCraftMC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. Any blocks, items, or other User Generated Content (UGC) made on this server are also owned by XRCraftMC and may not be used without permission outside of the Service. You are granted a limited, non-exclusive license to use the Services for personal or commercial use, where you can use and modify services available to you, unlesse taken away.
          <br /><br />
          Minecraft content and materials are trademarks and copyrights of Mojang Studios. We are not affiliated with Mojang Studios or Microsoft.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Purchases and Donations</h2>
        <p className="text-gray-600 dark:text-gray-300">
          All purchases and donations made to XRCraftMC are final and non-refundable. By making a purchase, you acknowledge that you are of legal age to make a purchase or have parental consent.
          <br /><br />
          We reserve the right to change the price of any product or service at any time. Chargebacks or payment disputes may result in a permanent ban from our Services.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Limitation of Liability</h2>
        <p className="text-gray-600 dark:text-gray-300">
          In no event shall XRCraftMC, nor its staff, partners, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Termination</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          <br /><br />
          All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">7. Changes to Terms</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>
      </section>
      
      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">8. Administration</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Administrators of XRCraftMC reserve the right to interpret these rules and terms at their own discretion. Staff members may take any action they deem necessary to maintain the server environment, including but not limited to banning, muting, or removing players and content for any reason, or no reason at all. &quot;Admin abuse&quot; is expressly permitted as a prerogative of the administration team.
        </p>
      </section>

      <section className="glass-container p-6 rounded-lg shadow-md bg-white/50 dark:bg-black/30 backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">9. Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-300">
          If you have any questions about these Terms, please contact us via our Discord server.
        </p>
      </section>
    </div>
  );
}
