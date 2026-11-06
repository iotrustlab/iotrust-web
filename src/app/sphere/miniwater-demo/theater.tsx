'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Frame } from './replay';
import styles from './replay.module.css';

type View = 'overview' | 'raw' | 'treatment' | 'delivery';
type EquipmentId = 'tank1' | 'plc1' | 'network' | 'tank2' | 'plc2' | 'tank3' | 'plc3';
type Layout = 'embedded' | 'large' | 'workspace';
export type PlaybackSpeed = 1 | 4 | 10;
type Run = { name: string; start: number; end: number };
type Readout = { label: string; value: string; alert?: boolean };
type UnityApplied = {
  sequence: number; scenario: string; elapsed_ms: number;
  truth: Pick<Frame['truth'], 'tank1_mm' | 'tank2_mm' | 'tank3_mm' | 'color_blue' | 'color_yellow'>;
  reported: Pick<Frame['reported'], 'tank1_mm' | 'color_blue' | 'color_yellow'>;
  commands: Pick<Frame['commands'], 'plc1_fill_valve' | 'plc1_transfer_pump' | 'plc2_blue_doser' | 'plc2_yellow_doser' | 'plc3_transfer_pump'>;
  proxy_target_met: boolean;
};

const views: { id: View; label: string; key: string; equipment: EquipmentId }[] = [
  { id: 'overview', label: 'Overview', key: '0', equipment: 'network' },
  { id: 'raw', label: 'Raw source', key: '1', equipment: 'tank1' },
  { id: 'treatment', label: 'Treatment', key: '2', equipment: 'tank2' },
  { id: 'delivery', label: 'Delivery', key: '3', equipment: 'tank3' },
];
const equipment: { id: EquipmentId; label: string; site: string; view: View; description: string }[] = [
  { id: 'tank1', label: 'Tank 1 · raw source', site: 'Site A', view: 'raw', description: 'Software-modeled raw-water storage. The Controller PLC1 reading can diverge from this independent modeled level.' },
  { id: 'plc1', label: 'PLC1 · ControlLogix', site: 'Site A', view: 'raw', description: 'Installed ControlLogix stage for filling and transfer. Its requests are controller commands; pump feedback below is simulated.' },
  { id: 'network', label: 'Routed site boundary', site: 'A ↔ B', view: 'overview', description: 'The design routes PLC1, PLC2, and PLC3 stage signals between two SPHERE facilities. This public replay contains no measured network traffic.' },
  { id: 'tank2', label: 'Tank 2 · treatment', site: 'Site B', view: 'treatment', description: 'Software-modeled treatment tank. The water tint follows modeled blue and yellow color proxy values.' },
  { id: 'plc2', label: 'PLC2 · OpenPLC Pi', site: 'Site B', view: 'treatment', description: 'The first Raspberry Pi assesses reported color, doses, settles, and announces treatment complete.' },
  { id: 'tank3', label: 'Tank 3 · receiving', site: 'Site B', view: 'delivery', description: 'Software-modeled delivery tank. Its tint shows the modeled treatment color carried into the receiving stage.' },
  { id: 'plc3', label: 'PLC3 · OpenPLC Pi', site: 'Site B', view: 'delivery', description: 'The second Raspberry Pi delivers modeled treated water after the PLC2 handoff.' },
];
const scenarioNames: Record<string, string> = {
  nominal: 'Normal run',
  level_spoof: 'False raw level',
  dosing_tamper: 'Dosing manipulation',
};

