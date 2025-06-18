import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servers | XRCraftMC',
  description: 'View available servers on XRCraftMC.',
};

export default function ServersPage() {
  const serversAtLaunch = [
    "Survival (NO CLAIMS)",
    "Bedwars",
    "Minigames",
    "FFA",
    "Parkour",
  ];

  const serversLater = [
    "Economy",
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">XRCraftMC Servers</h1>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Servers Available at Launch</h2>
        <ul className="list-disc list-inside space-y-2">
          {serversAtLaunch.map((server, index) => (
            <li key={index}>{server}</li>
          ))}
        </ul>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Servers Coming Later</h2>
        <ul className="list-disc list-inside space-y-2">
          {serversLater.map((server, index) => (
            <li key={index}>{server}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
