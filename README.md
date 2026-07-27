# login-with-google

Reusable Firebase Google authentication for React applications. The optional
black-and-gold presentation package lives separately in
[`Monzingo89/login-with-google-theme`](https://github.com/Monzingo89/login-with-google-theme).

The core package accepts either Firebase web configuration or an existing Firebase `Auth` instance. That lets VCV reuse its current Firebase project while other consumers provide their own.

```bash
npm install login-with-google firebase react react-dom
```

Until the npm release is published, the public GitHub repository can be installed directly:

```bash
npm install github:Monzingo89/login-with-google
```

See [`packages/login-with-google/README.md`](packages/login-with-google/README.md) for usage. Copy [`.env.example`](.env.example) for the required public Firebase web configuration.

To add the optional theme:

```bash
npm install login-with-google-theme
```

```ts
import 'login-with-google/base.css';
import 'login-with-google-theme/theme.css';
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
npm run pack:check
```
