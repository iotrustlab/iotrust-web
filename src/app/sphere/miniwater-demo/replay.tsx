'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Droplets, FlaskConical, Monitor, Network } from 'lucide-react';
import { MiniWaterTheater } from './theater';
import type { PlaybackSpeed } from './theater';
import styles from './replay.module.css';

type Attack = 'none' | 'level_spoof' | 'dosing_tamper';
type Quality = 'good' | 'stale' | 'unknown';
type Signals = {
  plc1_fill_valve: boolean;
  plc1_transfer_pump: boolean;
  plc2_inlet_valve: boolean;
  plc2_blue_doser: boolean;
  plc2_yellow_doser: boolean;
  plc3_transfer_pump: boolean;
  plc3_outlet_valve: boolean;
};
export type Frame = {
  schema: 'sphere.miniwater.frame.v1';
  sequence: number;
  elapsed_ms: number;
  captured_at_utc: string | null;
  phase: string;
  attack: Attack;
  truth: {
    tank1_mm: number;
    raw_range_cm?: number;
    tank2_mm: number;
    tank3_mm: number;
    color_blue: number;
    color_yellow: number;
    water_quality: string;
  };
  reported: {
    tank1_mm: number;
    raw_range_cm?: number;
    tank2_mm: number;
    tank3_mm: number;
    color_blue: number;
    color_yellow: number;
  };
  commands: Signals;
  actuators: Signals;
  plc2_stage: string;
  treatment?: {
    stage: string;
    complete_command: boolean;
    proxy_quality: string;
    proxy_target_met: boolean;
  };
  data_quality: { plc1: Quality; plc2: Quality; plc3: Quality };
  source_age_ms?: { plc1?: number; plc2?: number; plc3?: number };
  source_mode?: 'synthetic_offline' | 'live_plc';
  scenario?: string;
  event?: string;
};
export type ReplayBundle = {
  schema: 'sphere.miniwater.replay.v1';
  mode: 'synthetic_offline' | 'recorded_live';
  title: string;
  model_notice?: string;
  tank_capacity_mm?: { tank1: number; tank2: number; tank3: number };
  scenario_order?: string[];
  provenance?: {
    label?: string;
    note?: string;
    recorded_at_utc?: string | null;
    source_sha256?: string | null;
  };
  samples: Frame[];
};

const chapters = [
  { label: 'Raw transfer', find: (frame: Frame) => frame.scenario === 'nominal' && frame.phase === 'transfer' },
  { label: 'PLC2 treatment', find: (frame: Frame) => frame.scenario === 'nominal' && !['FILL', 'COMPLETE'].includes(frame.treatment?.stage ?? frame.plc2_stage) },
  { label: 'Treated delivery', find: (frame: Frame) => frame.scenario === 'nominal' && frame.phase === 'delivery' },
  { label: 'False level', find: (frame: Frame) => frame.attack === 'level_spoof' && Math.abs(frame.truth.tank1_mm - frame.reported.tank1_mm) > 1 },
  { label: 'Dosing tamper', find: (frame: Frame) => frame.attack === 'dosing_tamper' },
];

const descriptions: Record<string, string> = {
  baseline: 'The three modeled tanks begin at rest. No command or attack is active.',
  raw_fill: 'PLC1 opens the raw-water inlet. The first tank rises.',
  transfer: 'PLC1 transfers raw water into PLC2’s treatment tank.',
  treatment_dosing: 'PLC2 runs its timed color dosing and settling sequence.',
  delivery: 'PLC3 moves treated water into the delivery tank.',
  level_spoof: 'The value delivered to PLC1 is held below the modeled raw-water level. The independent process view exposes the disagreement.',
  dosing_tamper: 'PLC2 receives a yellow color reading above modeled truth. Its dosing decision changes, and the independent color proxy exposes the shortfall.',
  restored: 'The attack command is cleared. The recorded state and any remaining process deviation stay visible.',
  scenario_reset: 'The software preview resets to its starting condition before the separate dosing scenario.',
  fill: 'PLC1 fills the modeled raw-water tank until its transfer threshold is reached.',
  dose_blue: 'PLC2 adds blue color proxy units to the modeled treatment tank.',
  dose_yellow: 'PLC2 adds yellow color proxy units to the modeled treatment tank.',
  settle: 'PLC2 waits before reassessing the reported color readings.',
  treatment_assess: 'PLC2 compares its reported blue and yellow readings and decides whether another timed dose is needed.',
  treatment_complete: 'PLC2 asserts its treatment-complete signal. Compare it with the independent modeled color target before PLC3 delivery.',
  stopped: 'The prepared scenario is stopped; commands and modeled actuator feedback are off.',
};

