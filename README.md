# Orbital Registry

The contract treats knowledge as a maintained ledger, with indexed entries, source checks and read models that make the registry usable from the UI.

A 3D registry for indexed entities, public attestations and orbital GenLayer evidence views.

## Orbital Registry Brief

This repo is organized for review: the app can be opened locally, the contract source is present, and the deployed Studionet address is pinned in `deployment.json`.

- Folder: `projects/37-orbital-registry`
- Frontend shape: Next/Vite-style app folder
- Contract source: `contracts/orbitalregistry_v2.py`
- Build status: Schema-valid strong V2 contract; deploy finalized; 13 smoke writes finalized including GenLayer review/challenge/appeal; read tests passed.
- Logo asset: Existing project assets

## Registry Mechanics

OrbitalRegistry V2 (# v0.2.16), schema-valid strong lifecycle contract with JSON-backed cases/evidence/reviews/challenges/appeals/audits/profiles, GenLayer web render + prompt-comparative reasoning, legacy frontend wrappers and reputation scoring.

- Primary source: `contracts/orbitalregistry_v2.py` (29,765 bytes)
- Public write/action methods: 15
- Read methods: 20
- GenLayer features: live web rendering, LLM adjudication, indexed storage, append-only collections

Typical flow: `create_case` -> `open_challenge_window` -> `submit_challenge` -> `review_with_genlayer` -> `resolve_challenge_with_genlayer` -> `submit_appeal` -> `archive_case`

Useful reads: `get_case_count`, `get_case`, `get_case_record`, `get_evidence`, `get_reviews`, `get_challenges`, `get_appeals`, `get_audit_log`

## Contract Receipt

- Network: studionet (61999)
- Contract: [0xEa753d1D297D2c4877Fd168c376C0412A07ECd97](https://explorer-studio.genlayer.com/contracts/0xEa753d1D297D2c4877Fd168c376C0412A07ECd97)
- Deploy tx: [0xb736e59a...320493](https://explorer-studio.genlayer.com/tx/0xb736e59af7fbf3827759a17081b48285f626f4e22f2292311b4414f5ce320493)
- Deployed at: 2026-06-24T17:31:00.713Z
- Smoke writes recorded: 13

Smoke coverage:

- configure_protocol: [0x9be14dfc...56f9ab](https://explorer-studio.genlayer.com/tx/0x9be14dfc3956fa01a90562e50ecccbdec82199de724147365534fa2e4556f9ab)
- create_case: [0x39fe286f...297d44](https://explorer-studio.genlayer.com/tx/0x39fe286fe682375f46fbbbd4f9b04b4f7ddb8dbfc40e07c8f0a7a0ce01297d44)
- add_evidence_web: [0x70154329...3f263d](https://explorer-studio.genlayer.com/tx/0x7015432966f52dc19cab5ccb6df78b02634e9ce7d38bf66730674761663f263d)
- add_evidence_security: [0x4ffc761a...64c407](https://explorer-studio.genlayer.com/tx/0x4ffc761ae86d647eb572b5694959ea8cc9fc8e01aa2e13058314df999364c407)
- add_evidence_whitepaper: [0x3705688e...1235b5](https://explorer-studio.genlayer.com/tx/0x3705688e9166adf24146328f655eae2afe6322f808c995970405ccb6f61235b5)
- review: [0x9dc59ed4...faaea5](https://explorer-studio.genlayer.com/tx/0x9dc59ed4d5114d0f827c20520a3c3c1568146281b69d07905911203710faaea5)

## Operator Preview

```powershell
cd <this-repository-folder>
npm install
npm run dev
```

Open the dev server URL printed by npm.

## Public Release

- Repository: <https://github.com/aspro45/orbital-registry>
- Live app: <https://orbital-registry.vercel.app>
- Framework: Next.js
- Build: `npm run build`

## Public Repo Safety

The repo is designed for public GitHub/Vercel release. Keep `.env`, `.vercel/`, wallet vaults, private keys and local dashboard state out of git. The publisher script enforces these ignore rules before it pushes.
