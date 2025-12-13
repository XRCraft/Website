'use client';

import { 
  CubeIcon, 
  UserGroupIcon, 
  DevicePhoneMobileIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'VR Optimized',
    description: 'Experience Minecraft like never before. Fully optimized for Virtual Reality gameplay with immersive interactions.',
    icon: CubeIcon,
  },
  {
    name: 'QuestCraft Ready',
    description: 'Play directly from your Meta Quest headset using QuestCraft. No PC required for the full experience.',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Friendly Community',
    description: 'Join a welcoming community of VR enthusiasts. Make friends, build together, and explore the world.',
    icon: UserGroupIcon,
  },
];

export default function Features() {
  return (
    <div className="py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-mcgold pixel-font">Why Choose XRCraft?</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl pixel-font">
            Immersive VR Minecraft
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We provide the best possible Minecraft experience for VR players, with optimizations and features specifically designed for headset gameplay.
          </p>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="flex flex-col items-start bg-black/40 backdrop-blur-sm p-6 rounded-lg pixel-border border-white/10 hover:bg-black/60 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/20 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white pixel-font mb-2">
                  {feature.name}
                </dt>
                <dd className="text-base leading-7 text-gray-400 flex-auto">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
