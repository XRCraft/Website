import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | XRCraftMC',
  description: 'Learn more about the XRCraftMC Minecraft Server and its features.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">About XRCraftMC</h1>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">What is XRCraft?</h2>
        <p className="mb-2">XRCraft is a Minecraft server, which may be included by default.</p>
        <p>The server is VR optimized and works best on VR and on PC.</p>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Version Support</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Supported Versions:</h3>
            <p>1.18.2 - 1.21.5</p>
          </div>
          <div>
            <h3 className="font-semibold">Recommended Versions:</h3>
            <p>1.21.1 - 1.21.5</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Release Status</h2>
        <p>Not yet released. XRCraft is in development and is slated for release on the day of QuestCraft 6.0.</p>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Recommended Mods</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>SimpleVoiceChat</li>
          <li>Vivecraft</li>
        </ul>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Relation to QuestCraft</h2>
        <p>QuestCraft is a large part as we are a VR server, but it is not our main point as we are still separate entities.</p>
      </section>
    </div>
  );
}
