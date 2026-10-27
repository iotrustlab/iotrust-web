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
    explanation: 'The tank reads about 200 mm. The controller is idle and the fill valve is closed.',
    prompt: 'Both points on the valve signal read 0.',
  },
  level_only: {
    label: '2 · Level raised',
    explanation: 'At sample 11 the test sets the level reading to 315 mm, inside the 300–500 mm fill band. The controller waits: Start is still off.',
    prompt: 'Step from sample 10 to 11 and watch the reading jump while the valve stays closed.',
  },
  start: {
    label: '3 · Start pressed',
    explanation: 'Start turns on at sample 16. The controller switches to RUNNING and opens the fill valve, and the valve command arrives at PLC 2.',
    prompt: 'Compare PLC 1’s output point with PLC 2’s input point: they turn on together.',
  },
  restored: {
    label: '4 · Back to normal',
    explanation: 'Start turns off at sample 27 and the valve closes. At sample 29 the reading returns to about 200 mm.',
    prompt: 'Scrub to sample 42: everything is back where it started.',
  },
};

const steps = [
  ['step-setup', 'Meet the two PLCs'],
  ['step-play', 'Play the recording'],
  ['step-check', 'Check what you saw'],
  ['step-attack', 'See what an attacker could do'],
  ['step-data', 'Take the data with you'],
  ['next', 'What’s next'],
] as const;

function Lamp({ on, label, changed }: { on: boolean; label: string; changed?: boolean }) {
  return <span className={`${styles.lampLine} ${changed ? styles.changed : ''}`}><span className={`${styles.lamp} ${on ? styles.lampOn : ''}`} aria-hidden="true" /><span>{label}</span><strong>{on ? '1' : '0'}</strong></span>;
}

function nextChange(samples: Sample[], index: number, differs: (a: Sample, b: Sample) => boolean, describe: (s: Sample) => string) {
  const found = samples.findIndex((s, i) => i > index && differs(s, samples[index]));
  if (found < 0) return 'No further change in this recording';
  const n = found - index;
  return `${describe(samples[found])} at sample ${samples[found].sample} (${n} ${n === 1 ? 'step' : 'steps'} ahead)`;
}

