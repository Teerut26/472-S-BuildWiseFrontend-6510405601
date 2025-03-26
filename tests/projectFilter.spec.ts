import { type Project } from "@/services/project/getProjects.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";
test.describe.configure({ mode: "serial" });

test.describe("Project Filter Status", () => {
  test("should display all projects when no status filter is selected", async ({
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

  test("should display all projects after clearing status filter", async ({
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

    // select the filter

    await page.getByRole("button", { name: "ค้นหาขั้นสูง" }).click();
    await page.getByRole("textbox", { name: "สถานะโครงการ" }).click();
    await page.waitForTimeout(1500);

    await page.locator('[id="\\:r6p\\:"]').click(); // วางแผน
    await page.locator('[id="\\:r6s\\:"]').click(); // กำลังดำเนินการ
    await page.locator('[id="\\:r72\\:"]').click(); // ยกเลิก
    await page.waitForTimeout(1000);

    await page.locator(".mantine-Drawer-overlay").click(); // close the filter
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "ค้นหาขั้นสูง" }).click();
    await page.waitForTimeout(1000);

    // deselect the filter
    await page
      .getByRole("dialog", { name: "การค้นหาขั้นสูง" })
      .locator("button")
      .nth(1)
      .click();
    await page.waitForTimeout(1000);
    await page
      .getByRole("dialog", { name: "การค้นหาขั้นสูง" })
      .locator("button")
      .nth(1)
      .click();
    await page.waitForTimeout(1000);

    await page
      .getByRole("dialog", { name: "การค้นหาขั้นสูง" })
      .locator("button")
      .nth(1)
      .click();
    await page.waitForTimeout(1000);

    await page.locator(".mantine-Drawer-overlay").click(); // close the filter
    await page.waitForTimeout(1000);

    const elements = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );

    expect(elements.length).toEqual(response.data.projects.length);
    expect(response.data.projects.length).toBeGreaterThan(0);
  });

  test("should display only projects with selected status", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/project");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/projects");
    });
    await page.waitForTimeout(1500);

    await page.getByRole("button", { name: "ค้นหาขั้นสูง" }).click();
    await page.waitForTimeout(1500);
    await page.getByRole("textbox", { name: "สถานะโครงการ" }).click();
    await page.waitForTimeout(1500);

    await page.locator('[id="\\:r72\\:"]').click(); // ยกเลิก
    await page.waitForTimeout(1500);

    await page.locator(".mantine-Drawer-overlay").click(); // close the filter

    await page.waitForTimeout(1500);

    const projectListArea = page.locator(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    const projects = await projectListArea.all();

    projects.forEach(async (project) => {
      const badge = await project
        .locator("span.m_5add502a.mantine-Badge-label")
        .innerText();
      expect(badge).toEqual("ยกเลิก");
    });
  });
});