function close(a: number, b: number) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 0.01;
}
function matchesFrame(data: UnityApplied, frame: Frame) {
  if (!data || !data.truth || !data.reported || !data.commands) return false;
  return data.sequence === frame.sequence && data.scenario === frame.scenario && data.elapsed_ms === frame.elapsed_ms &&
    (['tank1_mm', 'tank2_mm', 'tank3_mm', 'color_blue', 'color_yellow'] as const).every(key => close(data.truth[key], frame.truth[key])) &&
    (['tank1_mm', 'color_blue', 'color_yellow'] as const).every(key => close(data.reported[key], frame.reported[key])) &&
    (['plc1_fill_valve', 'plc1_transfer_pump', 'plc2_blue_doser', 'plc2_yellow_doser', 'plc3_transfer_pump'] as const).every(key => data.commands[key] === frame.commands[key]) &&
    data.proxy_target_met === frame.treatment?.proxy_target_met;
}
function labelForScenario(name: string) { return scenarioNames[name] || name.replaceAll('_', ' '); }
function title(text: string) { return text.replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase()); }
function mm(n: number) { return n.toFixed(0) + ' mm'; }
function onOff(value: boolean) { return value ? 'ON' : 'OFF'; }
function qualityValue(quality: Frame['data_quality']['plc1'], text: string) { return quality === 'good' ? text : quality === 'stale' ? 'STALE' : 'NO DATA'; }
function currentRun(runs: Run[], index: number) { return runs.find(run => index >= run.start && index <= run.end) || runs[0]; }
function runsFrom(frames: Frame[]): Run[] {
  const runs: Run[] = [];
  for (let i = 0; i < frames.length; i++) {
    const name = frames[i].scenario || 'replay';
    if (i === 0 || name !== runs[runs.length - 1].name) {
      if (runs.length) runs[runs.length - 1].end = i - 1;
      runs.push({ name, start: i, end: frames.length - 1 });
    }
  }
  return runs;
}
function eventMarks(frames: Frame[], run: Run) {
  const marks = [run.start];
  for (let i = run.start + 1; i <= run.end; i++) {
    const a = frames[i - 1], b = frames[i];
    if (b.event || b.phase !== a.phase || b.attack !== a.attack || b.plc2_stage !== a.plc2_stage) marks.push(i);
  }
  return marks;
}
function caption(frame: Frame) {
  if (frame.event === 'operator_stop') return 'The prepared run stops. Compare restored readings with any remaining modeled deviation.';
  if (frame.event === 'reset_to_initial_conditions') return 'A separate prepared scenario begins from the software model’s starting state.';
  if (frame.attack === 'level_spoof') return 'PLC1 receives a lower raw level than the software model shows; compare the transfer decision with independent tank truth.';
  if (frame.attack === 'dosing_tamper') return 'PLC2 receives a false yellow reading; compare its dosing decision with independent modeled color.';
  if (frame.treatment?.complete_command && !frame.treatment.proxy_target_met) return 'PLC2 says treatment is complete while the independent color target remains unmet.';
  const captions: Record<string, string> = {
    fill: 'PLC1 fills the raw-water tank in the modeled process.',
    transfer: 'PLC1 requests raw-water transfer into Tank 2.',
    dose_blue: 'PLC2 doses blue color proxy into the modeled treatment tank.',
    dose_yellow: 'PLC2 doses yellow color proxy into the modeled treatment tank.',
    settle: 'PLC2 waits before reassessing reported color.',
    treatment_assess: 'PLC2 compares the reported blue and yellow readings.',
    treatment_complete: 'PLC2 hands the treated-water decision to PLC3.',
    delivery: 'PLC3 transfers modeled treated water to Tank 3.',
    stopped: 'The prepared run is stopped.',
  };
  return captions[frame.phase] || 'Inspect what the controllers were told and what the software model shows.';
}
function readouts(frame: Frame, view: View): { operator: Readout[]; floor: Readout[] } {
  const q1 = frame.data_quality.plc1, q2 = frame.data_quality.plc2, q3 = frame.data_quality.plc3;
  const target = frame.treatment?.proxy_target_met ?? (frame.truth.color_blue >= 20 && Math.abs(frame.truth.color_blue - frame.truth.color_yellow) <= 5);
  const complete = frame.treatment?.complete_command ?? frame.plc2_stage === 'COMPLETE';
  if (view === 'raw') return {
    operator: [
      { label: 'Tank 1 · PLC1 reading', value: qualityValue(q1, mm(frame.reported.tank1_mm)), alert: q1 === 'good' && Math.abs(frame.reported.tank1_mm - frame.truth.tank1_mm) > 1 },
      { label: 'Fill valve · command', value: onOff(frame.commands.plc1_fill_valve) },
      { label: 'Transfer pump · command', value: onOff(frame.commands.plc1_transfer_pump) },
    ],
    floor: [
      { label: 'Tank 1 · modeled truth', value: mm(frame.truth.tank1_mm) },
      { label: 'Fill valve · model feedback', value: onOff(frame.actuators.plc1_fill_valve) },
      { label: 'Transfer pump · model feedback', value: onOff(frame.actuators.plc1_transfer_pump) },
    ],
  };
  if (view === 'treatment') return {
    operator: [
      { label: 'Tank 2 · PLC2 reading', value: qualityValue(q2, mm(frame.reported.tank2_mm)) },
      { label: 'Blue / yellow · PLC2 readings', value: qualityValue(q2, String(frame.reported.color_blue) + ' / ' + String(frame.reported.color_yellow)), alert: q2 === 'good' && Math.abs(frame.reported.color_yellow - frame.truth.color_yellow) > 1 },
      { label: 'Blue / yellow dose · commands', value: onOff(frame.commands.plc2_blue_doser) + ' / ' + onOff(frame.commands.plc2_yellow_doser) },
      { label: 'PLC2 treatment complete', value: qualityValue(q2, onOff(complete)), alert: complete && !target },
    ],
    floor: [
      { label: 'Tank 2 · modeled truth', value: mm(frame.truth.tank2_mm) },
      { label: 'Blue / yellow · modeled color', value: String(frame.truth.color_blue) + ' / ' + String(frame.truth.color_yellow) },
      { label: 'Blue / yellow · model feedback', value: onOff(frame.actuators.plc2_blue_doser) + ' / ' + onOff(frame.actuators.plc2_yellow_doser) },
      { label: 'Independent color target', value: target ? 'MET' : 'NOT MET', alert: complete && !target },
    ],
  };
  if (view === 'delivery') return {
    operator: [
      { label: 'Tank 3 · PLC3 reading', value: qualityValue(q3, mm(frame.reported.tank3_mm)) },
      { label: 'PLC2 complete · handoff', value: qualityValue(q2, onOff(complete)), alert: complete && !target },
      { label: 'Transfer pump · command', value: onOff(frame.commands.plc3_transfer_pump) },
      { label: 'Outlet valve · command', value: onOff(frame.commands.plc3_outlet_valve) },
    ],
    floor: [
      { label: 'Tank 3 · modeled truth', value: mm(frame.truth.tank3_mm) },
      { label: 'Transfer pump · model feedback', value: onOff(frame.actuators.plc3_transfer_pump) },
      { label: 'Outlet valve · model feedback', value: onOff(frame.actuators.plc3_outlet_valve) },
      { label: 'Independent color target', value: target ? 'MET' : 'NOT MET', alert: complete && !target },
    ],
  };
  return {
    operator: [
      { label: 'PLC1 raw level', value: qualityValue(q1, mm(frame.reported.tank1_mm)), alert: q1 === 'good' && Math.abs(frame.reported.tank1_mm - frame.truth.tank1_mm) > 1 },
      { label: 'PLC2 blue / yellow', value: qualityValue(q2, String(frame.reported.color_blue) + ' / ' + String(frame.reported.color_yellow)), alert: q2 === 'good' && Math.abs(frame.reported.color_yellow - frame.truth.color_yellow) > 1 },
      { label: 'PLC2 complete handoff', value: qualityValue(q2, onOff(complete)), alert: complete && !target },
      { label: 'PLC3 pump · command', value: onOff(frame.commands.plc3_transfer_pump) },
    ],
    floor: [
      { label: 'Tank 1 / 2 / 3 · model', value: [frame.truth.tank1_mm, frame.truth.tank2_mm, frame.truth.tank3_mm].map(n => n.toFixed(0)).join(' / ') + ' mm' },
      { label: 'Blue / yellow · model', value: String(frame.truth.color_blue) + ' / ' + String(frame.truth.color_yellow) },
      { label: 'Color target · model', value: target ? 'MET' : 'NOT MET', alert: complete && !target },
      { label: 'PLC3 pump · model feedback', value: onOff(frame.actuators.plc3_transfer_pump) },
    ],
  };
}
function inspectorRows(frame: Frame, selected: EquipmentId): Readout[] {
  const overview = readouts(frame, equipment.find(item => item.id === selected)?.view || 'overview');
  if (selected === 'network') return [
    { label: 'Replay source', value: 'Synthetic offline file' },
    { label: 'PLC1 location', value: 'Site A' },
    { label: 'PLC2 + PLC3 location', value: 'Site B' },
    { label: 'Simulator PLC raw-level path', value: 'Under validation' },
  ];
  return [...overview.operator.slice(0, 2), ...overview.floor.slice(0, 2)];
}