function TraceChart({ samples, index }: { samples: Sample[]; index: number }) {
  const x = (i: number) => 42 + i * 816 / (samples.length - 1);
  const y = (level: number) => 115 - (level - 190) * 78 / 140;
  const points = samples.map((s, i) => `${x(i)},${y(s.levelMm)}`).join(' ');
  const area = `M ${x(0)} 115 L ${samples.map((s, i) => `${x(i)} ${y(s.levelMm)}`).join(' L ')} L ${x(samples.length - 1)} 115 Z`;
  const cursor = samples[index];
  return <div className={styles.traceChart}>
    <div className={styles.traceHeading}><div><small>The whole recording</small><strong>Level reading and fill-valve signal</strong></div><span><i /> Level reading <b /> Valve open</span></div>
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
    <p>The dashed marker follows the sample you select.</p>
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

function Expected({ children }: { children: React.ReactNode }) {
  return <p className={styles.expected}><strong>Expected:</strong> {children}</p>;
}

function SetupDiagram() {
  return <svg className={styles.setupSvg} viewBox="0 0 860 310" role="img" aria-label="PLC 2, the plant simulator, sends the tank level to PLC 1 on analog slot 7 channel 0. PLC 1, the controller, sends the fill-valve command back to PLC 2 on digital slot 5 point 0.">
    <rect x="10" y="60" width="210" height="180" rx="12" className={styles.svgNode} />
    <text x="28" y="94" className={styles.svgEyebrow}>PLC 1 · CONTROLLER</text>
    <text x="28" y="126" className={styles.svgTitle}>Runs the control</text>
    <text x="28" y="152" className={styles.svgTitle}>program</text>
    <text x="28" y="196" className={styles.svgSmall}>Decides when to open</text>
    <text x="28" y="214" className={styles.svgSmall}>the fill valve</text>
    <rect x="640" y="60" width="210" height="180" rx="12" className={styles.svgNode} />
    <text x="658" y="94" className={styles.svgEyebrow}>PLC 2 · PLANT SIMULATOR</text>
    <text x="658" y="126" className={styles.svgTitle}>Plays the tank</text>
    <text x="658" y="152" className={styles.svgTitle}>and valve</text>
    <text x="658" y="196" className={styles.svgSmall}>Sends the level, receives</text>
    <text x="658" y="214" className={styles.svgSmall}>the valve command</text>
    <text x="430" y="72" textAnchor="middle" className={styles.svgLinkLabel}>Tank level (analog)</text>
    <line x1="634" y1="96" x2="234" y2="96" className={styles.svgLinkLevel} markerEnd="url(#p1-arrow-level)" />
    <text x="430" y="120" textAnchor="middle" className={styles.svgPort}>from PLC 2 output, slot 7, channel 0</text>
    <text x="430" y="137" textAnchor="middle" className={styles.svgPort}>to PLC 1 input, slot 7, channel 0</text>
    <text x="430" y="182" textAnchor="middle" className={styles.svgLinkLabel}>Fill-valve command (digital)</text>
    <line x1="226" y1="206" x2="626" y2="206" className={styles.svgLinkValve} markerEnd="url(#p1-arrow-valve)" />
    <text x="430" y="230" textAnchor="middle" className={styles.svgPort}>from PLC 1 output, slot 5, point 0</text>
    <text x="430" y="247" textAnchor="middle" className={styles.svgPort}>to PLC 2 input, slot 5, point 0</text>
    <text x="430" y="292" textAnchor="middle" className={styles.svgRule}>Rule: Start on and level between 300 and 500 mm → fill valve open</text>
    <defs>
      <marker id="p1-arrow-level" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" className={styles.svgArrowLevel} /></marker>
      <marker id="p1-arrow-valve" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" className={styles.svgArrowValve} /></marker>
    </defs>
  </svg>;
}

const attackStages = [
  { label: 'Normal fill', real: 470, reported: 470, valve: true, attacker: false, overflow: false,
    text: 'Start is on and the tank reads 470 mm, inside the 300–500 mm band, so PLC 1 keeps the fill valve open.' },
  { label: 'Normal stop', real: 505, reported: 505, valve: false, attacker: false, overflow: false,
    text: 'The level passes 500 mm. PLC 1 closes the fill valve and the tank stops below the brim.' },
  { label: 'Forged reading', real: 505, reported: 315, valve: true, attacker: true, overflow: false,
    text: 'An attacker on the network writes PLC 2’s level output, the same tag the October 10 test script wrote, and holds it at 315 mm. PLC 1 sees a tank inside the fill band and opens the valve again.' },
  { label: 'Overflow', real: 600, reported: 315, valve: true, attacker: true, overflow: true,
    text: 'The real tank overflows while PLC 1, and any operator screen fed by it, still shows 315 mm.' },
];

function AttackStep() {
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const s = attackStages[stage];
  const tankY = (mm: number) => 270 - Math.min(mm, 560) * 210 / 560;
  const choices = [
    'Read the level at PLC 1 again',
    'Check that the valve output and input points match',
    'Compare with an independent high-level switch or the inflow over time',
  ];
  return <div className={styles.attack}>
    <div className={styles.attackStages} role="tablist" aria-label="Attack illustration stages">
      {attackStages.map((st, i) => <button type="button" role="tab" aria-selected={stage === i} key={st.label} className={stage === i ? styles.attackStageActive : ''} onClick={() => setStage(i)}>{i + 1} · {st.label}</button>)}
    </div>
    <div className={styles.attackScene}>
      <svg viewBox="0 0 800 300" role="img" aria-label={`${s.label}: real level ${s.real} mm, PLC 1 reads ${s.reported} mm, fill valve ${s.valve ? 'open' : 'closed'}.`}>
        <text x="50" y="50" className={styles.atkLabel}>REAL TANK</text>
        <rect x="50" y="60" width="130" height="210" rx="6" className={styles.atkTank} />
        <rect x="53" y={tankY(s.real)} width="124" height={270 - tankY(s.real)} className={s.overflow ? styles.atkWaterHigh : styles.atkWater} />
        {s.overflow && <path d="M 55 60 q -18 30 -24 120 M 175 60 q 18 30 24 120" className={styles.atkSpill} />}
        <line x1="40" x2="190" y1={tankY(500)} y2={tankY(500)} className={styles.atkLimit} /><text x="212" y={tankY(500) + 4} className={styles.atkTick}>500 mm</text>
        <line x1="40" x2="190" y1={tankY(300)} y2={tankY(300)} className={styles.atkBand} /><text x="212" y={tankY(300) + 4} className={styles.atkTick}>300 mm</text>
        <text x="115" y="290" textAnchor="middle" className={styles.atkValue}>{s.overflow ? 'overflowing' : `${s.real} mm`}</text>
        <path d="M 670 150 V 24 H 150 V 60" className={s.valve ? styles.atkPipeOpen : styles.atkPipe} />
        <text x="410" y="16" textAnchor="middle" className={styles.atkSmall}>fill valve {s.valve ? 'OPEN' : 'closed'} (command from PLC 1)</text>
        <rect x="280" y="150" width="140" height="80" rx="10" className={styles.atkNode} />
        <text x="350" y="180" textAnchor="middle" className={styles.atkNodeTitle}>PLC 2</text>
        <text x="350" y="202" textAnchor="middle" className={styles.atkSmall}>plant simulator</text>
        <rect x="600" y="150" width="140" height="80" rx="10" className={styles.atkNode} />
        <text x="670" y="180" textAnchor="middle" className={styles.atkNodeTitle}>PLC 1</text>
        <text x="670" y="202" textAnchor="middle" className={styles.atkSmall}>reads {s.reported} mm</text>
        <line x1="180" y1="190" x2="280" y2="190" className={styles.atkWire} />
        <line x1="420" y1="190" x2="600" y2="190" className={s.attacker ? styles.atkWireForged : styles.atkWire} />
        <text x="510" y="178" textAnchor="middle" className={s.attacker ? styles.atkForged : styles.atkSmall}>{s.reported} mm{s.attacker ? ' (forged)' : ''}</text>
        {s.attacker && <g className={styles.atkAttacker}>
          <line x1="350" y1="252" x2="350" y2="232" className={styles.atkAttackLine} />
          <rect x="250" y="252" width="200" height="36" rx="8" />
          <text x="350" y="275" textAnchor="middle">Attacker on the network</text>
        </g>}
      </svg>
      <p className={styles.attackCaption}>{s.text}</p>
    </div>
    <div className={styles.attackQuestions}>
      <CheckQuestion question="How did the attacker keep the valve open?" answers={['By changing PLC 1’s program', 'By feeding PLC 1 a false level reading', 'By pressing Start on the operator screen']} correct={1} explanation="PLC 1 ran the same program the whole time. It acted correctly on a reading that was wrong." />
      <div className={styles.securityDecision}>
        <h3>What would expose the forged reading?</h3>
        <p>Pick the check that does not depend on the level PLC 1 reports.</p>
        <div className={styles.securityChoices}>
          {choices.map((choice, i) => <button type="button" key={choice} className={answer === i ? styles.securityChoiceSelected : ''} onClick={() => setAnswer(i)}>{choice}</button>)}
        </div>
        {answer !== null && <p className={answer === 2 ? styles.securityFeedbackCorrect : styles.securityFeedback} role="status">
          {answer === 2 ? 'Yes. A separate high-level switch, or inflow that keeps arriving while the level stays flat, contradicts the forged 315 mm.' : 'That check only sees the forged value or what PLC 1 did with it, so it would look normal.'}
        </p>}
      </div>
    </div>
  </div>;
}

export function P1Replay({ bundle }: { bundle: Bundle }) {
  const samples = bundle.samples;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const sample = samples[index];
  const prev = index > 0 ? samples[index - 1] : sample;
  const phase = phaseText[sample.phase];
  const fillPercent = Math.min(100, Math.max(0, sample.levelMm / 400 * 100));
  const firstByPhase = useMemo(() => Object.fromEntries((Object.keys(phaseText) as Phase[]).map(p => [p, samples.findIndex(s => s.phase === p)])) as Record<Phase, number>, [samples]);
  const levelChanged = Math.abs(sample.levelMm - prev.levelMm) > 1;
  const valveChanged = sample.valveCommand !== prev.valveCommand;
  const levelNext = nextChange(samples, index, (a, b) => Math.abs(a.levelMm - b.levelMm) > 1, s => `Reading becomes ${s.levelMm.toFixed(0)} mm`);
  const controllerNext = nextChange(samples, index, (a, b) => a.valveCommand !== b.valveCommand, s => s.valveCommand ? 'Valve opens' : 'Valve closes');
  const simNext = nextChange(samples, index, (a, b) => a.simulatorInputBit0 !== b.simulatorInputBit0, s => s.simulatorInputBit0 ? 'Input turns on' : 'Input turns off');

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
  const panelHead = (title: string) => <div className={styles.panelHead}><small>{title}</small><span>Sample {sample.sample}</span></div>;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>SPHERE ICS cluster · Hello world</p>
            <p className={styles.heroMode}>Recorded on real hardware · P1 raw-water intake</p>
            <h1>Your first SPHERE experiment</h1>
            <p className={styles.heroLead}>Two real PLCs in the SPHERE ICS cluster run the intake tank of a water-treatment plant. Replay a two-second test in which the controller opens the tank’s fill valve, then see how an attacker could abuse the same signal.</p>
            <a className={styles.heroLink} href="#on-this-page">Start the walkthrough <span aria-hidden="true">↓</span></a>
            <div className={styles.heroFacts}><span><b>~10 min</b> to complete</span><span><b>Browser</b> is all you need</span><span><b>No account</b> required</span></div>
          </div>
          <figure className={styles.heroPhoto}><Image src="/images/demos/p1/rockwell-rack-complete.png" alt="One of the two Rockwell ControlLogix racks in the SPHERE ICS cluster" fill priority sizes="(max-width: 760px) 100vw, 45vw" /><figcaption>One of the two Rockwell ControlLogix racks used in this test</figcaption></figure>
        </header>

        <nav className={styles.toc} id="on-this-page" aria-label="On this page">
          <p className={styles.eyebrow}>On this page</p>
          <ol>{steps.map(([id, title], i) => <li key={id}><a href={`#${id}`}><span>{id === 'next' ? '→' : i + 1}</span>{title}</a></li>)}</ol>
        </nav>

        <section className={styles.section} aria-labelledby="step-setup">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>1</span><div><p className={styles.eyebrow}>Step 1</p><h2 id="step-setup">Meet the two PLCs</h2></div></div>
          <p className={styles.sectionLead}>P1 is the raw-water intake of the plant: a tank that fills from the river through a fill valve. In the SPHERE ICS cluster two Rockwell ControlLogix PLCs run it. PLC 1 is the controller. PLC 2 plays the plant: it sends PLC 1 a tank-level reading and receives the valve command back.</p>
          <p className={styles.sectionLead}>The control rule is simple. When an operator presses Start and the tank reads between 300 and 500 mm, PLC 1 opens the fill valve. Above 500 mm it closes the valve, so the tank never overflows.</p>
          <div className={styles.setupVisuals}>
            <div className={styles.setup}><SetupDiagram /></div>
            <figure className={styles.hmiPhoto}><Image src="/images/demos/p1/factorytalk-hmi.png" alt="FactoryTalk operator screen for the water-treatment plant, with the tank and its controls" fill sizes="(max-width: 760px) 100vw, 35vw" /><figcaption>The operator screen for this plant, used in the guided live session</figcaption></figure>
          </div>
          <Expected>you can say which PLC makes the decision (PLC 1) and which wires carry the level reading and the valve command.</Expected>
        </section>

        <section className={styles.section} aria-labelledby="step-play">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>2</span><div><p className={styles.eyebrow}>Step 2</p><h2 id="step-play">Play the recording</h2></div></div>
          <p className={styles.sectionLead}>On October 10, 2026 we ran one short test on the two PLCs. A script set the level reading to 315 mm and pressed Start for about half a second. The whole test lasts two seconds, so playback runs at one-third speed.</p>
          <ol className={styles.instructions}>
            <li>Press <b>Play recording</b> and watch all three panels.</li>
            <li>Press <b>Previous</b> and <b>Next</b> to step one sample at a time. Each panel shows the sample number and when its next change comes.</li>
            <li>Use the phase buttons to jump to the moment Start is pressed.</li>
          </ol>
          <div className={styles.player}>
            <div className={styles.playerTop}>
              <div><span className={styles.phaseLabel}>{phase.label}</span><p className={styles.phaseExplanation}>{phase.explanation}</p></div>
              <div className={styles.sampleCounter}>Sample <strong>{sample.sample}</strong> of {samples.length}<br /><span>{sample.elapsedMs.toFixed(0)} ms into the test</span></div>
            </div>
            <div className={styles.controls}>
              <button type="button" className={styles.primaryButton} onClick={togglePlay} aria-label={playing ? 'Pause recording' : 'Play recording'}>{playing ? 'Pause' : index === samples.length - 1 ? 'Play again' : 'Play recording'}</button>
              <button type="button" className={styles.secondaryButton} onClick={() => jump(index - 1)} disabled={index === 0}>← Previous</button>
              <button type="button" className={styles.secondaryButton} onClick={() => jump(index + 1)} disabled={index === samples.length - 1}>Next →</button>
            </div>
            <label className={styles.sliderLabel} htmlFor="sample-slider">Move to any sample</label>
            <input id="sample-slider" className={styles.slider} type="range" min="0" max={samples.length - 1} value={index} onChange={event => jump(Number(event.target.value))} aria-valuetext={`Sample ${sample.sample} of ${samples.length}, ${phase.label}, ${sample.elapsedMs.toFixed(0)} milliseconds`} />
            <div className={styles.phaseButtons} aria-label="Jump to a phase">
              {(Object.keys(phaseText) as Phase[]).map(p => <button type="button" key={p} className={sample.phase === p ? styles.phaseActive : ''} onClick={() => jump(firstByPhase[p])}>{phaseText[p].label}</button>)}
            </div>
            <div className={styles.stageVisual} aria-live="polite">
              <div className={styles.tankPanel}>
                {panelHead('Level reading at PLC 1')}
                <div className={styles.tankScene} aria-hidden="true"><div className={styles.tankTicks}><span>400</span><span>300</span><span>200</span><span>100</span></div><div className={styles.tankGlass}><div className={styles.tankWater} style={{ height: `${fillPercent}%` }}><span /></div></div></div>
                <strong key={`lvl-${sample.sample}`} className={levelChanged ? styles.changedValue : ''}>{sample.levelMm.toFixed(1)} <em>mm</em></strong>
                <p>Analog input, slot 7, channel 0</p>
                <p className={styles.nextHint}>{levelNext}</p>
              </div>
              <div className={styles.controllerPanel}>
                {panelHead('PLC 1 · Controller')}
                <strong key={`st-${sample.sample}`} className={`${styles.statePill} ${sample.controllerState === 'RUNNING' ? styles.stateRunning : ''} ${valveChanged ? styles.changedValue : ''}`}>{sample.controllerState}</strong>
                <Lamp on={sample.scriptedStart} label="Start (from the test script)" changed={sample.scriptedStart !== prev.scriptedStart} />
                <Lamp on={sample.valveCommand} label="Fill-valve command" changed={valveChanged} />
                <Lamp on={sample.controllerOutputBit0} label="Output slot 5, point 0" changed={sample.controllerOutputBit0 !== prev.controllerOutputBit0} />
                <p className={styles.nextHint}>{controllerNext}</p>
              </div>
              <div className={styles.simulatorPanel}>
                {panelHead('Valve signal, PLC 1 → PLC 2')}
                <div className={`${styles.routeLine} ${sample.controllerOutputBit0 && sample.simulatorInputBit0 ? styles.routeOn : ''}`}><span>OUT {sample.controllerOutputBit0 ? 1 : 0}</span><i aria-hidden="true" /><span>IN {sample.simulatorInputBit0 ? 1 : 0}</span></div>
                <p className={styles.routeMatch}>{sample.controllerOutputBit0 !== sample.simulatorInputBit0 ? 'The points disagree in this sample' : sample.simulatorInputBit0 ? 'Both points read 1: the open command reached PLC 2' : 'Both points read 0: the valve is commanded closed'}</p>
                <div className={styles.simulatorInner}><small>PLC 2 · Plant simulator</small><Lamp on={sample.simulatorInputBit0} label="Input slot 5, point 0" changed={sample.simulatorInputBit0 !== prev.simulatorInputBit0} /><p className={styles.nextHint}>{simNext}</p></div>
              </div>
            </div>
            <TraceChart samples={samples} index={index} />
            <p className={styles.observation}><strong>Look for:</strong> {phase.prompt}</p>
          </div>
          <Expected>the reading jumps to 315 mm at sample 11, the fill valve opens at sample 16 and closes at sample 27, and the reading returns to 200 mm at sample 29.</Expected>
        </section>

        <section className={styles.section} aria-labelledby="step-check">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>3</span><div><p className={styles.eyebrow}>Step 3</p><h2 id="step-check">Check what you saw</h2></div></div>
          <div className={styles.questionGrid}>
            <CheckQuestion question="Why did the valve stay closed at samples 11–15, even though the reading was 315 mm?" answers={['The reading was still too low', 'Start had not been pressed yet', 'PLC 2 was disconnected']} correct={1} explanation="The rule needs both conditions: a reading inside the 300–500 mm band and Start on. Start turned on at sample 16." />
            <CheckQuestion question="When PLC 1 opened the valve, where did the command show up?" answers={['On PLC 2’s input, slot 5, point 0', 'Only on the operator screen', 'Nowhere else']} correct={0} explanation="In every sample from 16 to 26, PLC 1’s output point and PLC 2’s input point both read 1." />
          </div>
          <Expected>both answers marked correct.</Expected>
        </section>

        <section className={styles.section} aria-labelledby="step-attack">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>4</span><div><p className={styles.eyebrow}>Step 4</p><h2 id="step-attack">See what an attacker could do</h2></div></div>
          <p className={styles.sectionLead}>PLC 1 trusts its level reading. In the October 10 test a script changed that reading over the network to start the fill. An attacker with the same network access could use it to keep the fill going past the 500 mm limit. Click through the four stages. This is an illustration built from the test setup; the recording itself contains only the scripted test.</p>
          <AttackStep />
          <Expected>by stage 4 the real tank overflows while PLC 1 still reads 315 mm, and you know which check would catch it.</Expected>
        </section>

        <section className={styles.section} aria-labelledby="step-data">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>5</span><div><p className={styles.eyebrow}>Step 5</p><h2 id="step-data">Take the data with you</h2></div></div>
          <p className={styles.sectionLead}>Download the 42 samples you just replayed, with their times relative to the start of the test.</p>
          <div className={styles.evidenceActions}><a className={styles.primaryButton} href="/demos/p1-rockwell-replay-42-samples.csv" download>Download the CSV</a></div>
          <Expected>a file named <code>p1-rockwell-replay-42-samples.csv</code> with one row per sample.</Expected>
          <details className={styles.details}><summary>About this recording</summary><div>
            <p>Recorded on {bundle.observedOn} on the SPHERE Rockwell pair. The test held the level at 315 mm for about 0.9 s and Start for about 0.55 s, then put both back. The simulated tank was paused, so the level changed only when the script set it. The values come from the two PLCs’ memory; an independent level sensor was not part of this test. The source capture has SHA-256 <code>{bundle.sourceSha256}</code>, with {bundle.phaseCounts.baseline} baseline, {bundle.phaseCounts.level_only} level-raised, {bundle.phaseCounts.start} Start, and {bundle.phaseCounts.restored} back-to-normal samples.</p>
            <p>Names on this page and their PLC tags: level reading <code>P1.RW_Tank_tnk_lvl</code>; fill-valve command <code>P1.RW_Tank_PR_Valve</code>; PLC 1 output slot 5, point 0 <code>Local:5:O.Data.0</code>; PLC 2 input slot 5, point 0 <code>Local:5:I.Data.0</code>.</p>
          </div></details>
        </section>

        <section className={styles.section} aria-labelledby="next">
          <div className={styles.sectionHead}><span className={styles.stepNumber}>→</span><div><p className={styles.eyebrow}>What’s next</p><h2 id="next">Run it live</h2></div></div>
          <p className={styles.sectionLead}>In a guided live session you sign in to the operator screen shown in step 1, press Start yourself, and watch the same signals on the running PLCs. Contact the IoTrust Lab to join one.</p>
          <p className={styles.sectionLead}>To see SPHERE across three utilities, hydro power, water treatment and water distribution, try the <a className={styles.textLink} href="/sphere/hello-world/">cross-domain hello world</a>.</p>
        </section>
      </div>
    </div>
  );
}
