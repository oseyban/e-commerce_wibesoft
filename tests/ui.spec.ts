import { test, expect } from "@playwright/test";

test("homepage -> product -> add to cart", async ({ page }) => {
  await page.goto("/");

  const section = page.locator("section").filter({
    has: page.getByRole("heading", { name: /new arrivals/i })
  });

  await expect(section).toBeVisible();
  await expect(section.locator("article")).toHaveCount(4, { timeout: 15000 });

  const firstCard = section.locator("article").first();
  await firstCard.locator("a").click();

  await page.waitForURL(/\/product\/\d+$/);

  const productTitle = (await page.locator("h1").first().textContent())?.trim() || "";

  const addToCart = page.getByRole("button", { name: /add to cart/i });
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  await page.getByRole("link", { name: /cart/i }).click();
  await expect(page).toHaveURL(/\/cart$/);

  await expect(page.getByText("Your cart is empty.")).toHaveCount(0);
  if (productTitle) {
    await expect(page.getByText(productTitle)).toBeVisible();
  }
});
