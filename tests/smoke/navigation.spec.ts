import { test, expect } from "@playwright/test";

const routes = [
  "/", "/dashboard", "/checkpoint-intelligence", "/tagging", "/fingerprint", "/scanner", "/verification-center",
  "/trust-graph", "/threat-graph", "/knowledge-graph", "/event-graph", "/memory-graph",
  "/collective-intelligence", "/intelligence-center", "/custody", "/ledger", "/investigation",
  "/claim-verification", "/passport", "/passenger", "/staff-monitoring", "/tamper-seals",
  "/secure-tags", "/corridors", "/digital-twin", "/threat-intelligence", "/airport-reputation",
  "/insurance-intelligence", "/global-readiness", "/investors", "/integrations", "/pilot", "/docs", "/about",
];

test.describe("BAG-DNA OS navigation smoke", () => {
  for (const route of routes) {
    test(`${route} renders without horizontal layout failure`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThan(24);
    });
  }

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await page.getByLabel("Open navigation").click();
    await expect(page.getByRole("link", { name: "Verification Center" })).toBeVisible();
    await page.getByLabel("Close navigation").click();
    await expect(page.getByRole("link", { name: "Verification Center" })).not.toBeVisible();
  });

  test("checkpoint alert control opens a dedicated page instead of an overlay", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /checkpoint alerts/i }).click();
    await expect(page).toHaveURL(/\/checkpoint-intelligence$/);
    await expect(page.getByRole("heading", { name: "Checkpoint Intelligence" })).toBeVisible();
    await expect(page.getByText("Priority Alerts")).toBeVisible();
  });
});
