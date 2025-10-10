import os
import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console messages and print them
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    # Go to the login page
    page.goto("http://localhost:5173/login")

    # Wait for the email input to be visible
    try:
        page.wait_for_selector("#email", timeout=15000)
    except Exception as e:
        print("Error waiting for selector:", e)
        print("Page content:", page.content())
        browser.close()
        return

    # --- Test Case 1: Failed Login ---
    print("Testing failed login...")
    # Fill in incorrect credentials using language-independent selectors
    page.locator("#email").fill("wrong@user.com")
    page.locator("#password").fill("wrongpassword")

    # Click the sign-in button
    page.get_by_role("button", name=re.compile("Sign In|Masuk")).click()

    # Wait for the error toast and take a screenshot
    error_toast = page.locator(".Toastify__toast--error")
    expect(error_toast).to_be_visible(timeout=10000)
    expect(error_toast).to_contain_text(re.compile("failed|gagal", re.IGNORECASE))
    page.screenshot(path="jules-scratch/verification/failed_login.png")
    print("Screenshot for failed login saved.")

    # Wait for the toast to disappear to not interfere with the next test
    expect(error_toast).not_to_be_visible(timeout=6000)

    # --- Test Case 2: Successful Login ---
    print("Testing successful login...")
    # Get correct credentials from environment variables
    email = os.environ.get("EMAIL")
    password = os.environ.get("PASS")

    if not email or not password:
        print("EMAIL or PASS environment variables not set. Skipping successful login test.")
        browser.close()
        return

    # Fill in correct credentials
    page.locator("#email").fill(email)
    page.locator("#password").fill(password)

    # Click the sign-in button
    page.get_by_role("button", name=re.compile("Sign In|Masuk")).click()

    # Check for loading toasts
    loading_toast = page.locator(".Toastify__toast--info")
    expect(loading_toast.first).to_be_visible(timeout=10000)
    expect(loading_toast.first).to_contain_text(re.compile(r"Logging in...|Fetching user", re.IGNORECASE))
    print("Loading toast detected.")

    # Wait for navigation to the dashboard
    expect(page).to_have_url(re.compile(r".*/dashboard$"), timeout=20000)
    print("Navigated to dashboard.")

    # Take a screenshot of the dashboard
    page.screenshot(path="jules-scratch/verification/successful_login_dashboard.png")
    print("Screenshot for successful login saved.")

    # ---------------------
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)