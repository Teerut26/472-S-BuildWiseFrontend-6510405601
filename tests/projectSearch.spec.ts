import { type Project } from "@/services/project/getProjects.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Project Search", () => {
  test("should display all projects when no search query is entered", async ({
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
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่อโครงการ หรือ รายละเอียด" })
      .fill("");
    await page.waitForTimeout(1500);

    const elements = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );

    expect(elements.length).toEqual(response.data.projects.length);
  });

  test("should filter projects based on search query", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/project");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/projects");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่อโครงการ หรือ รายละเอียด" })
      .fill("เดอะ");

    const elements = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    expect(elements.length).toBeGreaterThan(1);
  });

  test("should be case insensitive when searching", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/project");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/projects");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่อโครงการ หรือ รายละเอียด" })
      .fill("เดอะ ริเวอร์ พาร์ค คอนโดมิเนียม");

    const elements = await page.$$(
      "#__next > div > main > div > div:nth-child(4) > div",
    );
    expect(elements.length).toEqual(1);
  });
});
