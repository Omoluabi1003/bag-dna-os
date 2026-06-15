# BAG-DNA OS™

**Every passenger has an identity. Every bag should too.**

BAG-DNA OS is the digital identity, AI chain-of-custody, GIS digital twin, and aviation security intelligence operating system for checked baggage. It is developed by **ETL GIS Consulting LLC** for airports, airlines, aviation authorities, customs and border agencies, insurers, security teams, and passengers.

## Category position

BAG-DNA OS is designed as the aviation equivalent of four category-defining platforms:

- **CrowdStrike for baggage security:** continuous threat detection, anomaly investigation, identity verification, and defensible custody evidence.
- **Palantir for baggage intelligence:** a unified decision layer across airline, airport, agency, staff, route, and sensor data.
- **ArcGIS for baggage operations:** a live geospatial digital twin for commanding baggage movement, facilities, risk corridors, and operational assets.
- **Stripe-like infrastructure for baggage identity:** a programmable trust layer for issuing, verifying, and reconciling persistent bag identities across aviation workflows.

Together, these capabilities create one identity graph, one evidence chain, and one operational truth for every bag in motion.

## The problem

Conventional paper baggage tags can be photographed, cloned, stolen, diverted, or attached to another bag. Fragmented airport systems make these substitutions difficult to detect and expose aviation stakeholders to theft, narcotics trafficking, insider manipulation, passenger misidentification, legal claims, and reputational harm.

## The solution

BAG-DNA OS assigns each checked bag a persistent digital identity linked to its journey and physical attributes. Multi-sensor custody events continuously reconcile RFID/NFC, computer vision, weight, dimensions, tamper seal, location, route, and authorized staff interactions.

## The BAG-DNA operating protocol

1. Issue a Digital Baggage Identity at check-in.
2. Bind the passenger reference, flight, physical bag, secure tag, RFID, NFC, rotating QR, tamper seal, and visual fingerprint.
3. Verify every checkpoint scan against expected route, weight, appearance, seal, custody stage, and authorized handler.
4. Detect identity mismatch, credential cloning, route inconsistency, unauthorized access, or custody gaps.
5. Preserve each issuance, validation, transfer, alert, and claim as a hash-linked evidence event.
6. Give passengers clear visibility into the last verified scan, seal integrity, visual confidence, and claim readiness.

The interactive protocol is demonstrated at `/tagging`, `/fingerprint`, `/scanner`, `/mismatch-lab`, `/custody`, `/tamper-seals`, `/passenger`, and `/ledger`.

## Core modules

- Digital Baggage Identity Registry and individual intelligence profiles
- AI visual baggage fingerprinting and explainable risk scoring
- Multi-sensor chain-of-custody operations center
- ArcGIS-ready airport digital twin and global risk corridors
- Mobile-first passenger visibility and claim verification
- Tamper-evident evidence ledger
- Smart NFC/QR tamper seals and secure rotating baggage tags
- Staff geofencing and insider-threat pattern monitoring
- Executive aviation command dashboard and pilot deployment workspace

## Technology

- Next.js 15, React 19, TypeScript, App Router
- Tailwind CSS, Framer Motion, Lucide React, Recharts
- PWA manifest and Vercel-compatible production build
- Supabase-ready environment and modular mock-data architecture
- ArcGIS Online, Enterprise, Velocity, Indoors, and Experience Builder integration boundary

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The MVP operates without external service credentials.

## Production checks

```bash
npm run lint
npm run typecheck
npm run build
```

### Refreshing cached social previews

Social platforms cache Open Graph and Twitter link previews, so metadata or
image changes may not appear immediately. After deployment, test a cache-busted
URL such as `https://bag-dna-os.vercel.app/?v=2` to request a refreshed preview.

## Deployment targets

### Vercel (primary and full-feature target)

Vercel is the production target for BAG-DNA OS. The repository contains a root-level `package.json`, and the standard `npm run build` command produces the `.next` application. Use these exact settings in **Vercel → Project Settings**:

| Setting | Required value |
| --- | --- |
| Git repository | `Omoluabi1003/bag-dna-os` |
| Production Branch | `main` |
| Root Directory | blank or `/` |
| Framework Preset | `Next.js` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

