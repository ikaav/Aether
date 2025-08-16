Aether Desktop Helper (Electron)

Privacy-first Electron skeleton that collects hashed window titles locally and only uploads with explicit consent.

Highlights
- Local-only by default. Nothing leaves your device unless you opt in.
- Per-device salt; raw window titles are never stored.
- Simple consent dialog on first run with clear choices.
- IPC API to hash, store, purge, and request upload (simulated to local file).
- Daily scheduled cleanup of telemetry older than 30 days.

Develop
1. npm install
2. npm run start

Tests
- node tests/run-tests.js
