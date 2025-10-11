import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Login
        page.goto("http://localhost:5173/login")
        page.get_by_label("Email Address").fill(os.environ["EMAIL"])
        page.get_by_label("Password").fill(os.environ["PASS"])
        page.get_by_role("button", name="Sign In").click()

        # Wait for login to complete and devices to load
        expect(page.get_by_text("Agents List")).to_be_visible(timeout=60000)

        # Click the first device
        page.locator(".MuiListItemButton-root").first.click()

        # Go to the config tab
        expect(page.get_by_text("Device Details")).to_be_visible()
        page.get_by_role("tab", name="Config").click()

        # Verify the config form is visible
        expect(page.get_by_text("Generic Device Configuration")).to_be_visible()
        expect(page.get_by_label("WiFi SSID")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()