function phaseTitle(phase: string) {
  return phase.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function frameDescription(frame: Frame) {
  if (frame.event === 'reset_to_initial_conditions') return 'The software model resets to initial conditions for a separate scenario.';
  if (frame.event === 'operator_stop') return 'The prepared scenario is stopped. Inspect the restored reading and any remaining process deviation.';
  if (frame.attack === 'level_spoof') return 'PLC1 receives a lower raw-water level, so its reported range stays above the 10 cm transfer threshold even as modeled tank 1 fills.';
  if (frame.attack === 'dosing_tamper') return 'PLC2 receives a yellow color reading above modeled truth, altering its dosing decision.';
  return descriptions[frame.phase] || 'Inspect this sample against the modeled process and controller readings.';
}

function value(value: number) {
  return Number.isFinite(value) ? Math.round(value).toString() : '—';
}

function statusText(status: Quality) {
  return status === 'good' ? 'current' : status === 'stale' ? 'stale' : 'no data';
}

function Lamp({ on, label }: { on: boolean; label: string }) {
  return <span className={styles.lampRow}><span className={on ? styles.lampOn : styles.lamp} aria-hidden="true" />{label}<strong>{on ? 'ON' : 'OFF'}</strong></span>;
}

function Tank({ name, truth, reported, quality, selected, capacity, tint }: { name: string; truth: number; reported: number; quality: Quality; selected: boolean; capacity: number; tint?: string }) {
  // The synthetic plant uses 0.1 L per millimeter for every tank. These are
  // model volumes, not a calibration of the original physical MiniWater rig.
  const fill = Math.max(0, Math.min(100, truth / capacity * 100));
  const differs = Math.abs(truth - reported) > 1;
  return <div className={styles.tankCard}>
    <div className={styles.tankHeader}><strong>{name}</strong><span className={quality === 'good' ? styles.qualityGood : styles.qualityBad}>{statusText(quality)}</span></div>
    <div className={styles.tankBody}>
      <div className={styles.tankVisual} aria-hidden="true">
        <div className={styles.tankShell}>
          <div className={styles.tankWater} style={{ height: fill + '%', background: tint }} />
          <div className={styles.tankRim} />
          <div className={styles.tankGraduations}><span>100</span><span>50</span><span>0</span></div>
        </div>
      </div>
      <div className={styles.tankNumbers}>
        <small>MODELED VOLUME</small><strong>{(truth * 0.1).toFixed(1)} <em>L</em></strong>
        <span className={styles.fillPercent}>{Math.round(fill)}% full <small>of {(capacity * 0.1).toFixed(0)} L</small></span>
        <small>MODEL LEVEL</small><span className={styles.levelReading}>{truth.toFixed(1)} mm</span>
        <small>PLC READING</small><span className={`${styles.levelReading} ${differs ? styles.disagreement : ''}`}>{quality === 'good' ? reported.toFixed(1) + ' mm' : '— stale'}</span>
      </div>
    </div>
    {selected && differs && <p className={styles.tankAlert}>The controller reading differs from the process model.</p>}
  </div>;
}

function modelTint(blue: number, yellow: number) {
  const blueDose = Math.max(0, Math.min(1, blue / 24));
  const yellowDose = Math.max(0, Math.min(1, yellow / 24));
  const hue = Math.round(195 + 25 * blueDose - 110 * yellowDose);
  return `hsl(${hue} 67% 51%)`;
}

function ColorReadout({ label, modeled, reported, quality, color }: { label: string; modeled: number; reported: number; quality: Quality; color: 'blue' | 'yellow' }) {
  const percent = (number: number) => `${Math.max(0, Math.min(100, number / 32 * 100))}%`;
  const different = quality === 'good' && Math.abs(modeled - reported) > 1;
  return <div className={styles.colorReadout}>
    <div className={styles.colorReadoutHead}><strong>{label}</strong><span>{different ? 'READING DIFFERS' : 'MODEL / PLC2'}</span></div>
    <div className={styles.colorTrack} aria-hidden="true"><div className={color === 'blue' ? styles.blueFill : styles.yellowFill} style={{ width: percent(modeled) }} />{quality === 'good' && <span className={styles.reportedTick} style={{ left: percent(reported) }} />}</div>
    <div className={styles.colorNumbers}><span>Model <b>{value(modeled)}</b></span><span>PLC2 <b className={different ? styles.disagreement : ''}>{quality === 'good' ? value(reported) : '— stale'}</b></span></div>
  </div>;
}

function Trace({ frames, index, capacity }: { frames: Frame[]; index: number; capacity: number }) {
  const usable = frames.length > 1 ? frames : [frames[0], frames[0]];
  const x = (i: number) => 30 + i * 780 / (usable.length - 1);
  const y = (n: number) => 130 - Math.max(0, Math.min(capacity, n)) * 100 / capacity;
  const truthSegments: string[] = [];
  const reportedSegments: string[] = [];
  let truthSegment: string[] = [];
  let reportedSegment: string[] = [];
  usable.forEach((f, i) => {
    if (i && f.scenario !== usable[i - 1].scenario) {
      if (truthSegment.length) truthSegments.push(truthSegment.join(' '));
      if (reportedSegment.length) reportedSegments.push(reportedSegment.join(' '));
      truthSegment = [];
      reportedSegment = [];
    }
    truthSegment.push(x(i) + ',' + y(f.truth.tank1_mm));
    if (f.data_quality.plc1 === 'good') reportedSegment.push(x(i) + ',' + y(f.reported.tank1_mm));
    else if (reportedSegment.length) { reportedSegments.push(reportedSegment.join(' ')); reportedSegment = []; }
  });
  if (truthSegment.length) truthSegments.push(truthSegment.join(' '));
  if (reportedSegment.length) reportedSegments.push(reportedSegment.join(' '));
  return <div className={styles.trace}>
    <div className={styles.traceHead}><div><small>RAW WATER</small><h3>What changed during the run?</h3></div><div className={styles.traceLegend}><span className={styles.truthKey}>Modeled level</span><span className={styles.reportedKey}>PLC reading</span></div></div>
    <svg viewBox="0 0 840 155" role="img" aria-label="Raw-water modeled level and reported PLC level across the replay">
      <line x1="30" x2="810" y1="130" y2="130" className={styles.axis} />
      <line x1="30" x2="810" y1="47" y2="47" className={styles.grid} />
      {truthSegments.map((points, segmentIndex) => <polyline key={segmentIndex} points={points} className={styles.truthLine} />)}
      {reportedSegments.map((points, segmentIndex) => <polyline key={segmentIndex} points={points} className={styles.reportedLine} />)}
      <line x1={x(index)} x2={x(index)} y1="13" y2="135" className={styles.cursor} />
      <circle cx={x(index)} cy={y(frames[index].truth.tank1_mm)} r="5" className={styles.truthDot} />
      {frames[index].data_quality.plc1 === 'good' && <circle cx={x(index)} cy={y(frames[index].reported.tank1_mm)} r="5" className={styles.reportedDot} />}
      <text x="30" y="151">first sample</text><text x="810" y="151" textAnchor="end">last sample</text>
    </svg>
  </div>;
}

export function MiniWaterReplay({ bundle }: { bundle: ReplayBundle }) {
  const frames = bundle.samples;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(4);
  const [check, setCheck] = useState<string | null>(null);
  const frame = frames[index];
  const synthetic = bundle.mode === 'synthetic_offline';
  const capacities = bundle.tank_capacity_mm || { tank1: 600, tank2: 600, tank3: 600 };
  const chapterStarts = useMemo(() => chapters.map(chapter => ({
    label: chapter.label,
    start: frames.findIndex(chapter.find),
  })).filter(chapter => chapter.start >= 0), [frames]);

  useEffect(() => {
    if (!playing) return;
    if (index >= frames.length - 1 || frames[index + 1].scenario !== frames[index].scenario) {
      const stop = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(stop);
    }
    const elapsed = frames[index + 1].elapsed_ms - frames[index].elapsed_ms;
    const timer = setTimeout(() => setIndex(n => n + 1), Math.max(45, Math.min(1500, elapsed / speed)));
    return () => clearTimeout(timer);
  }, [playing, index, frames, speed]);

  if (!frames.length) return <main className={styles.page}><p>No replay samples are available.</p></main>;
  const jump = (to: number) => { setPlaying(false); setIndex(Math.max(0, Math.min(frames.length - 1, to))); };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (index === frames.length - 1 || frames[index + 1].scenario !== frames[index].scenario) {
      const first = frames.findIndex(item => item.scenario === frame.scenario);
      setIndex(Math.max(0, first));
    }
    setPlaying(true);
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = synthetic ? 'miniwater-software-preview.json' : 'miniwater-verified-replay.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  const rawMismatch = frame.data_quality.plc1 === 'good' && Math.abs(frame.truth.tank1_mm - frame.reported.tank1_mm) > 1;
  const dosingDeviation = frame.truth.water_quality === 'deviation' || frame.truth.water_quality === 'off_target';
  const treatmentStage = frame.treatment?.stage ?? frame.plc2_stage;
  const treatmentComplete = frame.treatment?.complete_command ?? treatmentStage === 'COMPLETE';
  const qualityProxy = frame.treatment?.proxy_quality ?? frame.truth.water_quality;
  const colorTargetMet = frame.treatment?.proxy_target_met ?? (frame.truth.color_blue >= 20 && Math.abs(frame.truth.color_blue - frame.truth.color_yellow) <= 5);
  const colorGap = Math.abs(frame.truth.color_blue - frame.truth.color_yellow);
  const colorTint = modelTint(frame.truth.color_blue, frame.truth.color_yellow);
  const treatmentReported = frame.data_quality.plc2 === 'good';
  const treatmentMismatch = treatmentReported && treatmentComplete && !(frame.treatment?.proxy_target_met ?? qualityProxy === 'within_target');
  const sourceLabel = synthetic ? 'Software-model preview' : 'Recorded SPHERE run';
  const captureLabel = bundle.provenance?.recorded_at_utc ? new Date(bundle.provenance.recorded_at_utc).toLocaleString() : 'No hardware capture in this preview';

  return <main className={styles.page}>
    <div className={styles.wrap}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>SPHERE ICS · MiniWater</p>
          <span className={styles.mode}>{sourceLabel}</span>
          <h1>MiniWater Across the Wire</h1>
          <p className={styles.heroLead}>One modeled water process spans two SPHERE facilities. An installed ControlLogix handles raw-water transfer at one site; two Raspberry Pis run treatment, color dosing, and delivery at the other. Follow the control decisions and the readings that cross between them.</p>
          <div className={styles.heroLinks}><a className={styles.heroLink} href="#replay">Explore the run <span aria-hidden="true">↓</span></a><a className={styles.heroLink} href="#unity-view">See the Unity 3D view <span aria-hidden="true">↓</span></a></div>
          <div className={styles.heroFacts}><span><b>Site A</b> ControlLogix</span><span><b>Site B</b> two arm64 Pis with OpenPLC</span><span><b>Public page</b> offline replay, no live controls</span></div>
        </div>
        <div className={styles.heroDiagram} role="img" aria-label="ControlLogix and a separate simulator PLC are at one SPHERE facility; the simulator PLC raw-level analog path to PLC1 is under validation. A routed network connects PLC1 to two Raspberry Pis at another facility, where PLC2 treats and PLC3 delivers modeled water">
          <div className={styles.siteColumn}><small>SPHERE FACILITY A</small><div className={styles.siteNode}><strong>ControlLogix</strong><span>PLC1 · raw source and transfer</span></div><div className={styles.simulatorRoute}><span aria-hidden="true">↑</span> RAW-LEVEL ANALOG PATH <br />UNDER VALIDATION</div><div className={styles.simulatorNode}><strong>Simulator PLC</strong><span>candidate physical signal source</span></div></div>
          <div className={styles.siteLink}><b aria-hidden="true">↔</b><span>ROUTED<br />NETWORK</span></div>
          <div className={styles.siteColumn}><small>SPHERE FACILITY B</small><strong>Two Raspberry Pis</strong><span>rpi0 · treatment and dosing</span><span>rpi1 · treated delivery</span></div>
          <p>This public replay is a synthetic offline trace from the Windows VM process model. The simulator PLC analog path is being validated for PLC1.</p>
        </div>
      </header>

      <p className={styles.notice}><strong>{sourceLabel}.</strong> {bundle.provenance?.note || bundle.model_notice || (synthetic ? 'This is not a hardware capture.' : 'Values come from a verified live-session extract.')} The colored-water metric is a training proxy, not a claim about real water safety.</p>

      <section className={styles.section} id="motivation">
        <div className={styles.sectionHeading}><span>1</span><div><small>WHY DISTRIBUTE IT?</small><h2>From a tabletop process to a routed control loop</h2></div></div>
        <p className={styles.sectionLead}>The original MiniWater testbed made tanks, tubing, pumps, and dye visible in one place. The SPHERE adaptation keeps its raw-water → treatment → delivery sequence while separating control stages across facilities. That lets a demonstration expose network boundaries, data age, signal ownership, and the difference between a controller’s reading and modeled process state. The historical images below show the original setup; the replay on this page is a software preview.</p>
        <div className={styles.historyGrid}>
          <figure className={styles.historyPhoto}><Image src="/images/demos/miniwater/original-testbed.jpg" alt="Historical MiniWater tabletop rig with clear tanks, tubing, pumps, Raspberry Pi boards, and cups of blue and red coloring" width={4056} height={2258} sizes="(max-width: 760px) 100vw, 58vw" /><figcaption><strong>Original MiniWater testbed</strong><span>Historical physical rig; the SPHERE demo keeps its three-stage logic but models tanks and devices in software.</span></figcaption></figure>
          <figure className={styles.historySchematic}><Image src="/images/demos/miniwater/original-schematic.png" alt="Original MiniWater three-stage schematic with raw tank, color treatment and dosing, treated tank, and PLCs 1 through 3" width={504} height={344} sizes="(max-width: 760px) 100vw, 38vw" /><figcaption><strong>Original three-stage design</strong><span>Raw source, treatment, and delivery roles carried into this adaptation. <a href="https://github.com/iotrustlab/miniwatertreatment/tree/CompactLogix-Integration/Diagrams">View the source diagram</a>.</span></figcaption></figure>
        </div>
      </section>

      <section className={styles.section} id="system">
        <div className={styles.sectionHeading}><span>2</span><div><small>MEET THE SYSTEM</small><h2>Control stages across two facilities</h2></div></div>
        <p className={styles.sectionLead}>The installed Rockwell ControlLogix runs the raw-water stage at one facility. At another, two arm64 Raspberry Pis running OpenPLC handle treatment and delivery. In tank 2, PLC2 fills, assesses reported color, doses blue or yellow, settles, and declares treatment complete. A software process model currently supplies sensor readings and consumes pump, valve, and doser commands.</p>
        <div className={styles.ruleGrid}>
          <div><strong>ControlLogix · PLC1</strong><p>Fills raw-water tank 1 and commands transfer toward treatment.</p></div>
          <div><strong>OpenPLC · PLC2</strong><p>Assesses tank 2, times blue or yellow dosing and settling, then raises treatment complete.</p></div>
          <div><strong>OpenPLC · PLC3</strong><p>Moves treated water into receiving tank 3 only after PLC2 reports treatment complete and its underflow gate permits it.</p></div>
        </div>
        <div className={styles.facilityMap} aria-label="Hardware and network locations in the distributed MiniWater demonstration">
          <figure className={styles.facilityCard}>
            <Image src="/images/demos/p1/rockwell-rack-complete.png" alt="Rockwell ControlLogix rack photographed during an earlier SPHERE P1 hardware demonstration" width={1600} height={1200} sizes="(max-width: 760px) 100vw, 35vw" />
            <figcaption><small>SPHERE FACILITY A</small><strong>ControlLogix · PLC1</strong><span>The installed 1756-L72 controls raw-water transfer. This is an earlier photograph of the P1 rack, not a new MiniWater capture.</span></figcaption>
          </figure>
          <div className={styles.facilityNetwork} aria-label="Control and feedback route between facilities">
            <div className={styles.networkNode}><Monitor aria-hidden="true" size={22} /><span><strong>FactoryTalk HMI</strong><small>Start, stop, and operator readings</small></span></div>
            <div className={styles.networkLink}><ArrowRight aria-hidden="true" size={21} /><span>CIP · PLC1 commands and feedback</span></div>
            <div className={styles.networkNode}><Network aria-hidden="true" size={22} /><span><strong>Windows VM bridge + model</strong><small>Advances tanks and supplies simulated sensors</small></span></div>
            <div className={styles.networkLink}><ArrowRight aria-hidden="true" size={21} /><span>Routed SPHERE network · Modbus/TCP</span></div>
            <p>Control data crosses sites; the water remains simulated.</p>
          </div>
          <div className={styles.facilityGroup}>
            <div className={styles.facilityGroupHead}><small>SECOND SPHERE FACILITY</small><strong>Two separate OpenPLC nodes</strong><span>Both Pis are physically remote from the ControlLogix rack.</span></div>
            <div className={styles.piFlow}>
              <figure className={styles.piCard}>
                <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Raspberry_Pi_4_Model_B_-_Top.jpg/960px-Raspberry_Pi_4_Model_B_-_Top.jpg" alt="Representative Raspberry Pi 4 board viewed from above, illustrating rpi0" loading="lazy" />
                <figcaption><FlaskConical aria-hidden="true" size={19} /><strong>rpi0 · PLC2</strong><span>Tank 2 treatment and color dosing</span></figcaption>
              </figure>
              <div className={styles.piHandoff}><ArrowRight aria-hidden="true" size={27} /><strong>Stage handoff</strong><span>Treatment complete + modeled tank state pass through the VM bridge.</span></div>
              <figure className={styles.piCard}>
                <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg/960px-Raspberry_Pi_4_Model_B_-_Side.jpg" alt="Representative Raspberry Pi 4 board viewed from the side, illustrating the separate rpi1 node" loading="lazy" />
                <figcaption><Droplets aria-hidden="true" size={19} /><strong>rpi1 · PLC3</strong><span>Tank 3 treated-water delivery</span></figcaption>
              </figure>
            </div>
          </div>
        </div>
        <p className={styles.photoCredit}>Representative Raspberry Pi 4 photographs (not the installed boards): <a href="https://commons.wikimedia.org/wiki/File:Raspberry_Pi_4_Model_B_-_Top.jpg">top view</a> and <a href="https://commons.wikimedia.org/wiki/File:Raspberry_Pi_4_Model_B_-_Side.jpg">side view</a> by Laserlicht / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Images are displayed without alteration.</p>
        <p className={styles.processLimit}>Tank 1 follows the RoviSys P1 raw source. Tank 2 uses the P3 ultrafiltration feed-tank level as a display analogue for PLC2’s software treatment tank. Tank 3 is the new MiniWater delivery tank signal. The installed P3 filtration equipment is outside this demo loop.</p>
        <p className={styles.processLimit}>In this software-only preview, tank 2 fills to about 12 L (80%) before dosing. Tank 3 holds the treated water delivered into it, reaching about 9.75 L (65%) in the nominal replay. These model volumes are not physical measurements or the current live controller profile.</p>
        <div className={styles.signalPath} aria-label="MiniWater signal-source status">
          <div className={styles.signalCurrent}><small>CURRENT DEMO MODEL</small><strong>Windows software process model</strong><p>The VM bridge can take commands from the ControlLogix and Pis, advance the three modeled tanks, and return simulated sensor values. This public replay is synthetic offline output from the same model, not a capture of live controller readings.</p></div>
          <div className={styles.signalPending}><small>HARDWARE PATH UNDER VALIDATION</small><strong>Simulator PLC → ControlLogix raw-level input</strong><p>The separate simulator controller is being checked as a source for PLC1’s raw-water level input. It is not yet part of this replay or the verified MiniWater loop; the Pi stages remain software modeled.</p></div>
        </div>
        <div className={styles.treatmentSequence} aria-label="PLC2 treatment sequence"><span>Tank 2 fills</span><b>→</b><span>Assess reported color</span><b>→</b><span>Timed blue or yellow dose</span><b>→</b><span>Settle and reassess</span><b>→</b><span>Complete handoff</span></div>
        <p className={styles.processLimit}>This treatment is MiniWater’s color-proxy control exercise. It does not model filtration or establish real water safety.</p>
        <div className={styles.useCaseLinks}><div><small>STRETCH DIRECTION</small><h3>Swap the process story</h3><p>The controller, model, operator view, and replay can be packaged as a repeatable demo pattern for another use case. MiniWater is the working scene; changing use cases still requires its own tag map, model, and validation.</p></div><nav aria-label="Related demonstrations"><a href="/sphere/p1-hello-world/">P1 hardware replay <span aria-hidden="true">↗</span></a><a href="/sphere/hello-world-3d/">CTF1 3D testbed <span aria-hidden="true">↗</span></a></nav></div>
      </section>

      <section className={styles.section} id="replay">
        <div className={styles.sectionHeading}><span>3</span><div><small>EXPLORE THE REPLAY</small><h2>Watch the process and the readings</h2></div></div>
        <p className={styles.sectionLead}>Start in the theater: choose a prepared run, move among the four camera views, and inspect the operator readings against the modeled floor. The detailed 2D trace below uses the same playback clock. These controls replay a file; they do not connect to live equipment.</p>
        <MiniWaterTheater frames={frames} index={index} playing={playing} speed={speed} onSpeedChange={setSpeed} onJump={jump} onTogglePlay={togglePlay} />
        <div className={styles.detailLead} id="detail-replay"><small>DETAILED 2D TRACE · SAME CLOCK</small><h3>Inspect each signal</h3><p>Follow the tanks, treatment color, commands, modeled feedback, and data-quality labels at each sample. The theater and this trace always show the same replay position.</p></div>
        <div className={styles.player}>
          <div className={styles.playerTop}><div><span className={frame.attack === 'none' ? styles.phaseNormal : styles.phaseAttack}>{frame.attack === 'none' ? 'NORMAL PROCESS' : frame.attack.replaceAll('_', ' ').toUpperCase()}</span><h3>{phaseTitle(frame.phase)}</h3><p>{frameDescription(frame)}</p></div><div className={styles.sampleNumber}>SAMPLE <strong>{index + 1} / {frames.length}</strong><span>T+{(frame.elapsed_ms / 1000).toFixed(1)} s</span>{frame.scenario && <span>{phaseTitle(frame.scenario)} scenario</span>}</div></div>
          <div className={styles.playerControls}><button type="button" className={styles.primaryButton} onClick={togglePlay}>{playing ? 'Pause' : 'Play'} replay</button><button type="button" onClick={() => jump(index - 1)} disabled={index === 0}>← Previous</button><button type="button" onClick={() => jump(index + 1)} disabled={index === frames.length - 1}>Next →</button></div>
          <label className={styles.sliderLabel} htmlFor="miniwater-frame-slider">Move to any sample</label>
          <input id="miniwater-frame-slider" className={styles.slider} type="range" min="0" max={frames.length - 1} value={index} onChange={event => jump(Number(event.target.value))} />
          <div className={styles.chapterButtons}>{chapterStarts.map(c => <button key={c.label} type="button" className={index === c.start ? styles.chapterActive : ''} onClick={() => jump(c.start)}>{c.label}</button>)}</div>
          <div className={styles.tanks}>
            <Tank name="Tank 1 · Raw water" truth={frame.truth.tank1_mm} reported={frame.reported.tank1_mm} quality={frame.data_quality.plc1} selected={rawMismatch} capacity={capacities.tank1} />
            <Tank name="Tank 2 · Treatment" truth={frame.truth.tank2_mm} reported={frame.reported.tank2_mm} quality={frame.data_quality.plc2} selected={false} capacity={capacities.tank2} tint={colorTint} />
            <Tank name="Tank 3 · Receiving" truth={frame.truth.tank3_mm} reported={frame.reported.tank3_mm} quality={frame.data_quality.plc3} selected={false} capacity={capacities.tank3} tint={colorTint} />
          </div>
          <div className={treatmentMismatch ? styles.treatmentAlert : styles.treatmentCard}>
            <div><small>PLC2 · TREATMENT TANK</small><h4>{phaseTitle(treatmentStage)}</h4><p>PLC2 assesses reported blue and yellow readings, applies a timed dose when needed, waits eight seconds to settle, then reassesses before its complete handoff.</p></div>
            <div className={styles.treatmentReadbacks}><span>PLC2 complete signal <strong>{treatmentReported ? treatmentComplete ? 'ON' : 'OFF' : '— stale'}</strong></span><span>Independent model target <strong>{qualityProxy.replaceAll('_', ' ')}</strong></span>{treatmentMismatch && <em>Completion disagrees with modeled color target.</em>}</div>
          </div>
          <div className={styles.colorPanel} aria-label="Tank 2 modeled color and PLC2 reported color">
            <div className={styles.colorPanelIntro}><div><small>INSIDE TANK 2</small><h4>See the color decision</h4><p>The tank tint follows the independent model. The black ticks mark what PLC2 was told. The target requires blue at least 20 units and the blue/yellow difference at most 5 units.</p></div><div className={styles.colorSample} style={{ background: colorTint }} aria-label={`Illustrative modeled tint; blue ${value(frame.truth.color_blue)}, yellow ${value(frame.truth.color_yellow)}`} role="img" /></div>
            <div className={styles.colorReadouts}><ColorReadout label="Blue proxy" modeled={frame.truth.color_blue} reported={frame.reported.color_blue} quality={frame.data_quality.plc2} color="blue" /><ColorReadout label="Yellow proxy" modeled={frame.truth.color_yellow} reported={frame.reported.color_yellow} quality={frame.data_quality.plc2} color="yellow" /></div>
            <div className={colorTargetMet ? styles.colorOutcomeGood : styles.colorOutcomeBad}><span>Modeled balance <strong>{value(colorGap)} units apart</strong></span><span>Independent target <strong>{colorTargetMet ? 'MET' : 'NOT MET'}</strong></span><span>PLC2 complete <strong>{treatmentReported ? treatmentComplete ? 'ON' : 'OFF' : '— stale'}</strong></span></div>
            {treatmentMismatch && <p className={styles.colorWarning}>PLC2 declared treatment complete while the modeled color target was missed. The delivery handoff can still follow that signal.</p>}
          </div>
          <div className={styles.lowerGrid}>
            <div className={styles.outputCard}><small>CONTROL COMMANDS</small><h4>What the PLCs requested</h4><Lamp label="PLC1 pump · command" on={frame.commands.plc1_transfer_pump} /><Lamp label="PLC1 pump · modeled feedback" on={frame.actuators.plc1_transfer_pump} /><Lamp label="PLC2 yellow doser · command" on={frame.commands.plc2_yellow_doser} /><Lamp label="PLC2 yellow doser · modeled feedback" on={frame.actuators.plc2_yellow_doser} /><Lamp label="PLC3 pump · command" on={frame.commands.plc3_transfer_pump} /><Lamp label="PLC3 pump · modeled feedback" on={frame.actuators.plc3_transfer_pump} /></div>
            <div className={styles.outputCard}><small>MODELED PROCESS</small><h4>What the software model shows</h4><p>Raw range · model <strong>{frame.truth.raw_range_cm === undefined ? '—' : value(frame.truth.raw_range_cm) + ' cm'}</strong></p><p>Raw range · PLC1 <strong className={frame.data_quality.plc1 === 'good' && frame.truth.raw_range_cm !== frame.reported.raw_range_cm ? styles.deviation : ''}>{frame.data_quality.plc1 === 'good' && frame.reported.raw_range_cm !== undefined ? value(frame.reported.raw_range_cm) + ' cm' : '—'}</strong></p><p>Blue proxy · model <strong>{value(frame.truth.color_blue)}</strong></p><p>Blue reading · PLC2 <strong>{frame.data_quality.plc2 === 'good' ? value(frame.reported.color_blue) : '—'}</strong></p><p>Yellow proxy · model <strong>{value(frame.truth.color_yellow)}</strong></p><p>Yellow reading · PLC2 <strong className={frame.data_quality.plc2 === 'good' && Math.abs(frame.truth.color_yellow - frame.reported.color_yellow) > 1 ? styles.deviation : ''}>{frame.data_quality.plc2 === 'good' ? value(frame.reported.color_yellow) : '—'}</strong></p><p>Quality proxy <strong className={dosingDeviation ? styles.deviation : ''}>{frame.truth.water_quality.replaceAll('_', ' ')}</strong></p></div>
          </div>
          <Trace frames={frames} index={index} capacity={capacities.tank1} />
          <p className={styles.playerFoot}>Sample time and source class matter. “Commanded” does not prove physical movement; the process view here is a software model.</p>
        </div>
      </section>

      <section className={styles.section} id="defend">
        <div className={styles.sectionHeading}><span>4</span><div><small>RED TEAM / BLUE TEAM</small><h2>Choose what you would check</h2></div></div>
        <p className={styles.sectionLead}>The 2024 classroom CTF paired malicious code or opportunistic commands with defender code vetting and PLC-value monitoring. This poster version uses two bounded scenarios: a false PLC1 level and a manipulated PLC2 dosing decision. The public page presents their trace only.</p>
        <div className={styles.decisionGrid}>
          <div className={styles.decisionCard}><span className={styles.redPill}>ATTACK A</span><h3>False raw-water level</h3><p>PLC1 receives a level below modeled truth. Its reported range stays above the 10 cm handoff threshold, holding off transfer as tank 1 fills.</p><strong>Defender cue</strong><p>Compare reported and modeled level and range, plus the transfer command, over time.</p></div>
          <div className={styles.decisionCard}><span className={styles.redPill}>ATTACK B</span><h3>False color, changed treatment</h3><p>PLC2 receives a yellow color reading higher than modeled truth. It can skip needed yellow dosing and raise treatment complete while the model remains off target; PLC3 then sees the handoff.</p><strong>Defender cue</strong><p>Compare the reported and modeled yellow values, the doser command, PLC2 complete signal, and delivery handoff.</p></div>
        </div>
        <div className={styles.check}><h3>Which observation gives the defender independent evidence?</h3><div>{['Read only the same PLC1 level again', 'Compare PLC1 level and range with modeled values', 'Assume a pump command proves movement'].map(choice => <button key={choice} type="button" className={check === choice ? styles.selectedChoice : ''} onClick={() => setCheck(choice)}>{choice}</button>)}</div>{check && <p role="status" className={check.startsWith('Compare') ? styles.correct : styles.incorrect}>{check.startsWith('Compare') ? 'Yes. Independent modeled level and range can contradict a forged controller reading.' : 'That observation shares the compromised value or confuses a command with feedback.'}</p>}</div>
      </section>

      <section className={styles.section} id="source">
        <div className={styles.sectionHeading}><span>5</span><div><small>TAKE THE RECORD</small><h2>Know what this file represents</h2></div></div>
        <p className={styles.sectionLead}>Download the exact bundle used on this page. A future hardware capture can replace this preview only after its PLC and Pi sources, timestamps, tag mapping, and restoration have been verified.</p>
        <div className={styles.evidenceCard}><div><strong>{bundle.title}</strong><span>{captureLabel}</span><span>{frames.length} samples · {bundle.mode.replaceAll('_', ' ')}</span>{bundle.provenance?.source_sha256 && <code>SHA-256 {bundle.provenance.source_sha256}</code>}</div><button type="button" className={styles.primaryButton} onClick={download}>Download JSON</button></div>
        <p className={styles.next}>At the poster, a supervised visitor can choose a prepared action on the private presenter station. The <a href="/sphere/p1-hello-world/">P1 hardware replay</a> and <a href="/sphere/hello-world-3d/">CTF1 3D walkthrough</a> show related SPHERE demonstrations.</p>
      </section>
    </div>
  </main>;
}
