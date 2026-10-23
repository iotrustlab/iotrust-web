'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './replay.module.css';

type Phase = 'baseline' | 'level_only' | 'start' | 'restored';
type Sample = {
  sample: number;
  elapsedMs: number;
  phase: Phase;
  levelMm: number;
  controllerState: 'IDLE' | 'START' | 'RUNNING';
  scriptedStart: boolean;
  valveCommand: boolean;
  controllerOutputBit0: boolean;
  simulatorInputBit0: boolean;
};
export type Bundle = {
  title: string;
  sourceSha256: string;
  observedOn: string;
  captureKind: string;
  sampleCount: number;
  phaseCounts: Record<Phase, number>;
  fields: string;
  samples: Sample[];
};

const phaseText: Record<Phase, { label: string; explanation: string; prompt: string }> = {
  baseline: {
    label: '1 · Baseline',
    explanation: 'The controller reports P1 near 200 mm. It is idle, and the valve route is clear.',
    prompt: 'Notice that both digital indicators are 0 before the test.',
  },
  level_only: {
    label: '2 · Level stimulus',
    explanation: 'A script changes the level reported to the controller from about 200 to 315 mm across these samples. The simulator tank model remains stopped.',
    prompt: 'Scrub toward the end of this phase: the level rises before the valve turns on.',
  },
  start: {
    label: '3 · Start pulse',
    explanation: 'A brief scripted Start input puts the controller in RUNNING. Its valve command appears in the simulator PLC input image.',
    prompt: 'Compare the controller output bit with the simulator input bit.',
  },
  restored: {
    label: '4 · Restored',
    explanation: 'The script clears Start, then returns the reported level from about 315 to 200 mm. The controller is IDLE and the two digital bits are 0.',
    prompt: 'Scrub to sample 42 to check the final level and digital bits.',
  },
};

function Lamp({ on, label }: { on: boolean; label: string }) {
  return <span className={styles.lampLine}><span className={`${styles.lamp} ${on ? styles.lampOn : ''}`} aria-hidden="true" /><span>{label}</span><strong>{on ? '1' : '0'}</strong></span>;
}

function CheckQuestion({ question, answers, correct, explanation }: { question: string; answers: string[]; correct: number; explanation: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <fieldset className={styles.question}>
      <legend>{question}</legend>
      <div className={styles.answers}>
        {answers.map((answer, i) => (
          <label key={answer} className={`${styles.answer} ${selected === i ? styles.answerSelected : ''}`}>
            <input type="radio" name={question} checked={selected === i} onChange={() => { setSelected(i); setChecked(false); }} />
            {answer}
          </label>
        ))}
      </div>
      <button type="button" className={styles.secondaryButton} disabled={selected === null} onClick={() => setChecked(true)}>Check answer</button>
      {checked && <p className={selected === correct ? styles.correct : styles.incorrect} role="status">{selected === correct ? 'Correct. ' : 'Try again. '}{explanation}</p>}
    </fieldset>
  );
}

