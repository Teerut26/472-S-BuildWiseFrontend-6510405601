import { type Project } from "@/services/project/getProjects.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Project Listing Sorting", () => {
  test("should display projects in default order when no sorting is applied", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/project");
    await page.getByRole("button", { name: "Sign In" }).click();
    const responseRaw = await page.waitForResponse((response) => {
      return response.url().includes("/projects");
    });

    const response = (await responseRaw.json()) as BaseResponse<{
      projects: Project[];
      total: number;
    }>;

    const elements = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );

    expect(elements.length).toEqual(response.data.projects.length);
    expect(response.data.projects.length).toBeGreaterThan(0);
  });

  test("should sort projects by start date in ascending order", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/project");
    await page.getByRole("button", { name: "Sign In" }).click();

    // set to descending order
    await page
      .locator("div")
      .filter({ hasText: /^เรียงลำดับวันที่สร้างเก่าสุด$/ })
      .getByRole("button")
      .click();
    await page.waitForTimeout(1500);

    const elements_desc = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    const firstProjectDesc = await (
      await elements_desc[0]?.$(".m_b6d8b162")
    )?.innerText();
    await page.waitForTimeout(1500);

    // set to ascending order
    await page
      .locator("div")
      .filter({ hasText: /^เรียงลำดับวันที่สร้างล่าสุด$/ })
      .getByRole("button")
      .click();
    await page.waitForTimeout(1500);

    const elements_asc = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    const lastProjectAsc = await (
      await elements_asc[elements_asc.length - 1]?.$(".m_b6d8b162")
    )?.innerText();

    expect(firstProjectDesc).toEqual(lastProjectAsc);
  });

  test("should sort projects by start date in descending order", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/project");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/projects");
    });
    await page.waitForTimeout(1500);

    const project_list_area_asc = page.locator(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    const first_project_asc = project_list_area_asc.first();
    const first_project_name_asc = await first_project_asc
      .locator(".flex.flex-col.grow > div > a > p")
      .innerText();
    await page.waitForTimeout(1500);

    await page
      .locator("div")
      .filter({ hasText: /^เรียงลำดับวันที่สร้างเก่าสุด$/ })
      .getByRole("button")
      .click();
    await page.waitForTimeout(1500);

    const project_list_area_desc = page.locator(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    const last_project_desc = project_list_area_desc.last();
    const last_project_name_desc = await last_project_desc
      .locator(".flex.flex-col.grow > div > a > p")
      .innerText();
    await page.waitForTimeout(1500);

    expect(first_project_name_asc).toEqual(last_project_name_desc);
  });
});
