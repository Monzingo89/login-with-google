# login-with-google

Reusable Firebase Google authentication for React applications, with a separate optional VCV theme.

## Packages

- `login-with-google`: this repository root; responsive login components and Firebase Auth client
- `login-with-google-vcv-theme`: optional black/gold CSS theme

The core package accepts either Firebase web configuration or an existing Firebase `Auth` instance. That lets VCV reuse its current Firebase project while other consumers provide their own.

```bash
npm install login-with-google firebase react react-dom
```

Until the npm release is published, the public GitHub repository can be installed directly:

```bash
npm install github:Monzingo89/login-with-google
```

See [`packages/login-with-google/README.md`](packages/login-with-google/README.md) for usage. Copy [`.env.example`](.env.example) for the required public Firebase web configuration.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
npm run pack:check
```
