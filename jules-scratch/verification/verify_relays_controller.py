import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Login
        page.goto("http://localhost:5173/auth/login", wait_until="load")
        page.screenshot(path="jules-scratch/verification/login_page_debug.png")
        page.get_by_label("Email Address").fill(os.environ["EMAIL"])
        page.get_by_label("Password").fill(os.environ["PASS"])
        page.get_by_label("Server").fill("prita.undiknas.ac.id")
        page.get_by_role("button", name="Sign In").click()

        # Navigate to the first device's dashboard
        page.wait_for_url("http://localhost:5173/dashboard/devices")
        page.wait_for_timeout(1000) # Wait for the page to settle
        page.locator('a[href^="/dashboard/device/"]').first.click()

        # Wait for the relays controller to be visible
        expect(page.locator('text="relays_controller"')).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()