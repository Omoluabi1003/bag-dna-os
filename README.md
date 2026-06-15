# BAG-DNA OS

Digital Baggage Identity and Chain-of-Custody intelligence for modern
aviation. This deployable MVP combines an executive operations dashboard,
identity registry, custody ledger, AI risk scoring, an airport GIS digital
twin, passenger tracking, and security intelligence.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production checks

```bash
npm run typecheck
npm run build
```

## Integration configuration

The application currently uses deterministic mock data. Production adapters
can be connected through the contracts in `lib/integrations.ts`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GIS_ENDPOINT=
```

The project is compatible with Vercel and includes a web app manifest and
scalable SVG application icon for PWA installation.
