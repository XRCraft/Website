import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | XRCraftMC',
  description: 'Learn more about the XRCraftMC Minecraft Server and its features.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">About XRCraftMC</h1>

      <section className="glass-container">
        <h2 className="text-2xl font-semibold mb-3">What is XRCraft?</h2>
        <p className="mb-2">XRCraft is a VR-optimized Minecraft server designed specifically for an immersive experience.</p>
        <p>The server is carefully tuned to provide the best performance for both VR players (especially QuestCraft users) and traditional PC players.</p>
      </section>

      <section className="glass-container">
        <h2 className="text-2xl font-semibold mb-3">Version Support</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-light p-4">
            <h3 className="font-semibold">Supported Versions:</h3>
            <p>1.21.11 - 1.19.2</p>
          </div>
          <div className="glass-light p-4">
            <h3 className="font-semibold">Recommended Versions:</h3>
            <p>1.21.8 - 1.21.5</p>
          </div>
        </div>
      </section>

      <section className="glass-container">
        <h2 className="text-2xl font-semibold mb-3">Recommended Mods</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>SimpleVoiceChat</li>
          <li>Vivecraft</li>
        </ul>
      </section>

      <section className="glass-container">
        <h2 className="text-2xl font-semibold mb-3">Relation to QuestCraft</h2>
        <p>QuestCraft is a large part as we are a VR server, but it is not our main point as we are still separate entities.</p>
      </section>
    </div>
  );
}
