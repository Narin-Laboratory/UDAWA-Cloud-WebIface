import os
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the login page
        page.goto("http://localhost:5173/login", timeout=60000)

        # Fill in the login form
        page.get_by_label("Email Address").fill(os.environ["EMAIL"])
        page.get_by_label("Password").fill(os.environ["PASS"])

        # Click the sign-in button
        page.get_by_role("button", name="Sign In").click()

        # Wait for navigation to the dashboard and for the device list to be visible
        page.wait_for_url("http://localhost:5173/", timeout=60000)
        expect(page.get_by_text("UDAWA GADADAR 1")).to_be_visible(timeout=60000)

        # Click on the first device in the list
        first_device_link = page.get_by_role("link", name="UDAWA GADADAR 1").first
        first_device_link.click()

        # Wait for the device details page to load
        expect(page.get_by_text("IP Address:")).to_be_visible(timeout=10000)
        expect(page.get_by_text("Last Seen:")).to_be_visible()

        # Take a screenshot of the device details page
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)