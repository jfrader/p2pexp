# Create and store invoices with Autopass

Create an invoice with your details and BTC address.
Autopass stores each invoice in your local vault.
Copy the payment address or show its QR code.

# Concept

Done:

- Each invoice is one Autopass entry with the sender, customer, description, total, asset and payment status

Todo ideas:

- Connect two vaults over Pear so invoices arrive automatically and payment status stays in sync
- Create payment channels between Pear peers that can sync multiple invoices at the same time
- Export invoices as PDF
- Check the invoice address on the blockchain and mark it paid when the payment lands
- Support other cryptocurrencies and networks
- Convert to fiat rates

# Quick start

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

# References

- Worker boilerplate: https://github.com/holepunchto/hello-pear-worker
- Renderer IPC example: https://github.com/holepunchto/hello-pear-worker#starting-the-worker
- Preload bridge API: https://github.com/holepunchto/hello-pear-electron/blob/main/electron/preload.js

# Used AI assistance for
- research, boilerplate, tests, QA and code review.
