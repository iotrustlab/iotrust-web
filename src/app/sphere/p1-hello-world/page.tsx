import type { Metadata } from 'next';
import { P1Replay, type Bundle } from './replay';
import bundle from '@/data/p1-rockwell-replay.json';

export const metadata: Metadata = {
  title: 'SPHERE ICS hello world: Rockwell P1 replay',
  description: 'A self-guided replay of 42 recorded samples from a bounded SPHERE Rockwell controller and simulator PLC test.',
  robots: { index: false, follow: false },
};

export default function P1HelloWorldPage() {
  return <P1Replay bundle={bundle as Bundle} />;
}
