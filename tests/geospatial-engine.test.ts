import assert from "node:assert/strict";
import test from "node:test";
import { getAirportByCode } from "../lib/operations/airports";
import { sampleGreatCircle } from "../lib/operations/corridorGeometry";
import { computeOperationalRouteView, projectGlobalPoint, projectOperationalPoint, splitPathAtDiscontinuity } from "../lib/operations/mapProjection";

const airport = (code: string) => getAirportByCode(code)!;
const width = 1000, height = 500;

test("global projection renders one stable world in geographic order", () => {
  const left = projectGlobalPoint({ longitude: -180, latitude: 0 }, width, height);
  const right = projectGlobalPoint({ longitude: 180, latitude: 0 }, width, height);
  assert.ok(left.x >= 0 && right.x <= width && right.x > left.x);
  const africa = projectGlobalPoint({ longitude: 20, latitude: 5 }, width, height);
  const southAmerica = projectGlobalPoint({ longitude: -60, latitude: -15 }, width, height);
  const europe = projectGlobalPoint({ longitude: 15, latitude: 50 }, width, height);
  assert.ok(africa.x > southAmerica.x); assert.ok(europe.y < africa.y);
});

test("LHR to DXB remains eastbound outside North America", () => {
  const route = sampleGreatCircle(airport("LHR"), airport("DXB"));
  const projected = route.map((point) => projectGlobalPoint(point, width, height));
  assert.ok(projectGlobalPoint(airport("DXB"), width, height).x > projectGlobalPoint(airport("LHR"), width, height).x);
  assert.ok(projected.every((point) => point.x > projectGlobalPoint({ longitude: -30, latitude: 0 }, width, height).x));
});

test("LAX to NRT is split at the global antimeridian", () => {
  const paths = splitPathAtDiscontinuity(sampleGreatCircle(airport("LAX"), airport("NRT")));
  assert.equal(paths.length, 2);
  assert.ok(paths.every((path) => path.length > 1));
});

test("operational projection fits MIA to ATL in the southeastern US", () => {
  const mia = airport("MIA"), atl = airport("ATL");
  const view = computeOperationalRouteView(mia, atl, width, height);
  for (const point of sampleGreatCircle(mia, atl)) {
    const screen = projectOperationalPoint(point, width, height, view);
    assert.ok(screen.x >= 50 && screen.x <= width - 50 && screen.y >= 50 && screen.y <= height - 50);
  }
  assert.ok(mia.longitude < -75 && atl.longitude < -75 && mia.latitude < 36 && atl.latitude < 36);
});

test("changing corridors changes endpoints, route geometry, and fitted camera", () => {
  const miaAtl = sampleGreatCircle(airport("MIA"), airport("ATL"));
  const lhrDxb = sampleGreatCircle(airport("LHR"), airport("DXB"));
  assert.notDeepEqual(miaAtl[0], lhrDxb[0]); assert.notDeepEqual(miaAtl.at(-1), lhrDxb.at(-1));
  assert.notDeepEqual(miaAtl[Math.floor(miaAtl.length / 2)], lhrDxb[Math.floor(lhrDxb.length / 2)]);
  assert.notDeepEqual(computeOperationalRouteView(airport("MIA"), airport("ATL"), width, height), computeOperationalRouteView(airport("LHR"), airport("DXB"), width, height));
});
