'use client';

import Image from 'next/image';
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

function TraceChart({ samples, index }: { samples: Sample[]; index: number }) {
  const x = (i: number) => 42 + i * 816 / (samples.length - 1);
  const y = (level: number) => 115 - (level - 190) * 78 / 140;
  const points = samples.map((s, i) => `${x(i)},${y(s.levelMm)}`).join(' ');
  const area = `M ${x(0)} 115 L ${samples.map((s, i) => `${x(i)} ${y(s.levelMm)}`).join(' L ')} L ${x(samples.length - 1)} 115 Z`;
  const cursor = samples[index];
  return <div className={styles.traceChart}>
    <div className={styles.traceHeading}><div><small>THE RECORDED TRACE</small><strong>Reported level and PLC I/O bits</strong></div><span><i /> P1 level <b /> Both bits on</span></div>
    <svg viewBox="0 0 900 175" preserveAspectRatio="none" aria-hidden="true">
      <line x1="42" x2="858" y1="45" y2="45" className={styles.chartGrid} />
      <line x1="42" x2="858" y1="115" y2="115" className={styles.chartAxis} />
      <text x="0" y="49" className={styles.chartTick}>315</text><text x="0" y="119" className={styles.chartTick}>200</text>
      <path d={area} className={styles.chartArea} />
      <polyline points={points} className={styles.chartLine} />
      {samples.map((s, i) => s.controllerOutputBit0 && s.simulatorInputBit0 && <rect key={s.sample} x={x(i) - 8} y="132" width="16" height="12" rx="3" className={styles.chartBit} />)}
      <line x1={x(index)} x2={x(index)} y1="9" y2="149" className={styles.chartCursor} />
      <circle cx={x(index)} cy={y(cursor.levelMm)} r="7" className={styles.chartPoint} />
      <text x="42" y="169" className={styles.chartTime}>0 ms</text>
      <text x="858" y="169" textAnchor="end" className={styles.chartTime}>{samples.at(-1)?.elapsedMs.toFixed(0)} ms</text>
    </svg>
    <p>The line and bit marks use all 42 samples. The vertical marker follows your selection.</p>
  </div>;
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

function SecurityLens() {
  const [answer, setAnswer] = useState<number | null>(null);
  const choices = [
    'Read the same level tag again',
    'Check that the PLC output and input bits match',
    'Compare with a trusted second level reading or flow trend',
  ];
  return <div className={styles.securityLens}>
    <div className={styles.securityStory}>
      <span className={styles.securityBadge}>HYPOTHETICAL · NO ATTACK WAS RUN</span>
      <h3>What if the reported 315 mm were false?</h3>
      <p>The recorded test shows how the controller responded to a scripted level value and Start input. It does not establish the tank&apos;s independent state.</p>
      <div className={styles.securityChain} aria-label="Recorded controller response to the reported level">
        <span>Reported level<br /><strong>315 mm</strong></span><b aria-hidden="true">→</b>
        <span>Controller<br /><strong>RUNNING</strong></span><b aria-hidden="true">→</b>
        <span>PLC I/O bits<br /><strong>both 1</strong></span>
      </div>
    </div>
    <div className={styles.securityDecision}>
      <h3>What evidence could expose a false reading?</h3>
      <p>Choose the observation that does not rely only on the reported value or its downstream response.</p>
      <div className={styles.securityChoices}>
        {choices.map((choice, i) => <button type="button" key={choice} className={answer === i ? styles.securityChoiceSelected : ''} onClick={() => setAnswer(i)}>{choice}</button>)}
      </div>
      {answer !== null && <p className={answer === 2 ? styles.securityFeedbackCorrect : styles.securityFeedback} role="status">
        {answer === 2 ? 'Yes. A trusted second level reading or a valid flow balance over time could contradict the reported level. ' : 'That observation depends on the reported value or the controller response. '}
        This 42-sample capture has no independent tank-level or flow measurement, so it cannot validate an attack or a physical consequence.
      </p>}
    </div>
  </div>;
}

export function P1Replay({ bundle }: { bundle: Bundle }) {
  const samples = bundle.samples;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const sample = samples[index];
  const phase = phaseText[sample.phase];
  const fillPercent = Math.min(100, Math.max(0, sample.levelMm / 400 * 100));
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
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>SPHERE ICS CLUSTER / SELF-GUIDED HELLO WORLD</p>
            <h1>Watch a controller command appear in a second PLC.</h1>
            <p className={styles.heroLead}>Follow a recorded P1 level, controller response, and matching simulator input through 42 real samples.</p>
            <a className={styles.heroLink} href="#step-two">Explore the replay <span aria-hidden="true">↓</span></a>
            <div className={styles.heroFacts}><span><b>02</b> physical PLCs</span><span><b>42</b> samples</span><span><b>~5 min</b> self-guided</span></div>
          </div>
          <figure className={styles.heroPhoto}><Image src="/images/demos/p1/rockwell-rack-complete.png" alt="Complete view of one of the two physical Rockwell ControlLogix racks used by the SPHERE ICS facility" fill priority sizes="(max-width: 760px) 100vw, 45vw" /><figcaption>One complete facility rack · illustrative</figcaption></figure>
        </header>
        <p className={styles.notice}><strong>Recorded, not live.</strong> This page does not connect to PLCs. The October 10 test used a scripted tag stimulus, not an HMI click or an attack.</p>

        <section className={styles.section} aria-labelledby="step-one">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>01</span><div><p className={styles.eyebrow}>Meet the setup</p><h2 id="step-one">What is connected?</h2></div></div>
          <p className={styles.sectionLead}>A ControlLogix runs the P1 control logic. A second ControlLogix hosts the simulator I/O image. The tank process is modeled in software.</p>
          <div className={styles.setupVisuals}>
            <div className={styles.setup} aria-label="Controller PLC output and simulator PLC input are compared in the recorded I/O images">
              <div className={styles.setupNode}><span className={styles.plcGlyph} aria-hidden="true"><i /><i /><i /><i /></span><small>PHYSICAL PLC 1</small><strong>Controller</strong><span>Reads reported P1 level<br />Commands the P1 valve</span></div>
              <div className={styles.setupLink}><span>Controller output bit</span><b aria-hidden="true">→</b><span>Simulator input bit</span></div>
              <div className={styles.setupNode}><span className={styles.plcGlyph} aria-hidden="true"><i /><i /><i /><i /></span><small>PHYSICAL PLC 2</small><strong>Simulator</strong><span>Receives the valve bit<br />Tank model stopped in this test</span></div>
            </div>
            <figure className={styles.hmiPhoto}><Image src="/images/demos/p1/factorytalk-hmi.png" alt="Illustrative FactoryTalk HMI screen showing a water-treatment tank and controls" fill sizes="(max-width: 760px) 100vw, 35vw" /><figcaption>Prepared HMI for guided beta sessions. It did not trigger this recorded test.</figcaption></figure>
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
            <div className={styles.stageVisual} aria-live="polite">
              <div className={styles.tankPanel}>
                <small>REPORTED P1 LEVEL</small>
                <div className={styles.tankScene} aria-hidden="true"><div className={styles.tankTicks}><span>400</span><span>300</span><span>200</span><span>100</span></div><div className={styles.tankGlass}><div className={styles.tankWater} style={{ height: `${fillPercent}%` }}><span /></div></div></div>
                <strong>{sample.levelMm.toFixed(2)} <em>mm</em></strong>
                <p>A PLC tag value, not measured water in a physical tank.</p>
              </div>
              <div className={styles.controllerPanel}>
                <small>PHYSICAL PLC 1</small><h3>Controller</h3>
                <strong className={`${styles.statePill} ${sample.controllerState === 'RUNNING' ? styles.stateRunning : ''}`}>{sample.controllerState}</strong>
                <Lamp on={sample.scriptedStart} label="Scripted Start input" />
                <Lamp on={sample.valveCommand} label="P1 valve command" />
                <Lamp on={sample.controllerOutputBit0} label="Output bit 0" />
              </div>
              <div className={styles.simulatorPanel}>
                <small>OBSERVED I/O-IMAGE ROUTE</small>
                <div className={`${styles.routeLine} ${sample.controllerOutputBit0 && sample.simulatorInputBit0 ? styles.routeOn : ''}`}><span>OUT</span><i aria-hidden="true" /><span>IN</span></div>
                <p className={styles.routeMatch}>{sample.controllerOutputBit0 === sample.simulatorInputBit0 ? 'Bits match in this sample' : 'Bits differ in this sample'}</p>
                <div className={styles.simulatorInner}><small>PHYSICAL PLC 2</small><h3>Simulator</h3><Lamp on={sample.simulatorInputBit0} label="Input bit 0" /><p>Software tank model stopped</p></div>
              </div>
            </div>
            <TraceChart samples={samples} index={index} />
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

        <section className={styles.section} aria-labelledby="security-question">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>04</span><div><p className={styles.eyebrow}>Apply a security lens</p><h2 id="security-question">Could a false level hide here?</h2></div></div>
          <p className={styles.sectionLead}>The same reported value that guided the controller could be an attack target. Test what this record can and cannot tell you.</p>
          <SecurityLens />
        </section>

        <section className={styles.section} aria-labelledby="step-five">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>05</span><div><p className={styles.eyebrow}>Inspect the evidence</p><h2 id="step-five">Take the selected trace with you</h2></div></div>
          <p className={styles.sectionLead}>The downloadable CSV contains all 42 recorded positions with teaching-relevant fields and relative time. It omits the private full-column capture and exact UTC timestamps.</p>
          <div className={styles.evidenceActions}><a className={styles.primaryButton} href="/demos/p1-rockwell-replay-42-samples.csv" download>Download filtered CSV</a><a className={styles.textLink} href="#step-one">Review the setup</a></div>
          <details className={styles.details}><summary>What supports this replay, and what does it not show?</summary><div><p>Source: the October 10, 2026 MDT bounded P1 integrated witness on the SPHERE Rockwell pair. The source capture has SHA-256 <code>{bundle.sourceSha256}</code>. The reviewed rule passed, with {bundle.phaseCounts.baseline} baseline, {bundle.phaseCounts.level_only} level-only, {bundle.phaseCounts.start} Start, and {bundle.phaseCounts.restored} restored samples.</p><p>The observed route is a controller output bit and a matching simulator input bit. The capture does not establish terminal voltage/current, conductor identity, HMI use, an attack, a running tank-model trajectory, or a complete process cycle. The false-level exercise is a hypothetical teaching question; no independent tank-level or flow measurement was captured. Studio 5000 was used separately to inspect the deployed PLC projects.</p><p>Visible terms map to the capture as follows: reported level is <code>P1.RW_Tank_tnk_lvl</code>; valve command is <code>P1.RW_Tank_PR_Valve</code>; output bit 0 is <code>Local:5:O.Data.0</code>; simulator input bit 0 is <code>Local:5:I.Data.0</code>. The full private source remains with the experiment record.</p></div></details>
          <p className={styles.endNote}>You have replayed one hardware-backed controller response and assessed a hypothetical false-level question. A separate, guided beta session is needed to operate the live HMI.</p>
        </section>
      </div>
    </div>
  );
}