Add `NEXT_PUBLIC_APP_URL=https://bag-dna-os.vercel.app` in the Production environment. Then open **Deployments**, redeploy the latest `main` commit to Production, and verify that `bag-dna-os.vercel.app` is assigned under **Settings → Domains**.

> A successful preview URL does not automatically prove that the custom production alias, Git repository, or production branch is configured. Those controls live in the Vercel project, not in this repository.

### GitHub Pages (optional static demonstration)

GitHub Pages is static hosting. It cannot replace Vercel for future authenticated, server-rendered, database-backed, webhook, or API-route functionality. The current public MVP is statically exportable, so a separate build mode is provided without changing the normal Vercel build:

```bash
npm run build         # Vercel / Next.js production build
npm run build:pages   # Static export to out/ with /bag-dna-os base path
```

The workflow at `.github/workflows/deploy-pages.yml` deploys the static export after a push to `main` or a manual dispatch. In GitHub, select **Settings → Pages → Build and deployment → Source: GitHub Actions**. The expected URL is `https://omoluabi1003.github.io/bag-dna-os/`.

The Pages build uses `output: "export"`, `trailingSlash`, unoptimized images, `basePath`, and `assetPrefix` only when `PAGES_BUILD=true`. Vercel continues to use the default Next.js configuration.

## Beta data and public integrations

The MVP does not require paid API keys. Public services are isolated behind typed adapters and use deterministic fallback data when calls fail:

- **Open-Meteo:** keyless weather, wind, precipitation, and visibility-style context.
- **OpenSky Network:** public aircraft movement context with safe fallback records.
- **OurAirports:** local Nigerian and priority international airport seed records, ready for CSV ingestion.
- **REST Countries:** country, region, and flag context.
- **OpenStreetMap / Overpass:** adapter-ready infrastructure context with no live dependency.
- **Local GeoJSON:** versioned airports, corridors, airport zones, and baggage movement trails.

The interface explicitly labels simulated content as **Beta data mode** and displays loading, live, and degraded states. Public API data is contextual only and must not be used for live aviation or security decisions.

## Public beta routes

- `/beta` — deployment posture, data coverage, limitations, and service status.
- `/integrations` — free API roadmap and future enterprise integration path.
- `/investors` — problem, market, wedge, pilot strategy, revenue model, and expansion path.
- `/dashboard` — Nigeria Aviation Intelligence Hub and operational product demonstration.

## Future integrations

- **Supabase:** governed identities, events, role-based access, and real-time channels.
- **ArcGIS Enterprise / Online:** authoritative operational layers and secured airport web maps.
- **ArcGIS Velocity:** streaming RFID, seal, vehicle, and geofence telemetry.
- **ArcGIS Indoors:** terminal floor plans, indoor positioning, and restricted routing.
- **Airline / airport systems:** DCS, BRS, BHS, EDS, AODB, and operational APIs.
- **Identity hardware:** RFID, NFC, rotating QR, break sensors, scales, and vision stations.

## Pilot deployment

The deployment pathway begins with a controlled airport demonstration, then progresses through airline integration, customs and border collaboration, selected high-risk corridor operations, and international standardization. Initial corridor candidates include Canada–Africa, North America–Caribbean, Europe–Africa, and Latin American transit routes.

## ETL GIS Consulting LLC

ETL GIS Consulting LLC is the technology strategy and implementation company behind BAG-DNA OS. Its capabilities include enterprise GIS architecture, AI-integrated automation, spatial analytics, digital governance modernization, public-sector decision systems, operational intelligence dashboards, and data-driven security workflows.

> This repository is an investor- and pilot-ready MVP using realistic demonstration data. Production deployment requires stakeholder governance, privacy and security review, system integration, hardware certification, and operating-procedure validation.

## Production redeployment checklist

1. Merge the release commit into `main`.
2. Confirm the Vercel project is linked to `Omoluabi1003/bag-dna-os`.
3. Confirm **Production Branch** is `main` and **Root Directory** is blank.
4. Add `NEXT_PUBLIC_APP_URL=https://bag-dna-os.vercel.app`.
5. Redeploy the latest `main` deployment as **Production**.
6. Confirm `https://bag-dna-os.vercel.app`, metadata, icons, canonical URL, and social preview.
7. Optionally enable GitHub Actions as the Pages source and run **Deploy static demo to GitHub Pages**.
