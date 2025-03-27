import { type Project } from "@/services/project/getProjects.service";
import { Supplier } from "@/services/supplier/getSuppliers.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Supplier Search", () => {
  test("should display all suppliers when no search query is entered", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/supplier");
    await page.getByRole("button", { name: "Sign In" }).click();

    const responseRaw = await page.waitForResponse((response) => {
      return response.url().includes("/suppliers");
    });
    const response = (await responseRaw.json()) as BaseResponse<{
      suppliers: Supplier[];
      total: number;
    }>;
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", {
        name: "ค้นหาด้วย ชื่อซัพพลายเออร์, อีเมล หรือ เบอร์โทร",
      })
      .fill("");
    await page.waitForTimeout(1500);

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const suppliers = await trArea.all();

    expect(suppliers.length).toEqual(response.data.suppliers.length);
  });

  test("should filter suppliers based on name search", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/supplier");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/suppliers");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", {
        name: "ค้นหาด้วย ชื่อซัพพลายเออร์, อีเมล หรือ เบอร์โทร",
      })
      .fill("บริษัท");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const suppliers = await trArea.all();

    expect(suppliers.length).toBeGreaterThan(1);
  });

  test("should return results regardless of case sensitivity", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/supplier");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/suppliers");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", {
        name: "ค้นหาด้วย ชื่อซัพพลายเออร์, อีเมล หรือ เบอร์โทร",
      })
      .fill("บริษัท สยามวัสดุก่อสร้าง จำกัด");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const suppliers = await trArea.all();
    expect(suppliers.length).toEqual(1);
  });
});
