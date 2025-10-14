'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SecretGameWrapper = dynamic(() => import('./SecretGameWrapper'), { ssr: false });

export default function ClientSecretGame() {
  return <SecretGameWrapper />;
}