export function P1Replay({ bundle }: { bundle: Bundle }) {
  const samples = bundle.samples;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const sample = samples[index];
  const phase = phaseText[sample.phase];
  const firstByPhase = useMemo(() => Object.fromEntries((Object.keys(phaseText) as Phase[]).map(p => [p, samples.findIndex(s => s.phase === p)])) as Record<Phase, number>, [samples]);

  useEffect(() => {
    if (!playing) return;
    if (index >= samples.length - 1) {
      const stop = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(stop);
    }
    const delay = Math.max(75, samples[index + 1].elapsedMs - sample.elapsedMs) * 3;
    const next = setTimeout(() => setIndex(i => i + 1), delay);
    return () => clearTimeout(next);
  }, [playing, index, sample.elapsedMs, samples]);

  const jump = (next: number) => { setPlaying(false); setIndex(Math.max(0, Math.min(samples.length - 1, next))); };
  const togglePlay = () => { if (index === samples.length - 1) setIndex(0); setPlaying(!playing); };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>SPHERE ICS cluster · self-guided hello world</p>
          <h1>Watch a physical controller respond</h1>
          <p className={styles.heroLead}>Play one recorded P1 test. See how a reported tank level, a controller command, and a second PLC&apos;s input changed together.</p>
          <div className={styles.heroFacts}><span>Two physical ControlLogix PLCs</span><span>Simulated water process</span><span>42 recorded samples</span><span>About 5 minutes</span></div>
          <p className={styles.notice}><strong>Recorded experiment.</strong> This page does not connect to live PLCs. The test used a scripted tag stimulus, not an HMI click or an attack.</p>
        </header>

        <section className={styles.section} aria-labelledby="step-one">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>01</span><div><p className={styles.eyebrow}>Meet the setup</p><h2 id="step-one">What is connected?</h2></div></div>
          <p className={styles.sectionLead}>A ControlLogix runs the P1 control logic. A second ControlLogix hosts the simulator I/O image. The tank process is modeled in software.</p>
          <div className={styles.setup} aria-label="Controller PLC sends a valve output to the simulator PLC input image">
            <div className={styles.setupNode}><small>PHYSICAL PLC 1</small><strong>Controller</strong><span>Reads reported P1 level<br />Commands the P1 valve</span></div>
            <div className={styles.setupLink}><span>Valve output bit</span><b aria-hidden="true">→</b><span>Observed I/O-image match</span></div>
            <div className={styles.setupNode}><small>PHYSICAL PLC 2</small><strong>Simulator</strong><span>Receives valve input bit<br />Hosts a software tank model</span></div>
          </div>
          <p className={styles.finePrint}>The recorded test observed PLC I/O-image values. It did not measure current at the terminals or run a complete tank cycle.</p>
        </section>

        <section className={styles.section} aria-labelledby="step-two">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>02</span><div><p className={styles.eyebrow}>Explore the recorded run</p><h2 id="step-two">Press Play, then scrub the trace</h2></div></div>
          <p className={styles.sectionLead}>Playback is slowed to one-third speed for viewing. Every position is an actual recorded sample; the time labels show the original elapsed time.</p>
          <div className={styles.player}>
            <div className={styles.playerTop}>
              <div><span className={styles.phaseLabel}>{phase.label}</span><p className={styles.phaseExplanation}>{phase.explanation}</p></div>
              <div className={styles.sampleCounter}>Sample <strong>{sample.sample}</strong> of {samples.length}<br /><span>{sample.elapsedMs.toFixed(1)} ms elapsed</span></div>
            </div>
            <div className={styles.controls}>
              <button type="button" className={styles.primaryButton} onClick={togglePlay} aria-label={playing ? 'Pause replay' : 'Play replay'}>{playing ? 'Pause' : index === samples.length - 1 ? 'Replay from start' : 'Play replay'}</button>
              <button type="button" className={styles.secondaryButton} onClick={() => jump(index - 1)} disabled={index === 0}>Previous sample</button>
              <button type="button" className={styles.secondaryButton} onClick={() => jump(index + 1)} disabled={index === samples.length - 1}>Next sample</button>
            </div>
            <label className={styles.sliderLabel} htmlFor="sample-slider">Move to any recorded sample</label>
            <input id="sample-slider" className={styles.slider} type="range" min="0" max={samples.length - 1} value={index} onChange={event => jump(Number(event.target.value))} aria-valuetext={`Sample ${sample.sample} of ${samples.length}, ${phase.label}, ${sample.elapsedMs.toFixed(1)} milliseconds`} />
            <div className={styles.phaseButtons} aria-label="Jump to a phase">
              {(Object.keys(phaseText) as Phase[]).map(p => <button type="button" key={p} className={sample.phase === p ? styles.phaseActive : ''} onClick={() => jump(firstByPhase[p])}>{phaseText[p].label}</button>)}
            </div>
            <div className={styles.signalGrid} aria-live="polite">
              <div className={styles.signal}><small>LEVEL REPORTED TO CONTROLLER</small><strong>{sample.levelMm.toFixed(2)} <em>mm</em></strong><div className={styles.levelTrack}><span style={{ width: `${Math.min(100, sample.levelMm / 400 * 100)}%` }} /></div></div>
              <div className={styles.signal}><small>CONTROLLER STATE</small><strong>{sample.controllerState}</strong><span className={styles.signalSub}>Scripted Start input: {sample.scriptedStart ? 'on' : 'off'}</span></div>
              <div className={styles.signal}><small>VALVE ROUTE</small><Lamp on={sample.valveCommand} label="Controller command" /><Lamp on={sample.controllerOutputBit0} label="Controller output bit 0" /><Lamp on={sample.simulatorInputBit0} label="Simulator input bit 0" /></div>
            </div>
            <p className={styles.observation}><strong>Look for:</strong> {phase.prompt}</p>
            <p className={styles.finePrint}>The simulator valve-status tag matched its input bit during the Start interval. Relevant sampled fault bits stayed clear; the tank model stayed stopped.</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="step-three">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>03</span><div><p className={styles.eyebrow}>Check your observation</p><h2 id="step-three">What did the PLCs show?</h2></div></div>
          <div className={styles.questionGrid}>
            <CheckQuestion question="During Start, where was the controller valve output also observed?" answers={['In the simulator PLC input image', 'Only on the HMI screen', 'At a measured field terminal']} correct={0} explanation="The captured controller output bit 0 and simulator input bit 0 were both 1 in every Start sample." />
            <CheckQuestion question="What returned to its baseline in the final samples?" answers={['Only the displayed chart', 'Reported level, controller state, and both digital bits', 'A physical water tank']} correct={1} explanation="The reported level returned near 200 mm, the controller was IDLE, and both digital bits were 0." />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="step-four">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>04</span><div><p className={styles.eyebrow}>Inspect the evidence</p><h2 id="step-four">Take the selected trace with you</h2></div></div>
          <p className={styles.sectionLead}>The downloadable CSV contains all 42 recorded positions with teaching-relevant fields and relative time. It omits the private full-column capture and exact UTC timestamps.</p>
          <div className={styles.evidenceActions}><a className={styles.primaryButton} href="/demos/p1-rockwell-replay-42-samples.csv" download>Download filtered CSV</a><a className={styles.textLink} href="#step-one">Review the setup</a></div>
          <details className={styles.details}><summary>What supports this replay, and what does it not show?</summary><div><p>Source: the October 10, 2026 MDT bounded P1 integrated witness on the SPHERE Rockwell pair. The source capture has SHA-256 <code>{bundle.sourceSha256}</code>. The reviewed rule passed, with {bundle.phaseCounts.baseline} baseline, {bundle.phaseCounts.level_only} level-only, {bundle.phaseCounts.start} Start, and {bundle.phaseCounts.restored} restored samples.</p><p>The observed route is a controller output bit and a matching simulator input bit. The capture does not establish terminal voltage/current, conductor identity, HMI use, an attack, a running tank-model trajectory, or a complete process cycle. Studio 5000 was used separately to inspect the deployed PLC projects.</p><p>Visible terms map to the capture as follows: reported level is <code>P1.RW_Tank_tnk_lvl</code>; valve command is <code>P1.RW_Tank_PR_Valve</code>; output bit 0 is <code>Local:5:O.Data.0</code>; simulator input bit 0 is <code>Local:5:I.Data.0</code>. The full private source remains with the experiment record.</p></div></details>
          <p className={styles.endNote}>You have completed a read-only replay of one hardware-backed controller response. A separate, guided beta session is needed to operate the live HMI.</p>
        </section>
      </div>
    </div>
  );
}
