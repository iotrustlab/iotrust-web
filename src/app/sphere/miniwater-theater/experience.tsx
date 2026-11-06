'use client';

import { useEffect, useState } from 'react';
import { MiniWaterTheater } from '../miniwater-demo/theater';
import type { Frame } from '../miniwater-demo/replay';
import styles from './experience.module.css';

export function TheaterExperience({ frames }: { frames: Frame[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 4 | 10>(4);

  useEffect(() => {
    if (!playing) return;
    const next = index + 1;
    if (next >= frames.length || frames[next].scenario !== frames[index].scenario) {
      const stop = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(stop);
    }
    const elapsed = frames[next].elapsed_ms - frames[index].elapsed_ms;
    const timer = window.setTimeout(() => setIndex(next), Math.max(45, Math.min(1500, elapsed / speed)));
    return () => window.clearTimeout(timer);
  }, [frames, index, playing, speed]);

  if (!frames.length) return <main className={styles.page}>No replay samples are available.</main>;

  const jump = (to: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(frames.length - 1, to)));
  };
  const togglePlay = () => {
    if (!playing && (index === frames.length - 1 || frames[index + 1].scenario !== frames[index].scenario)) {
      const start = frames.findIndex(frame => frame.scenario === frames[index].scenario);
      setIndex(start >= 0 ? start : 0);
    }
    setPlaying(!playing);
  };

  return <main className={styles.page}>
    <header className={styles.hero}>
      <a href="/sphere/miniwater-demo/">← MiniWater walkthrough</a>
      <p>SPHERE ICS · PUBLIC SOFTWARE REPLAY</p>
      <h1>MiniWater plant theater</h1>
      <span>Explore the two-site, three-controller process. One replay clock drives the modeled Unity floor and the operator readings.</span>
    </header>
    <section className={styles.stage} aria-label="Interactive MiniWater plant theater">
      <MiniWaterTheater standalone frames={frames} index={index} playing={playing} speed={speed} onSpeedChange={setSpeed} onJump={jump} onTogglePlay={togglePlay} />
    </section>
    <footer className={styles.foot}>This synthetic offline replay has no live PLC connection or process controls. Color is an illustrative treatment proxy, not a water safety measurement.</footer>
  </main>;
}
