// src/app/staff/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Staff',
};

type StaffMember = {
    name: string;
    position: string;
    imageUrl: string;
};

const staffMembers: StaffMember[] = [
    {
        name: 'Cartrigger',
        position: 'Owner',
        imageUrl: 'https://minotar.net/helm/cartrigger/128.png',
    },
    {
        name: 'CADIndie',
        position: 'Admin, Java Developer',
        imageUrl: 'https://minotar.net/helm/CADIndie/128.png',
    },
    {
        name: 'crystall1nedev',
        position: 'Admin',
        imageUrl: 'https://minotar.net/helm/crystall1nedev/128.png',
    },
    {
        name: 'TheJudge156',
        position: 'Admin, Java Helper',
        imageUrl: 'https://minotar.net/helm/TheJudge156/128.png',
    },
    {
        name: 'ThatStella7922',
        position: 'Senior Moderator, Backend Helper',
        imageUrl: 'https://minotar.net/helm/ThatStella7922/128.png',
    },
    {
        name: 'RealityXP',
        position: 'Senior Moderator, Designer',
        imageUrl: 'https://minotar.net/helm/realityxp/128.png',
    },
        {
        name: 'NanoShadowPLZ',
        position: 'Senior Moderator, Head Builder, Designer',
        imageUrl: 'https://minotar.net/helm/nanoshadowplz/128.png',
    },
        {
        name: 'FilleDanseuse',
        position: 'Senior Moderator, Builder, Designer',
        imageUrl: 'https://minotar.net/helm/filledanseuse/128.png',
    },
            {
        name: 'Hi_oooooooo',
        position: 'Builder',
        imageUrl: 'https://minotar.net/helm/hi_oooooooo/128.png',
    },
            {
        name: 'TypicalZedF',
        position: 'Builder, 3D Modeler',
        imageUrl: 'https://minotar.net/helm/typicalzedf/128.png',
    },
            {
        name: 'F2Automaton',
        position: 'Builder, Redstoner',
        imageUrl: 'https://minotar.net/helm/f2automaton/128.png',
    },
            {
        name: 'LKbonney',
        position: 'Builder',
        imageUrl: 'https://minotar.net/helm/lkbonney/128.png',
    },
            {
        name: 'x_Jack',
        position: 'Builder Helper',
        imageUrl: 'https://minotar.net/helm/x_jack/128.png',
    },
            {
        name: 'OwenXlan',
        position: 'Builder',
        imageUrl: 'https://minotar.net/helm/owenxlan/128.png',
    },
                    {
        name: 'AccidentalTAY',
        position: 'Moderator, Eco Helper',
        imageUrl: 'https://minotar.net/helm/accidentaltay/128.png',
    },
                {
        name: 'Dev1ss0',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/dev1ss0/128.png',
    },
                {
        name: 'Kridengaming',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/kridengaming/128.png',
    },
                {
        name: 'ItAnthon',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/itanthon/128.png',
    },
                {
        name: 'Wha1es',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/wha1es/128.png',
    },
                    {
        name: 'Yumitoo',
        position: 'Moderator',
        imageUrl: 'https://minotar.net/helm/yumitoo/128.png',
    },
            {
        name: 'RossLight',
        position: 'Youtube Helper',
        imageUrl: 'https://minotar.net/helm/rosslight1/128.png',
    },
            {
        name: 'AlphaMode',
        position: 'Helper',
        imageUrl: 'https://minotar.net/helm/alphamode/128.png',
    },
];

export default function StaffPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Our Staff Team</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {staffMembers.map((member) => (
                    <div key={member.name} className="bg-gray-800 rounded-lg p-6 text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
                        <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-bold">{member.name}</h2>
                        <p className="text-gray-400">{member.position}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