export function MiniWaterTheater({ frames, index, playing, speed, onSpeedChange, onJump, onTogglePlay, standalone = false }: {
  frames: Frame[]; index: number; playing: boolean; speed: PlaybackSpeed; onSpeedChange: (speed: PlaybackSpeed) => void;
  onJump: (index: number) => void; onTogglePlay: () => void; standalone?: boolean;
}) {
  const frame = frames[index];
  const runs = useMemo(() => runsFrom(frames), [frames]);
  const run = currentRun(runs, index);
  const marks = useMemo(() => eventMarks(frames, run), [frames, run]);
  const previousEvent = [...marks].reverse().find(mark => mark < index);
  const nextEvent = marks.find(mark => mark > index);
  const [view, setView] = useState<View>('overview');
  const [selected, setSelected] = useState<EquipmentId>('network');
  const [tour, setTour] = useState(false);
  const [layout, setLayout] = useState<Layout>('embedded');
  const [opened, setOpened] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<UnityApplied | null>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const theater = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const relayKey = useRef<(key: string) => void>(() => {});
  const selectedFrame = useRef(frame);
  const selectedEquipment = equipment.find(item => item.id === selected) || equipment[2];
  const evidence = readouts(frame, view);
  const synced = status === 'ready' && applied !== null && matchesFrame(applied, frame);
  const localTime = (frame.elapsed_ms - frames[run.start].elapsed_ms) / 1000;

  useEffect(() => { selectedFrame.current = frame; }, [frame]);
  useEffect(() => {
    if (layout === 'embedded') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [layout]);
  useEffect(() => {
    const node = theater.current;
    if (layout === 'embedded') {
      returnFocus.current?.focus();
      returnFocus.current = null;
      return;
    }
    if (!node) return;
    node.focus();
    const focusable = () => Array.from(node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'))
      .filter(item => item.getClientRects().length > 0 && !item.hasAttribute('inert'));
    const onModalKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setLayout('embedded');
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0] || node;
      const last = items[items.length - 1] || node;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || active === node || !node.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!node.contains(event.target as Node)) node.focus();
    };
    document.addEventListener('keydown', onModalKeyDown, true);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onModalKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [layout]);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return;
      const data = event.data;
      if (data?.type === 'sphere.miniwater.unity.ready') setStatus('ready');
      if (data?.type === 'sphere.miniwater.unity.applied') {
        const received = data as UnityApplied;
        setApplied(received);
        if (received.sequence === selectedFrame.current.sequence && !matchesFrame(received, selectedFrame.current)) {
          setError('The 3D scene reported a different sample. Continue with the 2D trace while this is checked.');
          setStatus('error');
        }
      }
      if (data?.type === 'sphere.miniwater.unity.picked') {
        const picked = data.equipmentId as EquipmentId;
        const item = equipment.find(candidate => candidate.id === picked);
        if (item) { setSelected(picked); setView(item.view); }
      }
      if (data?.type === 'sphere.miniwater.unity.key' && typeof data.key === 'string') relayKey.current(data.key);
      if (data?.type === 'sphere.miniwater.unity.error') {
        setError(typeof data.message === 'string' ? data.message : 'The 3D scene could not load.');
        setStatus('error');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  useEffect(() => {
    if (status !== 'ready') return;
    iframe.current?.contentWindow?.postMessage({ type: 'sphere.miniwater.frame.v1', frame }, window.location.origin);
  }, [frame, status]);
  useEffect(() => {
    if (status !== 'ready') return;
    iframe.current?.contentWindow?.postMessage({ type: 'sphere.miniwater.unity.view', view }, window.location.origin);
  }, [view, status]);
  useEffect(() => {
    if (status !== 'ready') return;
    iframe.current?.contentWindow?.postMessage({ type: 'sphere.miniwater.unity.select', equipmentId: selected }, window.location.origin);
  }, [selected, status]);
  useEffect(() => {
    if (status !== 'ready') return;
    iframe.current?.contentWindow?.postMessage({ type: 'sphere.miniwater.unity.tour', on: tour }, window.location.origin);
  }, [tour, status]);
  useEffect(() => {
    if (!opened || status !== 'loading') return;
    const timeout = window.setTimeout(() => {
      setError('The 3D scene did not finish loading. The detailed 2D trace remains available.');
      setStatus('error');
    }, 90000);
    return () => window.clearTimeout(timeout);
  }, [opened, status, attempt]);

  const chooseView = (next: View) => {
    setView(next);
    setSelected(views.find(item => item.id === next)?.equipment || 'network');
  };
  const chooseEquipment = (id: EquipmentId) => {
    setSelected(id);
    setView(equipment.find(item => item.id === id)?.view || 'overview');
  };
  const changeLayout = (next: Layout) => {
    if (layout === 'embedded' && next !== 'embedded') returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLayout(next);
  };
  const dispatchKey = useCallback((key: string) => {
    if (key === 'Escape' && layout !== 'embedded') { setLayout('embedded'); return true; }
    const keyView = views.find(item => item.key === key);
    if (keyView) { setView(keyView.id); setSelected(keyView.equipment); return true; }
    if (key === ' ' || key === 'Space' || key === 'Spacebar') { onTogglePlay(); return true; }
    if (key === 'ArrowLeft' && previousEvent !== undefined) { onJump(previousEvent); return true; }
    if (key === 'ArrowRight' && nextEvent !== undefined) { onJump(nextEvent); return true; }
    return false;
  }, [layout, onTogglePlay, previousEvent, nextEvent, onJump]);
  useEffect(() => { relayKey.current = dispatchKey; }, [dispatchKey]);
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.closest('input, select, textarea, a, [contenteditable="true"]')) return;
    if (target.closest('button') && (event.key === ' ' || event.key === 'Enter')) return;
    if (dispatchKey(event.key)) event.preventDefault();
  };
  const retry = () => { setApplied(null); setError(''); setStatus('loading'); setAttempt(value => value + 1); };
  const runLabel = labelForScenario(run.name);
  const alert = frame.attack !== 'none' || (frame.treatment?.complete_command && !frame.treatment.proxy_target_met);
  const stageClass = [styles.theater, layout === 'large' ? styles.theaterLarge : '', layout === 'workspace' ? styles.theaterWorkspace : ''].filter(Boolean).join(' ');

  return <div ref={theater} className={stageClass} id="unity-view" tabIndex={0} onKeyDown={keyboard} role={layout === 'embedded' ? 'region' : 'dialog'} aria-modal={layout === 'embedded' ? undefined : true} aria-label="MiniWater 3D theater">
    <div className={styles.theaterHead}>
      <div><small>SPHERE ICS · THREE CONTROLLERS · TWO FACILITIES</small><h3>MiniWater control theater</h3><p>One synthetic replay clock drives the Unity floor and {standalone ? 'the operator and model readouts.' : 'the detailed 2D trace.'}</p></div>
      <div className={styles.theaterHeadActions}>
        <span className={synced ? styles.theaterSynced : styles.theaterStatus} role="status">{synced ? '3D synchronized' : opened && status === 'ready' ? 'Synchronizing 3D' : status === 'error' ? '3D unavailable' : 'Offline software preview'}</span>
        <button type="button" onClick={() => changeLayout(layout === 'large' ? 'embedded' : 'large')}>{layout === 'large' ? 'Close large view' : 'Large 3D'}</button>
        <button type="button" onClick={() => changeLayout(layout === 'workspace' ? 'embedded' : 'workspace')}>{layout === 'workspace' ? 'Close workspace' : 'Workspace'}</button>
      </div>
    </div>
    <div className={styles.theaterScenarioBar} role="group" aria-label="Prepared replay scenario">
      <span>PREPARED RUN</span>
      {runs.map(item => <button key={item.name} type="button" aria-pressed={item.name === run.name} onClick={() => onJump(item.start)}>{labelForScenario(item.name)}</button>)}
      <small>All values are replayed from a synthetic offline file.</small>
    </div>
    <div className={styles.theaterViewBar} role="group" aria-label="3D camera view">
      {views.map(item => <button key={item.id} type="button" aria-pressed={item.id === view} onClick={() => chooseView(item.id)}><kbd>{item.key}</kbd> {item.label}</button>)}
      <button type="button" aria-pressed={tour} onClick={() => setTour(!tour)}>Camera tour {tour ? 'ON' : 'OFF'}</button>
    </div>
    <div className={styles.theaterBody}>
      <nav className={styles.theaterEquipment} aria-label="Equipment tree">
        <h4>Equipment tree</h4>
        {equipment.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => chooseEquipment(item.id)}><span>{item.site}</span>{item.label}</button>)}
      </nav>
      <div className={styles.theaterStageColumn}>
        <div className={styles.theaterStage}>
          {!opened ? <div className={styles.theaterStart}>
            <span>3D FLOOR · MODEL RENDERING</span>
            <div className={styles.theaterStartDiagram} aria-hidden="true"><div><small>SITE A · PLC1</small><i /><b>RAW</b></div><em>→</em><div><small>SITE B · PLC2</small><i /><b>TREATMENT</b></div><em>→</em><div><small>SITE B · PLC3</small><i /><b>DELIVERY</b></div></div>
            <p>Explore the raw source, treatment tank, and delivery tank as one routed process. The floor follows modeled truth; the panel beside it shows what the controllers were told.</p>
            <button type="button" onClick={() => { setApplied(null); setStatus('loading'); setOpened(true); }}>Load 3D floor</button>
          </div> : <>
            <iframe key={attempt} ref={iframe} src="/sphere/miniwater-3d/index.html?rev=b0be6c1c363143593d1b96b052c303e81fd05231" title="MiniWater Unity three-tank floor synchronized with the selected replay sample" loading="lazy" allow="fullscreen" />
            {status === 'loading' && <p className={styles.theaterOverlay} role="status">Loading Unity floor…</p>}
            {status === 'error' && <div className={styles.theaterOverlay} role="alert"><p>{error}</p><button type="button" onClick={retry}>Retry 3D floor</button><a href={standalone ? '/sphere/miniwater-demo/#detail-replay' : '#detail-replay'}>Use detailed 2D trace</a></div>}
          </>}
        </div>
        <div className={styles.theaterCaption} aria-live="polite">
          <span className={alert ? styles.theaterAlertTag : styles.theaterNormalTag}>{frame.attack !== 'none' ? title(frame.attack) : frame.treatment?.complete_command && !frame.treatment.proxy_target_met ? 'MODELED TARGET NOT MET' : title(frame.phase)}</span>
          <strong>{title(frame.phase)}</strong>
          <p>{caption(frame)}</p>
        </div>
      </div>
      <aside className={styles.theaterSide} aria-label="Operator display and modeled floor evidence">
        <div className={styles.theaterEvidence}>
          <h4>Operator readings <small>replay values + commands</small></h4>
          {evidence.operator.map(row => <div key={row.label} className={row.alert ? styles.theaterReadoutAlert : styles.theaterReadout}><span>{row.label}</span><strong>{row.value}</strong></div>)}
        </div>
        <div className={styles.theaterEvidence}>
          <h4>Modeled floor <small>independent software truth + feedback</small></h4>
          {evidence.floor.map(row => <div key={row.label} className={row.alert ? styles.theaterReadoutAlert : styles.theaterReadout}><span>{row.label}</span><strong>{row.value}</strong></div>)}
        </div>
        <div className={styles.theaterInspector} aria-live="polite">
          <small>INSPECTOR · {selectedEquipment.site}</small>
          <h4>{selectedEquipment.label}</h4>
          <p>{selectedEquipment.description}</p>
          {inspectorRows(frame, selected).map(row => <div key={row.label} className={row.alert ? styles.theaterReadoutAlert : styles.theaterReadout}><span>{row.label}</span><strong>{row.value}</strong></div>)}
        </div>
      </aside>
    </div>
    <div className={styles.theaterTransport}>
      <button type="button" onClick={onTogglePlay} aria-keyshortcuts="Space">{playing ? 'Pause' : 'Play'} replay</button>
      <div className={styles.theaterSpeed} role="group" aria-label="Replay speed">
        {([1, 4, 10] as const).map(value => <button key={value} type="button" aria-pressed={speed === value} onClick={() => onSpeedChange(value)}>{value}×</button>)}
      </div>
      <button type="button" onClick={() => previousEvent !== undefined && onJump(previousEvent)} disabled={previousEvent === undefined} aria-label="Previous event">← Event</button>
      <input type="range" aria-label="Position within prepared run" min="0" max={Math.max(0, run.end - run.start)} value={index - run.start} onChange={event => onJump(run.start + Number(event.target.value))} />
      <button type="button" onClick={() => nextEvent !== undefined && onJump(nextEvent)} disabled={nextEvent === undefined} aria-label="Next event">Event →</button>
      <span className={styles.theaterClock}><b>T+{(frame.elapsed_ms / 1000).toFixed(1)} s</b><small>{runLabel} · {localTime.toFixed(1)} s in run</small></span>
    </div>
    <p className={styles.theaterFoot}>Use <kbd>0</kbd>–<kbd>3</kbd> for views, <kbd>Space</kbd> to play or pause, <kbd>←</kbd>/<kbd>→</kbd> for events, and <kbd>Esc</kbd> to close a large view. This is a software-model replay; it has no live equipment controls. The separate simulator PLC raw-level path remains under validation. {standalone ? <a href="/sphere/miniwater-demo/">Read the full walkthrough ↗</a> : <a href="/sphere/miniwater-theater/" target="_blank" rel="noopener noreferrer">Open full theater ↗</a>}</p>
  </div>;
}
