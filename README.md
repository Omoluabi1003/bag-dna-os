# BAG-DNA OS™

**Every passenger has an identity. Every bag should too.**

BAG-DNA OS is the digital identity, AI chain-of-custody, GIS digital twin, and aviation security intelligence operating system for checked baggage. It is developed by **ETL GIS Consulting LLC** for airports, airlines, aviation authorities, customs and border agencies, insurers, security teams, and passengers.

## The problem

Conventional paper baggage tags can be photographed, cloned, stolen, diverted, or attached to another bag. Fragmented airport systems make these substitutions difficult to detect and expose aviation stakeholders to theft, narcotics trafficking, insider manipulation, passenger misidentification, legal claims, and reputational harm.

## The solution

BAG-DNA OS assigns each checked bag a persistent digital identity linked to its journey and physical attributes. Multi-sensor custody events continuously reconcile RFID/NFC, computer vision, weight, dimensions, tamper seal, location, route, and authorized staff interactions.

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
npm start
```

## Deploy to Vercel

1. Import the GitHub repository in Vercel.
2. Keep the detected **Next.js** framework preset.
3. Add the variables from `.env.example` when integration credentials are available.
4. Deploy. No custom build command or output directory is required.

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
