# BAG-DNA OS™

**Every passenger has an identity. Every bag should too.**

BAG-DNA OS is a global digital baggage identity, AI chain-of-custody, GIS digital twin, and aviation security intelligence operating system for checked baggage. It is **Developed by Paul Iyogun** for airports, airlines, aviation authorities, customs and border agencies, insurers, security teams, and passengers.

## Category position

BAG-DNA OS combines four category-defining capabilities:

- **Baggage security:** continuous threat detection, anomaly investigation, identity verification, and defensible custody evidence.
- **Baggage intelligence:** a unified decision layer across airline, airport, authority, staff, route, and sensor data.
- **Baggage operations:** a live geospatial digital twin for commanding movement, facilities, risk corridors, and operational assets.
- **Baggage identity infrastructure:** a programmable trust layer for issuing, verifying, and reconciling persistent bag identities.

Together, these capabilities create one identity graph, one evidence chain, and one operational truth for every bag in motion.

## The problem

Conventional baggage tags can be photographed, cloned, stolen, diverted, or attached to another bag. Fragmented airport systems make substitution difficult to detect and expose aviation stakeholders to theft, trafficking, insider manipulation, passenger misidentification, legal claims, and reputational harm.

## The solution

BAG-DNA OS assigns each checked bag a persistent digital identity linked to its passenger reference, journey, secure credentials, physical attributes, route, and custody history. Multi-sensor events continuously reconcile RFID, NFC, rotating QR, computer vision, weight, dimensions, tamper seal, location, route, and authorized staff interactions.

## Operating protocol

1. Issue a Digital Baggage Identity at check-in.
2. Bind the passenger reference, flight, physical bag, secure tag, RFID, NFC, rotating QR, tamper seal, and visual fingerprint.
3. Verify every checkpoint scan against expected route, weight, appearance, seal, custody stage, and authorized handler.
4. Detect credential mismatch, route inconsistency, unauthorized access, identity substitution, or custody gaps.
5. Preserve each issuance, validation, transfer, alert, and claim as a hash-linked evidence event.
6. Give passengers clear visibility into the last verified scan, seal integrity, identity confidence, and claim readiness.

Interactive routes include `/tagging`, `/fingerprint`, `/scanner`, `/verification-center`, `/custody`, `/tamper-seals`, `/passenger`, `/ledger`, `/digital-twin`, `/corridors`, and `/pilot`.

## ICAO-aligned review posture

BAG-DNA OS is structured for international stakeholder evaluation through a standards-mapping and evidence-readiness pathway covering:

- aviation security objectives, including identity assurance, screening evidence, custody integrity, anomaly escalation, and controlled intervention;
- facilitation principles, including interoperable processing, passenger protection, operational continuity, and accountable information exchange;
- governance controls, including privacy, cybersecurity, role-based access, human oversight, auditability, and verifiable evidence export;
- measurable pilot outcomes for airports, airlines, authorities, customs, insurers, and passengers.

**Transparency note:** ICAO alignment describes the platform's design intent, standards mapping, and review readiness. It does not represent ICAO approval, certification, adoption, or endorsement.

## Core modules

- Digital Baggage Identity Registry
- AI visual baggage fingerprinting
- Explainable integrity and identity confidence engines
- Multi-sensor chain-of-custody operations center
- ArcGIS-ready airport and corridor digital twin
- Airport reputation and insurance intelligence
- Mobile-first passenger visibility and claim verification
- Tamper-evident evidence ledger
- Smart NFC, QR, and tamper-seal workflows
- Staff geofencing and insider-threat monitoring
- Global pilot and standards-review workspace

## Technology

- Next.js 15, React 19, TypeScript, App Router
- Tailwind CSS, Framer Motion, Lucide React, Recharts
- React Three Fiber and Three.js visualization
- PWA manifest and Vercel-compatible production build
- Supabase-ready environment and modular fallback-data architecture
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

## Deployment targets

### Vercel

Use the following project settings:

| Setting | Required value |
| --- | --- |
| Git repository | `Omoluabi1003/bag-dna-os` |
| Production Branch | `main` |
| Root Directory | blank or `/` |
| Framework Preset | `Next.js` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

Add `NEXT_PUBLIC_APP_URL=https://bag-dna-os.vercel.app` in the Production environment.

### GitHub Pages

```bash
npm run build:pages
```

The static demonstration supports public review, while Vercel remains the primary target for future authenticated, server-rendered, database-backed, webhook, and API-route functionality.

## Public integrations and fallback data

The MVP uses public services behind typed adapters and deterministic fallback data:

- Open-Meteo for weather and visibility context
- OpenSky Network for aircraft movement context
- OurAirports for airport seed and enrichment workflows
- REST Countries for regional context
- OpenStreetMap and Overpass for infrastructure context
- versioned regional GeoJSON for airports, corridors, zones, and baggage trails

Public API data is contextual only and must not be used as the sole basis for live aviation or security decisions.

## Pilot deployment

The deployment pathway begins with a controlled international airport demonstration, then progresses through airline integration, authority and border collaboration, selected multi-airport corridor operations, and international standards review.

## Developer attribution

BAG-DNA OS was developed by Paul Iyogun. The platform reflects his experience in enterprise GIS architecture, AI-integrated automation, spatial analytics, digital governance modernization, public-sector decision systems, operational intelligence dashboards, and data-driven security workflows.

> This repository is an investor- and pilot-ready MVP using realistic demonstration data. Production deployment requires stakeholder governance, privacy and security review, system integration, hardware certification, regulatory engagement, and operating-procedure validation.
