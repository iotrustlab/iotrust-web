/**
 * Produce a public teaching extract from the private October 10 P1 capture.
 *
 * Usage:
 *   node scripts/build-p1-replay-data.mjs /path/to/integrated-live.csv
 *
 * The source file is never copied into this repository. The expected digest
 * and observation rules are pinned to the run's reviewed evidence note.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const expectedSha256 = 'dbce0fdc0032a9afa55537d1f845db0c17b15f3653114295473348e76f173e47';
const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error('Usage: node scripts/build-p1-replay-data.mjs /path/to/integrated-live.csv');
  process.exit(2);
}

const raw = readFileSync(sourcePath);
const digest = createHash('sha256').update(raw).digest('hex');
if (digest !== expectedSha256) throw new Error(`Unexpected source digest: ${digest}`);

const lines = raw.toString('utf8').trim().split(/\r?\n/);
const headers = lines.shift().split(',');
const index = Object.fromEntries(headers.map((name, i) => [name, i]));
const required = [
  'at_utc', 'phase', 'ctrl_P1.RW_Tank_tnk_lvl', 'ctrl_P1_SYS.IDLE',
  'ctrl_P1_SYS.START', 'ctrl_P1_SYS.RUNNING', 'ctrl_HMI.Start_PB',
  'ctrl_P1.RW_Tank_PR_Valve', 'ctrl_Local:5:O.Data',
  'sim_Local:5:I.Data', 'sim_P1.RW_Tank_PR_Valve_sts',
  'ctrl_Local:5:I.Fault', 'sim_Local:5:I.Fault',
  'sim_Start_Sim', 'sim_Start_ACTIVE',
];
for (const field of required) if (!(field in index)) throw new Error(`Missing field ${field}`);

const bool = value => value === 'True' || value === 'true' || value === '1';
const field = (cells, name) => cells[index[name]];
const t0 = Date.parse(lines[0].split(',')[index.at_utc]);
if (!Number.isFinite(t0)) throw new Error('Invalid first timestamp');

const samples = lines.map((line, sample) => {
  const cells = line.split(',');
  if (cells.length !== headers.length) throw new Error(`Malformed row ${sample + 1}`);
  const elapsedMs = Math.round((Date.parse(field(cells, 'at_utc')) - t0) * 10) / 10;
  const stateFlags = ['IDLE', 'START', 'RUNNING'].filter(name => bool(field(cells, `ctrl_P1_SYS.${name}`)));
  if (stateFlags.length !== 1) throw new Error(`Ambiguous controller state at row ${sample + 1}`);
  const outWord = Number(field(cells, 'ctrl_Local:5:O.Data'));
  const inWord = Number(field(cells, 'sim_Local:5:I.Data'));
  if (!Number.isInteger(outWord) || !Number.isInteger(inWord)) throw new Error(`Invalid digital word at row ${sample + 1}`);
  const sampleRecord = {
    sample: sample + 1,
    elapsedMs,
    phase: field(cells, 'phase'),
    levelMm: Math.round(Number(field(cells, 'ctrl_P1.RW_Tank_tnk_lvl')) * 100) / 100,
    controllerState: stateFlags[0],
    scriptedStart: bool(field(cells, 'ctrl_HMI.Start_PB')),
    valveCommand: bool(field(cells, 'ctrl_P1.RW_Tank_PR_Valve')),
    controllerOutputBit0: Boolean(outWord & 1),
    simulatorInputBit0: Boolean(inWord & 1),
  };
  if (bool(field(cells, 'ctrl_Local:5:I.Fault')) || bool(field(cells, 'sim_Local:5:I.Fault')) || bool(field(cells, 'sim_Start_Sim')) || bool(field(cells, 'sim_Start_ACTIVE'))) {
    throw new Error(`Fault or model activation at row ${sample + 1}`);
  }
  if (sampleRecord.phase === 'start' && !bool(field(cells, 'sim_P1.RW_Tank_PR_Valve_sts'))) {
    throw new Error(`Simulator valve status missing at row ${sample + 1}`);
  }
  return sampleRecord;
});

const counts = Object.fromEntries(['baseline', 'level_only', 'start', 'restored'].map(phase => [phase, samples.filter(s => s.phase === phase).length]));
if (samples.length !== 42 || JSON.stringify(counts) !== JSON.stringify({ baseline: 8, level_only: 7, start: 11, restored: 16 })) {
  throw new Error(`Unexpected sample/phase counts: ${samples.length}, ${JSON.stringify(counts)}`);
}
if (samples.some((s, i) => i > 0 && s.elapsedMs <= samples[i - 1].elapsedMs)) throw new Error('Non-monotonic sample time');
if (samples.some((s, i) => i > 0 && ['baseline', 'level_only', 'start', 'restored'].indexOf(s.phase) < ['baseline', 'level_only', 'start', 'restored'].indexOf(samples[i - 1].phase))) throw new Error('Phase order changed');
if (samples.filter(s => s.phase === 'start').some(s => s.controllerState !== 'RUNNING' || !s.valveCommand || !s.controllerOutputBit0 || !s.simulatorInputBit0)) {
  throw new Error('Start-phase witness mismatch');
}
const last = samples.at(-1);
if (last.phase !== 'restored' || last.controllerState !== 'IDLE' || last.valveCommand || last.controllerOutputBit0 || last.simulatorInputBit0 || Math.abs(last.levelMm - 200) > 1) {
  throw new Error('Baseline was not restored');
}

const bundle = {
  title: 'Rockwell P1 bounded controller response',
  sourceSha256: expectedSha256,
  observedOn: '2026-10-10 MDT',
  captureKind: 'two physical ControlLogix PLCs, scripted tag stimulus, simulated process stopped',
  sampleCount: samples.length,
  phaseCounts: counts,
  fields: 'Teaching extract. UTC timestamps, network identifiers, other tags, and original source CSV are not included.',
  samples,
};

const jsonPath = resolve('src/data/p1-rockwell-replay.json');
const csvPath = resolve('public/demos/p1-rockwell-replay-42-samples.csv');
mkdirSync(dirname(jsonPath), { recursive: true });
mkdirSync(dirname(csvPath), { recursive: true });
writeFileSync(jsonPath, JSON.stringify(bundle, null, 2) + '\n');
const keys = Object.keys(samples[0]);
writeFileSync(csvPath, keys.join(',') + '\n' + samples.map(s => keys.map(key => s[key]).join(',')).join('\n') + '\n');
console.log(`Wrote ${samples.length} verified samples (${digest})`);
