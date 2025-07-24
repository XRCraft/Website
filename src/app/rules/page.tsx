import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rules | XRCraftMC',
  description: 'Read the rules for playing on the XRCraftMC Minecraft Server.',
};
export default function RulesPage() {
  const discordrules = [
    // todo
  ]
  const rules = [
    { id: 1, text: "No spamming of any type. This means no obnoxious noises, texts, or soundboards through ingame voicechat." },
    { id: 2, text: "No Advertisement. Any link, IP, or anything that may advertise another server, service, or anything will be heavily moderated." },
    { id: 3, text: "No asking staff for special items. Common sense, lower staff do not even have access to those commands!" },
    { id: 4, text: "No Harassment of any type. Any type of harassment that is within common sense is disallowed. Doxxing, blackmail or any type of leaking information is bannable." },
    { id: 5, text: "No Impersonation. Be yourself! Impersonation of certain people can be damaging. It is up to staff to moderate depending on severity." },
    { id: 6, text: "Appealing must be yourself. Appealing for someone else is disallowed and will get the appeal denied. Please ask the user to appeal instead using links provided publicly." },
    { id: 7, text: "All Discord rules apply ingame. This prohibits many things, and not many at the same time. We will make rules accessible within game for people who are not in the Discord." },
    { id: 8, text: "No modifications to give advantages. In some cases, it may be allowed in such cases as some Vivecraft features. But we moderate anything that allows unfair PVP, Movement, or speed. Any client modification nonspecific to Vivecraft is under the common sense rule of, if it gives a advantage, it's probably banned." },
    { id: 9, text: "No abuse of bugs / glitches. Abuse of bugs and glitches to give unfair advantages such as creation of items is bannable. In some cases, this may mean tens of people may be banned due to item duplication. Unless allowed per gamemode, most glitches will be bannable offences." },
    { id: 10, text: "Items that are not for public use are removable. Unless specifically given for a reason, all items that are not intended for public use (knockback 3, etc) will be removed when found, and warnings or worse may be given." },
    { id: 11, text: "Patience is required. Our staff have lives and are not stereotypical Discord Moderators, we will get to you ASAP." },
    { id: 12, text: "Disputes are allowed unless specifically said. If staff do something like mute you, you are able to dispute it unless specifically said by Admins." },
    { id: 13, tag: "BEDWARS", text: "No crossteaming. If you want to be on the same team, please join the same team before the match." },
    { id: 14, tag: "MINIGAMES", text: "Turn off any minimaps and freecam. Any minimap gives a unfair advantage, along with freecam." },
    { id: 15, tag: "SURVIVALIZED GAMEMODES", text: "No use of freecam. In certain situations, freecam may be useful to check builds, where it is fine to do that, but as soon as ANY player or unfair advantage like using it for far ranged attacks, or interactions, is bannable. We recommend you do not use it at all as this can be used against you." },
    { id: 16, text: "VPNs are not allowed. VPNs and proxy services are not allowed, and you may be kicked and unable to join. If you need to connect via a VPN or proxy, please contact staff privately for potential allowance." }, 
    { id: 17, text: "Do not sell items for real money. Selling items for money is extremely dangerous, slippery slope, for everyone inolved."},
    { id: 18, text: "No server scouting. Server scouting means asking people to friend you to get an invite to your server, people may come up to you, but you may not come up to them."},
    { id: 19, text: "Entity and item names must be suitable for players of all ages, i.e safe-for-work. Explicit names may be changed at any time by a staff member without warning or refunds."},
    { id: 20, tag: "SURVIVALIZED GAMEMODES", text: "No use of TNT dupers outside of farms. This includes griefing of any type" }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">XRCraftMC Server Rules</h1>

      <section className="glass-container border-l-4 border-yellow-500 dark:border-yellow-600">
        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Important Notes</h2>
        <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-300">
          <li>Rules may be updated at any time. Check back regularly. Pleading ignorance is not a valid excuse.</li>
          <li>Some rules only apply to specific gamemodes and are tagged accordingly (e.g., <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">(GAMEMODE)</span>).</li>
          <li>Use common sense. If something seems unfair or is banned on most servers, it will likely banned here.</li>
          <li>Staff are available to clarify rules.</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">General & Gamemode Rules</h2>
        
        <section className="glass-container border-l-4 border-red-500 dark:border-red-600 mb-4">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Mod Forewarning</h3>
          <p className="text-red-600 dark:text-red-300">Mods that may classify as cheats such as Freecam and player finders may be bannable and is specific to each case of use if it is.</p>
        </section>
        
        <ol className="list-decimal list-outside space-y-4 pl-10 ml-2">
          {rules.map((rule) => (
            <li key={rule.id} className="glass-light p-4">
              {rule.tag && (
                <span className="font-mono text-xs bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded mr-2">
                  {rule.tag}
                </span>
              )}
              {rule.text}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
