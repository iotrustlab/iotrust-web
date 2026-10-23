# Rockwell P1 hello-world replay

Public route: `/sphere/p1-hello-world/`.

This is a self-guided, read-only exercise based on the reviewed October 10,
2026 bounded P1 witness. The source capture has SHA-256
`dbce0fdc0032a9afa55537d1f845db0c17b15f3653114295473348e76f173e47`.
The original full-column capture stays in the controlled experiment record.

To regenerate the public extract from an authorized local copy of that capture:

```sh
node scripts/build-p1-replay-data.mjs /path/to/integrated-live.csv
```

The script checks the source digest, all 42 ordered samples, phase counts
(8 baseline, 7 level-only, 11 Start, 16 restored), Start-phase output/input
agreement, absence of sampled faults or tank-model activation, and final idle
restoration. It writes only selected teaching fields with relative timestamps
to `src/data/p1-rockwell-replay.json` and
`public/demos/p1-rockwell-replay-42-samples.csv`. Neither output contains
credentials, network addresses, exact UTC timestamps, or the original CSV.

The observed result is a controller output bit matching a simulator PLC input
bit while the controller reports RUNNING. This is an I/O-image observation,
not a terminal electrical measurement. The stimulus was scripted tag control,
not a FactoryTalk HMI interaction, an attack, or a complete tank cycle. A
guided live-HMI rehearsal is a separate experiment and requires its own
access, observations, stop result, and postcheck.

Participant path: open the route without signing in; read the setup; play or
scrub the four phases; answer both observation checks; download the filtered
CSV. A clean-browser walkthrough must be repeated against the deployed URL
after publication. Building the static page alone does not establish that a
fresh visitor can use it.
