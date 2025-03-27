import { Client } from "@/services/client/getClients.service";
import { Job } from "@/services/job/getJobs.service";
import { Material } from "@/services/material/getMaterials.service";
import { type Project } from "@/services/project/getProjects.service";
import { Supplier } from "@/services/supplier/getSuppliers.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Material Search", () => {
  test("should display all materials when no search query is entered", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/material");
    await page.getByRole("button", { name: "Sign In" }).click();

    const responseRaw = await page.waitForResponse((response) => {
      return response.url().includes("/materials");
    });
    const response = (await responseRaw.json()) as BaseResponse<{
      materials: Material[];
      total: number;
    }>;
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่อ หรือ หน่วยของวัสดุ" })
      .fill("");
    await page.waitForTimeout(1500);

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const materials = await trArea.all();

    expect(materials.length).toEqual(response.data.materials.length);
  });

  test("should filter materials based on name search", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/material");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/materials");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่อ หรือ หน่วยของวัสดุ" })
      .fill("เหล็กเส้น");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const materials = await trArea.all();
    expect(materials.length).toBeGreaterThan(1);
  });

  test("should return results regardless of case sensitivity", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/material");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/materials");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", { name: "ค้นหาด้วย ชื่อ หรือ หน่วยของวัสดุ" })
      .fill("น้ำยาประสานคอนกรีต DAVCO รุ่น BONDING ขนาด 5 ลิตร");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const materials = await trArea.all();
    expect(materials.length).toEqual(1);
  });
});
