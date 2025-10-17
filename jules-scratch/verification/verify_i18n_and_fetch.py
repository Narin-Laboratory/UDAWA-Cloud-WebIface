import os
import re
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:5173/login")

        # Use the correct email address provided by the user
        page.get_by_label("Email Address").fill("helpbot@prita.undiknas.ac.id")
        page.get_by_label("Password").fill(os.environ["PASS"])
        page.get_by_label("Server").fill("prita.undiknas.ac.id")
        page.get_by_role("button", name="Sign In").click()

        # Wait for navigation to any device dashboard
        expect(page).to_have_url(re.compile(r"/dashboard/device/"), timeout=60000)

        # Navigate to the Gadadar device dashboard
        page.goto("http://localhost:5173/dashboard/device/udawa-gadadar/d3f7e6f0-3e2b-11ef-a678-d383e33f5f3c")

        page.wait_for_load_state('networkidle')

        # Click the "Analytic" tab
        page.get_by_role("tab", name="Analytic").click()

        # Click the "Fetch" button
        page.get_by_role("button", name="Fetch").click()

        # Wait for the chart to be visible
        expect(page.locator(".recharts-wrapper")).to_be_visible(timeout=30000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/i18n_and_fetch.png")

        browser.close()

if __name__ == "__main__":
    run()