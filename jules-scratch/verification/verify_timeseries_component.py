import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Login
            page.goto("http://localhost:5173/login")
            page.get_by_label("Email").fill(os.environ["EMAIL"])
            page.get_by_label("Password").fill(os.environ["PASS"])
            page.get_by_role("button", name="Sign In").click()

            # Wait for the URL to change to the root path
            page.wait_for_url("http://localhost:5173/", timeout=10000)

            # Navigate directly to the Gadadar dashboard
            page.goto("http://localhost:5173/dashboard/device/Gadadar/c633a2e0-cf8a-11ee-8f69-6d24b264910c")

            # Wait for the tabs to be loaded
            page.wait_for_selector("role=tab", timeout=10000)

            # Go to the analytic tab
            page.get_by_role("tab", name="Analytic").click()

            # Wait for the chart to be visible
            expect(page.locator(".recharts-responsive-container")).to_be_visible(timeout=10000)

            # Take a screenshot
            page.screenshot(path="jules-scratch/verification/verification.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()