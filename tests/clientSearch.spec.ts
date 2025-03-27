import { Client } from "@/services/client/getClients.service";
import { type Project } from "@/services/project/getProjects.service";
import { Supplier } from "@/services/supplier/getSuppliers.service";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Client Search", () => {
  test("should display all customers when no search query is entered", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/client");
    await page.getByRole("button", { name: "Sign In" }).click();

    const responseRaw = await page.waitForResponse((response) => {
      return response.url().includes("/clients");
    });
    const response = (await responseRaw.json()) as BaseResponse<{
      clients: Client[];
      total: number;
    }>;
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", {
        name: "ค้นหาด้วย ชื่อลูกค้า, อีเมล, เบอร์โทร หรือ เลขประจำตัวผู้เสียภาษี",
      })
      .fill("");
    await page.waitForTimeout(1500);

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const clients = await trArea.all();

    expect(clients.length).toEqual(response.data.clients.length);
  });

  test("should filter customers based on name search", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/client");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/clients");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", {
        name: "ค้นหาด้วย ชื่อลูกค้า, อีเมล, เบอร์โทร หรือ เลขประจำตัวผู้เสียภาษี",
      })
      .fill("บริษัท");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const clients = await trArea.all();

    expect(clients.length).toBeGreaterThan(1);
  });

  test("should return results regardless of case sensitivity", async ({
    browser,
  }) => {
    const page = await browser.newPage();
    await page.goto("/client");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/clients");
    });
    await page.waitForTimeout(1500);

    await page
      .getByRole("textbox", {
        name: "ค้นหาด้วย ชื่อลูกค้า, อีเมล, เบอร์โทร หรือ เลขประจำตัวผู้เสียภาษี",
      })
      .fill("บริษัท แลนด์มาร์คดีเวลลอปเม้นท์ จำกัด (มหาชน)");

    const trArea = page.locator(
      "#__next > div > main > div > div.mantine-datatable > div.mantine-datatable-scroll-area.m_d57069b5.mantine-ScrollArea-root > div > div > table > tbody > tr",
    );

    const clients = await trArea.all();
    expect(clients.length).toEqual(1);
  });
});
