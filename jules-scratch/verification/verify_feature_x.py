from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/login")
        page.get_by_label("Email Address").fill(os.environ["EMAIL"])
        page.get_by_label("Password").fill(os.environ["PASS"])
        page.get_by_role("button", name="Sign In").click()
        page.goto("http://localhost:5173/dashboard/device/Gadadar/a3e794d0-4f23-11ef-8080-808080808080")
        page.wait_for_selector('[data-testid="device-details-card"]', timeout=60000)
        page.set_viewport_size({"width": 375, "height": 812})
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

run()