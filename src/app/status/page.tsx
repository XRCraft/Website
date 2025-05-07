import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Status | XRCraftMC',
  description: 'Check the current status of the XRCraftMC Minecraft server, including player count and version.',
};

import ServerStatusClient from './client';
export default function ServerStatusPage() {
  return <ServerStatusClient />;
}