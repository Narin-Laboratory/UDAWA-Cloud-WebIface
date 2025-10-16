import os
from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Login
        page.goto("http://localhost:5173/login")

        # Wait for animations to complete
        time.sleep(5)

        # Wait for the email input to be visible before interacting
        email_input = page.get_by_label("Email")
        expect(email_input).to_be_visible()

        email_input.fill(os.environ["EMAIL"])
        page.get_by_label("Password").fill(os.environ["PASS"])

        login_button = page.get_by_role("button", name="Sign In")
        expect(login_button).to_be_enabled()
        login_button.click()

        # Wait for navigation to the dashboard
        expect(page).to_have_url("http://localhost:5173/")

        # Navigate to the first device dashboard
        page.goto("http://localhost:5173/dashboard/device/udawa-gadadar/afc2df10-3a94-11ef-a538-2184c6c03d01")

        # Wait for the device details card to be visible
        expect(page.get_by_test_id("device-details-card")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/dashboard.png")

        browser.close()

if __name__ == "__main__":
    run()