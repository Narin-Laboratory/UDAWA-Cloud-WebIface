import asyncio
import os
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Listen for console messages
        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))

        # Navigate to the debug route with device info
        await page.goto("http://localhost:5173/debug-device-dashboard/UDa-Wa%20Gadadar/2a98a3e0-0e54-11ef-93ac-f131805f17a3")

        # Wait for dashboard to load
        await expect(page.get_by_role("tab", name="Monitor")).to_be_visible(timeout=10000)

        await page.wait_for_timeout(2000) # Let websocket connect and settle

        # Click through the tabs
        print("Clicking Control tab")
        await page.get_by_role("tab", name="Control").click()
        await page.wait_for_timeout(1000)

        print("Clicking Analytic tab")
        await page.get_by_role("tab", name="Analytic").click()
        await page.wait_for_timeout(1000)

        print("Clicking Config tab")
        await page.get_by_role("tab", name="Config").click()
        await page.wait_for_timeout(1000)

        print("Clicking Monitor tab")
        await page.get_by_role("tab", name="Monitor").click()
        await page.wait_for_timeout(1000)


        # Take a screenshot
        print("Taking screenshot")
        await page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot taken")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())