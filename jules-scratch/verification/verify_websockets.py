from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Log in to the application
        page.goto("http://localhost:5173/login")
        page.wait_for_selector('label:has-text("Email")', timeout=10000)
        page.get_by_label("Email").fill(os.environ.get("EMAIL", ""))
        page.get_by_label("Password").fill(os.environ.get("PASS", ""))
        page.wait_for_selector('button:has-text("Sign In")', timeout=10000)
        page.get_by_role("button", name="Sign In").click()

        # Wait for navigation to the dashboard
        try:
            page.wait_for_url("http://localhost:5173/", timeout=30000)
        except Exception as e:
            print(f"Error waiting for URL: {e}")
            print(page.content())
            browser.close()
            return

        # Click on the first device in the list
        page.get_by_role("link").first.click()

        # Wait for the device details to load
        expect(page.get_by_text("Monitor")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run()