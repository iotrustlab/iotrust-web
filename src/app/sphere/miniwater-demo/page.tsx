import type { Metadata } from 'next';
import { MiniWaterReplay, type ReplayBundle } from './replay';
import bundle from '@/data/miniwater-preview.json';

export const metadata: Metadata = {
  title: 'MiniWater Across the Wire | A distributed SPHERE control exercise',
  description: 'Explore a modeled water-treatment process spanning two SPHERE facilities: ControlLogix raw transfer, Raspberry Pi treatment and dosing, and Raspberry Pi delivery.',
  robots: { index: false, follow: false },
};

export default function MiniWaterDemoPage() {
  return <MiniWaterReplay bundle={bundle as ReplayBundle} />;
}
