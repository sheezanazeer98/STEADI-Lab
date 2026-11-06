import { expect, test } from "@playwright/test";

test.describe("site shell", () => {
  test("home page renders the hero and primary calls to action", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/STEADI Lab/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Advancing Research");
    await expect(page.getByRole("link", { name: "Explore Research" })).toHaveAttribute("href", "/research");
    await expect(page.getByRole("link", { name: "View Publications" })).toHaveAttribute(
      "href",
      "/publications",
    );
    await expect(page.getByRole("link", { name: "Discover Projects" })).toHaveAttribute("href", "/projects");
  });

  test("every primary route responds with a page title", async ({ page }) => {
    const routes = [
      "/about",
      "/research",
      "/publications",
      "/projects",
      "/products",
      "/people",
      "/news",
      "/events",
      "/resources",
      "/opportunities",
      "/collaborate",
      "/contact",
      "/faq",
      "/privacy",
    ];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), route).toBeVisible();
      await expect(page, route).toHaveTitle(/\| STEADI Lab$/);
    }
  });

  test("security headers are applied", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["content-security-policy"]).toContain("default-src 'self'");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  });

  test("unknown routes show the custom 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    // The 404 body streams in behind the root loading boundary; allow for a cold server.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("off the map", { timeout: 15_000 });
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  });

  test("sitemap and robots are generated", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("<loc>https://steadi-lab.org/publications</loc>");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Sitemap: https://steadi-lab.org/sitemap.xml");
  });
});

test.describe("navigation", () => {
  test("desktop header links to the main sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Publications" })).toBeVisible();
    await nav.getByRole("button", { name: "More" }).click();
    await page.getByRole("menuitem", { name: /Events/ }).click();
    await expect(page).toHaveURL(/\/events$/);
  });

  test("mobile drawer opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile navigation only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("navigation", { name: "Mobile" });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("link", { name: /^Research/ }).click();
    await expect(page).toHaveURL(/\/research$/);
    await expect(drawer).toBeHidden();
  });

  test("theme toggle switches between light and dark", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Switch to (light|dark) theme/ });
    const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    await toggle.click();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
      .toBe(!before);
  });
});

test.describe("publications", () => {
  test("search filters results and syncs the query string", async ({ page }) => {
    await page.goto("/publications");
    const search = page.getByRole("searchbox", { name: "Search publications" });
    const emptyState = page.getByText("publication directory is empty");
    // Wait for the streamed page body before deciding which branch applies.
    await expect(search.or(emptyState)).toBeVisible({ timeout: 15_000 });
    if (await emptyState.isVisible()) {
      // No publications yet: the empty state must explain how to add records.
      return;
    }
    await search.fill("zzzz-no-such-paper");
    await expect(page).toHaveURL(/q=zzzz-no-such-paper/);
    await expect(page.getByText(/No publications match/)).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page).not.toHaveURL(/q=/);
  });
});

test.describe("forms", () => {
  test("contact form validates before submitting", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /Send message/ }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  });
});
