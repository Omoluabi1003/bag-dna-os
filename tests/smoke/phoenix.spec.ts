import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("phoenix-booted", "1"));
});

test("Mission Control investigates and replays the demo journey", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("BDO-MIA-2026-000184").first()).toBeVisible();
  await expect(page.getByText("Missing arrival scan").first()).toBeVisible();
  await page.getByLabel("Next event").click();
  await expect(page.getByText("Untrusted duplicate").first()).toBeVisible();
  await page.getByRole("button", { name: /inspect evidence/i }).click();
  await expect(page.getByRole("heading", { name: "Evidence inspector" })).toBeVisible();
});

test("command palette and BAG-DNA Memory are keyboard accessible", async ({ page }) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  await page.getByRole("link", { name: /Open selected bag/ }).click();
  await expect(page).toHaveURL(/bag-memory/);
  await expect(page.getByText("Origin custody is credible")).toBeVisible();
});

test("Innovation Center credits the developer", async ({ page }) => {
  await page.goto("/innovation");
  await expect(page.getByRole("heading", { name: "Paul Iyogun" })).toBeVisible();
  await expect(page.getByText("ETL GIS Consulting LLC").first()).toBeVisible();
});
