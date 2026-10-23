import type { Metadata } from 'next';
import { P1Replay, type Bundle } from './replay';
import bundle from '@/data/p1-rockwell-replay.json';

export const metadata: Metadata = {
  title: 'Your First SPHERE Experiment | Raw-Water Intake Replay',
  description: 'Explore a recorded raw-water intake test on two physical PLCs. Follow the reported level, controller response, and evidence across 42 samples.',
  robots: { index: false, follow: false },
};

export default function P1HelloWorldPage() {
  return <P1Replay bundle={bundle as Bundle} />;
}
