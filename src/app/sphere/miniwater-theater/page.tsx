import type { Metadata } from 'next';
import bundle from '@/data/miniwater-preview.json';
import type { ReplayBundle } from '../miniwater-demo/replay';
import { TheaterExperience } from './experience';

export const metadata: Metadata = {
  title: 'MiniWater plant theater',
  description: 'Explore the MiniWater three-tank software replay across a ControlLogix and two Raspberry Pi OpenPLC stages in an interactive 3D plant theater.',
  robots: { index: false, follow: false },
};

export default function MiniWaterTheaterPage() {
  return <TheaterExperience frames={(bundle as ReplayBundle).samples} />;
}
