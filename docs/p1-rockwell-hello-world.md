# Rockwell P1 hello-world replay

Public route: `/sphere/p1-hello-world/`.

A self-guided tutorial built on the October 10, 2026 P1 test on the SPHERE
Rockwell pair. The source capture has SHA-256
`dbce0fdc0032a9afa55537d1f845db0c17b15f3653114295473348e76f173e47` and stays in
the controlled experiment record.

To regenerate the public extract from an authorized local copy of that capture:

```sh
node scripts/build-p1-replay-data.mjs /path/to/integrated-live.csv
```

The script checks the source digest, all 42 ordered samples, the phase counts
(8 baseline, 7 level raised, 11 Start, 16 back to normal), that the controller
output and simulator input agree during Start, that no sampled fault or
tank-model activity occurred, and that everything returns to idle. It writes
the teaching fields with relative times to `src/data/p1-rockwell-replay.json`
and `public/demos/p1-rockwell-replay-42-samples.csv`. Credentials, network
addresses, UTC timestamps and the original CSV stay out of both files.

What the test shows: with Start on and the level reading inside the controller's
300–500 mm fill band, PLC 1 commands the fill valve, and the command appears on
PLC 2's input (slot 5, point 0). The level reading reaches PLC 1 on analog
slot 7, channel 0. Values are read from PLC memory; the stimulus was a script
that set the level and Start. Step 4's attack is an illustration built on that
setup. A guided live-HMI session is a separate experiment with its own access
and checks.

Participant path: open the route without signing in; follow steps 1–5; answer
the checks; download the CSV. Repeat a clean-browser walkthrough against the
deployed URL after each publication.
