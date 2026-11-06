import type { Metadata } from 'next';
import { MiniWaterReplay, type ReplayBundle } from './replay';
import bundle from '@/data/miniwater-preview.json';

export const metadata: Metadata = {
  title: 'MiniWater on SPHERE | Three-tank treatment replay',
  description: 'Explore a synthetic three-tank process preview with ControlLogix, two Raspberry Pi OpenPLC nodes, color-based dosing, and a receiving tank that fills.',
  robots: { index: false, follow: false },
};

export default function MiniWaterDemoPage() {
  return <MiniWaterReplay bundle={bundle as ReplayBundle} />;
}
