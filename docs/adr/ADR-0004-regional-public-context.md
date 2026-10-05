# ADR-0004: Regional public context in BAG-DNA OS

Status: Proposed for review through this PR

## Problem and ownership

Airport operators need geographical context alongside baggage identity and custody evidence. Existing public aviation adapters are regional and can use demonstration fallbacks; they cannot establish where a bag is or whether a flight is disrupted. Regional public context belongs to the Intelligence Center and Digital Twin, outside identity, evidence-ledger, passenger-status, and security-decision engines.

## Decision

Add original typed adapters for USGS M2.5+ past-day earthquakes and NASA EONET open events observed in the past seven days. No OSIRIS runtime or source code is imported. Use the existing airport/corridor registry and React Leaflet dependency for an optional two-dimensional context map. Requests run in the browser only after an operator enables a layer. This preserves Vercel and GitHub Pages builds without server credentials, privileged endpoints, paid model calls, or additional dependencies.

Both feed schemas validate coordinates, timestamps, identity and source-link hosts. NASA polygon-only geometries are excluded rather than reduced to misleading points. New source failures return an unavailable state with no mock replacement. A one-minute in-memory cache deduplicates concurrent requests and bounds repeated manual refreshes; requests time out after eight seconds. There is no automatic polling or background alert service. In-flight requests may finish after a layer is turned off; cancelled component generations cannot overwrite newer selections.

## Spatial scope and alerts

Operators select a registry airport or demonstration/reference corridor, a 100/300/500/1,000 km distance, and a minimum earthquake magnitude. Airport scope uses spherical distance. Corridor scope uses distance to the finite great-circle arc, clamped to its endpoints, with antimeridian handling. The reference arc is not a filed flight plan or an actual flight track. Public proximity results suggest review only. They do not identify affected flights, actual bag positions, confirmed operational disruption, or threat severity.

Retrieval freshness expires after 15 minutes; event observation windows remain separate (24 hours for USGS, seven days for NASA). Watch alerts are in-page, explicitly enabled and evaluated only using available, recently retrieved feeds and observations within those windows. Partial source availability is labelled an incomplete watch. Matching results are not an all-clear. Source retrieval and event observation times are displayed separately. No passenger references, staff identities, scans or custody data are sent to providers. Source and unavailable states are the public feed health indicators; no authenticated operational action or ledger mutation occurs.

## Performance, accessibility and operations

The map loads on demand, renders at most 200 events, fits the selected scope and preserves OpenStreetMap attribution. The list shows the 30 most recent results with a full matching count. Layer checkboxes, labelled selects, map show/hide and event cards have keyboard alternatives; watch summaries use a polite live region. The layout uses one column on mobile and wider layouts on desktop. OpenStreetMap tiles are requested only for interactive viewing with normal browser caching; no offline tile downloads or background prefetching are added.

USGS and NASA endpoints require no API key. Public service access, CORS, upstream limits and tile availability are best-effort. OpenStreetMap production scale requires a separate tile-hosting decision; no paid provider is automatically selected. See USGS feed policy, NASA EONET disclaimer and OSM tile policy before expanding use. There is no claim of complete worldwide coverage or continuous surveillance.

## Validation and rollback

Unit/integration coverage includes malformed payloads, unsafe links, null coordinates, latest valid NASA point selection, deduplication, spherical radius filtering, corridor endpoint clamping, antimeridian geometry, time-window expiry, concurrent request reuse and unavailable feeds. CI runs the new test command alongside existing lint, TypeScript and build gates. Rollback is a revert of this PR; no database migration or custody-data change is needed.

Sources:
- https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
- https://eonet.gsfc.nasa.gov/docs/v3
- https://eonet.gsfc.nasa.gov/what-is-eonet
- https://operations.osmfoundation.org/policies/tiles/
