export interface Clock {
  now(): Date;
  iso(): string;
}

export const systemClock: Clock = {
  now: () => new Date(),
  iso: () => new Date().toISOString(),
};

export const fixedClock = (instant: Date): Clock => ({
  now: () => new Date(instant.getTime()),
  iso: () => instant.toISOString(),
});
