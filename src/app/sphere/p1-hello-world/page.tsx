import type { Metadata } from 'next';
import { P1Replay, type Bundle } from './replay';
import bundle from '@/data/p1-rockwell-replay.json';

export const metadata: Metadata = {
  title: 'Your First SPHERE Experiment | Raw-Water Intake Replay',
  description: 'Replay a two-second test on two real PLCs in the SPHERE ICS cluster: the controller opens a tank’s fill valve, and an attacker could abuse the same level signal.',
  robots: { index: false, follow: false },
};

export default function P1HelloWorldPage() {
  return <P1Replay bundle={bundle as Bundle} />;
}
