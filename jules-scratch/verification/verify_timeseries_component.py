import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for all console events and print them to the terminal
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

        try:
            # Login
            page.goto("http://localhost:5174/login")
            page.get_by_label("Email").fill(os.environ["EMAIL"])
            page.get_by_label("Password").fill(os.environ["PASS"])
            page.get_by_role("button", name="Sign In").click()

            # Wait for the URL to change to the root path
            page.wait_for_url("http://localhost:5174/", timeout=10000)

            # Navigate directly to the Gadadar dashboard
            page.goto("http://localhost:5174/dashboard/device/Gadadar/c633a2e0-cf8a-11ee-8f69-6d24b264910c")

            # Add a delay to allow the page to render and for console messages to be captured
            page.wait_for_timeout(5000)

            # Take a screenshot
            page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()