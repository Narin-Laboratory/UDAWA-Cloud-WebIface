import os
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the login page
        page.goto("http://localhost:5173/login")

        # Fill in the login form
        page.get_by_label("Email Address").fill(os.environ["EMAIL"])
        page.get_by_label("Password").fill(os.environ["PASS"])
        page.get_by_role("button", name="Sign In").click()

        # Wait for navigation to the root page after login
        page.wait_for_url("http://localhost:5173/", timeout=10000)
        expect(page).to_have_url("http://localhost:5173/")

        # Navigate to the dashboard
        page.goto("http://localhost:5173/dashboard")
        page.wait_for_load_state("networkidle")
        expect(page).to_have_url("http://localhost:5173/dashboard")

        # Wait for the device list to be visible and click on the Gadadar device
        gadadar_device = page.get_by_text("Gadadar")
        gadadar_device.wait_for(state="visible", timeout=10000)
        gadadar_device.click()

        expect(page).to_have_url(
            "http://localhost:5173/dashboard/device/udawa-gadadar/3a616d00-4458-11ef-93e8-c5a7848d7c47"
        )

        # Click on the Config tab
        page.get_by_role("tab", name="Config").click()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    except Exception as e:
        page.screenshot(path="jules-scratch/verification/error.png")
        raise e

    finally:
        # Clean up
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)