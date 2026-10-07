# p2pexp

Blank desktop scaffold. React and Material UI are installed; no expense, pairing, or networking application behavior is implemented.

Requires Node 24 and npm. From this directory:

```sh
npm install
npm --prefix frontend install
npm run dev
```

`npm run dev` starts Vite at `127.0.0.1:5173` and then Electron. For a built renderer, use `npm start`. Both desktop commands disable automatic updates. To check or package without launching a window, run `npm run lint`, `npm run typecheck`, `npm run build`, or `npm run package`. The package command creates an unpacked app in `out/`; it does not create installers, sign, or publish it.

The renderer was generated with `create-vite`'s `react-ts` template and reduced to a white, empty React root. `electron/main.js`, `electron/preload.js`, and `workers/main.js` were copied from the upstream Pear desktop starter at commit `ed9dc470d60c495530173e2a4bc7c85b2cb6dd00`; only the automatic DevTools opening was removed. The `upgrade` key was allocated locally with `pear touch`; nothing was staged, seeded, provisioned, or published. AI assistance was limited to this scaffold/configuration and blank root, not application implementation.
