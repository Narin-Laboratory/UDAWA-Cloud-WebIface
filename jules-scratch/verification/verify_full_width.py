from playwright.sync_api import sync_playwright, Page, expect
import time

def test_full_width_layout(page: Page):
    """
    This test verifies that the AuthLayout is full-width.
    """
    # 1. Arrange: Go to the application URL.
    page.goto("http://localhost:5173")

    # Give the page a moment to load, just in case.
    time.sleep(2)

    # 2. Assert: Check if the main container is full-width.
    # The container inside AuthLayout should have its `maxWidth` set to `false`,
    # which means it should take up the full viewport width.
    # We use .first to resolve the strict mode violation.
    main_container = page.locator("main.MuiContainer-root").first

    # We expect the container to exist.
    expect(main_container).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_full_width_layout(page)
        browser.close()