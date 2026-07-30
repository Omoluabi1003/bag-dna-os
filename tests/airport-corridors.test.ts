import assert from "node:assert/strict";
import test from "node:test";
import { airportRegistry, getAirportByCode, validateAirportCoordinates } from "../lib/operations/airports";
import { computeCorridorBounds, sampleGreatCircle } from "../lib/operations/corridorGeometry";

const cases = [["MIA","ATL"],["LHR","DXB"],["JFK","LHR"],["LAX","NRT"],["LOS","ATL"]] as const;

test("canonical registry has complete, validated airport records", () => {
  for (const [key, value] of Object.entries(airportRegistry)) {
    assert.equal(value.iataCode, key); assert.match(value.icaoCode, /^[A-Z0-9]{4}$/);
    assert.ok(value.officialName && value.city && value.country);
    assert.doesNotThrow(() => validateAirportCoordinates(value));
  }
  assert.deepEqual(getAirportByCode(" dxb ") && [getAirportByCode("DXB")!.latitude,getAirportByCode("DXB")!.longitude],[25.2532,55.3657]);
  assert.throws(() => validateAirportCoordinates({iataCode:"DXB",country:"United Arab Emirates",latitude:55.3657,longitude:25.2532}),/swapped/);
  assert.throws(() => validateAirportCoordinates({iataCode:"BAD",country:"United States",latitude:NaN,longitude:0}),/missing/);
});

for (const [originCode,destinationCode] of cases) test(`${originCode} to ${destinationCode} resolves and fits its sampled route`, () => {
  const origin=getAirportByCode(originCode)!,destination=getAirportByCode(destinationCode)!;
  const route=sampleGreatCircle(origin,destination),bounds=computeCorridorBounds(route);
  assert.ok(Math.abs(route[0].latitude-origin.latitude)<1e-9);
  assert.ok(Math.abs(route[0].longitude-origin.longitude)<1e-9);
  assert.ok(Math.abs(route.at(-1)!.latitude-destination.latitude)<1e-9);
  assert.ok(bounds.minLatitude<=origin.latitude && bounds.maxLatitude>=destination.latitude);
  assert.equal(`${origin.iataCode} → ${destination.iataCode}`,`${originCode} → ${destinationCode}`);
});

test("LHR to DXB stays over Europe and the Middle East", () => {
  const lhr=getAirportByCode("LHR")!,dxb=getAirportByCode("DXB")!,route=sampleGreatCircle(lhr,dxb);
  const midpoint=route[Math.floor(route.length/2)],bounds=computeCorridorBounds(route);
  assert.ok(lhr.longitude<dxb.longitude); assert.ok(midpoint.longitude>-10 && midpoint.longitude<65);
  assert.equal(bounds.crossesAntimeridian,false); assert.ok(bounds.minLongitude>-10 && bounds.maxLongitude<65);
  assert.equal(`${lhr.iataCode} → ${dxb.iataCode}`,"LHR → DXB");
});
