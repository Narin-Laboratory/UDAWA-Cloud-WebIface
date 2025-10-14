import os
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console events and print them
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    # Bypass login and go directly to a device page
    page.goto("http://localhost:5173/dashboard/device/udawa-gadadar/d4a3f4e0-7b3e-11e8-9a7c-000000000001")
    page.wait_for_load_state('networkidle')
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)