import { Client } from "@/services/client/getClients.service";
import { Job } from "@/services/job/getJobs.service";
import { type Project } from "@/services/project/getProjects.service";
import { Supplier } from "@/services/supplier/getSuppliers.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Job Search", () => {
  test("should display all jobs when no search query is entered", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/job");
    await page.getByRole("button", { name: "Sign In" }).click();

    const responseRaw = await page.waitForResponse((response) => {
      return response.url().includes("/jobs");
    });
    const response = (await responseRaw.json()) as BaseResponse<{
      jobs: Job[];
      total: number;
    }>;
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่องาน หรือ รายละเอียด" })
      .fill("");
    await page.waitForTimeout(1500);

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const jobs = await trArea.all();

    expect(jobs.length).toEqual(response.data.jobs.length);
  });

  test("should filter jobs based on name search", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/job");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/jobs");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่องาน หรือ รายละเอียด" })
      .fill("งานฉาบ");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const jobs = await trArea.all();
    expect(jobs.length).toBeGreaterThan(1);
  });

  test("should return results regardless of case sensitivity", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/job");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/jobs");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่องาน หรือ รายละเอียด" })
      .fill("งานฉาบปูนโครงสร้าง");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const jobs = await trArea.all();
    expect(jobs.length).toEqual(1);
  });
});
