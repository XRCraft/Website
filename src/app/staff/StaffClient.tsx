'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type StaffMember = {
    name: string;
    position: string;
    imageUrl: string;
    role: 'Owner' | 'Admin' | 'Senior Moderator' | 'Moderator' | 'Builder' | 'Helper' | 'Other';
};

const staffMembers: StaffMember[] = [
    {
        name: 'Cartrigger',
        position: 'Owner',
        imageUrl: 'https://minotar.net/helm/cartrigger/128.png',
        role: 'Owner'
    },
    {
        name: 'CADIndie',
        position: 'Admin, Java Developer',
        imageUrl: 'https://minotar.net/helm/CADIndie/128.png',
        role: 'Admin'
    },
    {
        name: 'crystall1nedev',
        position: 'Admin',
        imageUrl: 'https://minotar.net/helm/crystall1nedev/128.png',
        role: 'Admin'
    },
    {
        name: 'TheJudge156',
        position: 'Admin, Java Helper',
        imageUrl: 'https://minotar.net/helm/TheJudge156/128.png',
        role: 'Admin'
    },
    {
        name: 'ThatStella7922',
        position: 'Senior Moderator, Backend Helper',
        imageUrl: 'https://minotar.net/helm/ThatStella7922/128.png',
        role: 'Senior Moderator'
    },
    {
        name: 'RealityXP',
        position: 'Senior Moderator, Designer',
        imageUrl: 'https://minotar.net/helm/realityxp/128.png',
        role: 'Senior Moderator'
    },
    {
        name: 'NanoShadowPLZ',
        position: 'Senior Moderator, Head Builder, Designer',
        imageUrl: 'https://minotar.net/helm/nanoshadowplz/128.png',
        role: 'Senior Moderator'
    },
    {
        name: 'FilleDanseuse',
        position: 'Senior Moderator, Builder, Designer',
        imageUrl: 'https://minotar.net/helm/filledanseuse/128.png',
        role: 'Senior Moderator'
    },
    {
        name: 'Hi_oooooooo',
        position: 'Builder',
        imageUrl: 'https://minotar.net/helm/hi_oooooooo/128.png',
        role: 'Builder'
    },
    {
        name: 'TypicalZedF',
        position: 'Builder, 3D Modeler',
        imageUrl: 'https://minotar.net/helm/typicalzedf/128.png',
        role: 'Builder'
    },
    {
        name: 'F2Automaton',
        position: 'Builder, Redstoner',
        imageUrl: 'https://minotar.net/helm/f2automaton/128.png',
        role: 'Builder'
    },
    {
        name: 'LKbonney',
        position: 'Builder',
        imageUrl: 'https://minotar.net/helm/lkbonney/128.png',
        role: 'Builder'
    },
    {
        name: 'x_Jack',
        position: 'Builder Helper',
        imageUrl: 'https://minotar.net/helm/x_jack/128.png',
        role: 'Builder'
    },
    {
        name: 'OwenXlan',
        position: 'Builder',
        imageUrl: 'https://minotar.net/helm/owenxlan/128.png',
        role: 'Builder'
    },
    {
        name: 'AccidentalTAY',
        position: 'Moderator, Eco Helper',
        imageUrl: 'https://minotar.net/helm/accidentaltay/128.png',
        role: 'Moderator'
    },
    {
        name: 'Dev1ss0',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/dev1ss0/128.png',
        role: 'Moderator'
    },
    {
        name: 'Kridengaming',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/kridengaming/128.png',
        role: 'Moderator'
    },
    {
        name: 'ItAnthon',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/itanthon/128.png',
        role: 'Moderator'
    },
    {
        name: 'Yumitoo',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/yumitoo/128.png',
        role: 'Moderator'
    },
    {
        name: 'RossLight',
        position: 'Youtube Helper',
        imageUrl: 'https://minotar.net/helm/rosslight1/128.png',
        role: 'Helper'
    },
    {
        name: 'AlphaMode',
        position: 'Helper',
        imageUrl: 'https://minotar.net/helm/alphamode/128.png',
        role: 'Helper'
    },
];

const roleColors = {
    'Owner': 'text-red-500 border-red-500/50 bg-red-500/10',
    'Admin': 'text-red-400 border-red-400/50 bg-red-400/10',
    'Senior Moderator': 'text-orange-400 border-orange-400/50 bg-orange-400/10',
    'Moderator': 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10',
    'Builder': 'text-blue-400 border-blue-400/50 bg-blue-400/10',
    'Helper': 'text-green-400 border-green-400/50 bg-green-400/10',
    'Other': 'text-gray-400 border-gray-400/50 bg-gray-400/10',
};

export default function StaffClient() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Group staff by role for better organization
    const groupedStaff = {
        'Leadership': staffMembers.filter(m => ['Owner', 'Admin'].includes(m.role)),
        'Senior Staff': staffMembers.filter(m => m.role === 'Senior Moderator'),
        'Moderation': staffMembers.filter(m => m.role === 'Moderator'),
        'Builders': staffMembers.filter(m => m.role === 'Builder'),
        'Helpers': staffMembers.filter(m => m.role === 'Helper' || m.role === 'Other'),
    };

    return (
        <div className="space-y-12 py-8">
            <div className={`text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-4xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6 pixel-font">
                    Our Staff Team
                </h1>
                <p className="text-xl text-gray-800 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Meet the dedicated team behind XRCraftMC who work hard to keep the server running smoothly.
                </p>
            </div>

            {Object.entries(groupedStaff).map(([groupName, members], groupIndex) => (
                members.length > 0 && (
                    <section 
                        key={groupName}
                        className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${groupIndex * 150}ms` }}
                    >
                        <div className="flex items-center mb-8">
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50"></div>
                            <h2 className="text-2xl md:text-3xl font-bold px-6 pixel-font text-white/90">{groupName}</h2>
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                            {members.map((member) => (
                                <div 
                                    key={member.name} 
                                    className="glass-container group hover:scale-105 transition-all duration-300 flex flex-col items-center text-center p-6 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="relative mb-4">
                                        <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${roleColors[member.role].split(' ')[2]}`}></div>
                                        <Image
                                            src={member.imageUrl}
                                            alt={member.name}
                                            width={96}
                                            height={96}
                                            className="w-24 h-24 rounded-lg pixel-border relative z-10 shadow-lg"
                                        />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold mb-1 pixel-font text-white">{member.name}</h3>
                                    
                                    <div className={`text-sm font-medium px-3 py-1 rounded-full border ${roleColors[member.role]} inline-block mt-2`}>
                                        {member.position}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            ))}
        </div>
    );
}
