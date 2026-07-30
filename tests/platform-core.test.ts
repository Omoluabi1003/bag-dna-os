import assert from "node:assert/strict";
import test from "node:test";

import {
  ValidationError,
  createBagId,
  err,
  fixedClock,
  isErr,
  isOk,
  ok,
  requireFiniteNumber,
  requireNonEmptyString,
} from "../lib/core";

test("Result helpers create discriminated success and failure values", () => {
  const success = ok({ value: 42 });
  const failure = err(new Error("failure"));

  assert.equal(isOk(success), true);
  assert.equal(isErr(failure), true);

  if (!isOk(success)) {
    assert.fail("Expected a successful Result");
  }

  if (!isErr(failure)) {
    assert.fail("Expected a failed Result");
  }

  assert.deepEqual(success.data, { value: 42 });
  assert.equal(failure.error.message, "failure");
});

test("entity IDs include their domain prefix", () => {
  assert.match(createBagId(), /^bag_[0-9a-f-]{36}$/);
});

test("fixedClock returns deterministic instants", () => {
  const instant = new Date("2026-07-30T00:00:00.000Z");
  const clock = fixedClock(instant);

  assert.equal(clock.iso(), "2026-07-30T00:00:00.000Z");
  assert.notEqual(clock.now(), instant);
  assert.equal(clock.now().getTime(), instant.getTime());
});

test("validation helpers normalize valid values", () => {
  assert.equal(requireNonEmptyString("  ATL  ", "airport"), "ATL");
  assert.equal(requireFiniteNumber(42, "count"), 42);
});

test("validation helpers reject invalid values", () => {
  assert.throws(() => requireNonEmptyString("   ", "airport"), ValidationError);
  assert.throws(() => requireFiniteNumber(Number.NaN, "count"), ValidationError);
});
