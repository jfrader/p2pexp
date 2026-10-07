# p2pexp

Create and share Bitcoin payment requests, with a QR and copy-to-clipboard. Stored
in a local Autopass vault.

Requires Node 24 and npm. From this directory:

```sh
npm install
npm --prefix frontend install
```

Start the dev app (Vite at 127.0.0.1:5173 + Electron):

```sh
npm run dev
```

# Scripts

- `npm run lint` frontend ESLint
- `npm run typecheck` frontend TypeScript
- `npm run test` unit tests + Electron e2e
- `npm run format` Prettier
- `npm run build` frontend production build
- `npm start` run the built app
- `npm run package` unpacked app in `out/`

# Boilerplate

- `electron/main.js`, `electron/preload.js`: from the upstream Pear desktop starter
  (`holepunchto/hello-pear-electron`, commit `ed9dc470d60c495530173e2a4bc7c85b2cb6dd00`).
  Added: clipboard IPC, external links open in the system browser, a hidden `--cdp-port`
  flag for the e2e test.
- `workers/main.js`: the starter's worker plus an Autopass instance (list/add/remove,
  live updates).
- `frontend/src/autopass/bridge.ts`, `frontend/src/bridge.d.ts`: the starter's
  renderer/worker IPC pattern.
- Used AI for: Vite + Pear boilerplate, `bridge.d.ts`, and the Playwright e2e test.
