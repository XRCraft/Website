import { Metadata } from 'next';
import StaffClient from './StaffClient';

export const metadata: Metadata = {
    title: 'Staff',
    description: 'Meet the dedicated staff team behind XRCraftMC.',
};

export default function StaffPage() {
    return <StaffClient />;
}

