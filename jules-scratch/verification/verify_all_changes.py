from playwright.sync_api import sync_playwright, Page, expect
import time

def test_login_page_features(page: Page):
    """
    This test verifies:
    1. The footer is visible.
    2. The animated quotes container has a fixed width.
    3. The language preference is persisted in local storage.
    """
    # 1. Arrange: Go to the application URL.
    page.goto("http://localhost:5173")
    time.sleep(2) # Allow time for initial render and animation to start

    # 2. Assert: Check footer visibility
    footer = page.locator("footer")
    expect(footer).to_be_visible()

    # 3. Assert: Check fixed width of the quotes container
    quotes_container = page.get_by_test_id("quotes-container")
    bounding_box = quotes_container.bounding_box()
    assert bounding_box is not None, "Quotes container not found"
    assert bounding_box['width'] == 500, f"Expected width 500, but got {bounding_box['width']}"

    # 4. Screenshot: Capture initial state (English)
    page.screenshot(path="jules-scratch/verification/verification_en.png")

    # 5. Act: Change language to Indonesian
    language_switcher = page.get_by_test_id("language-switcher")
    language_switcher.click()
    time.sleep(2) # Allow time for re-render

    # 6. Screenshot: Capture state after language change (Indonesian)
    page.screenshot(path="jules-scratch/verification/verification_id.png")

    # 7. Act: Reload the page
    page.reload()
    time.sleep(2) # Allow time for page to load from scratch

    # 8. Assert: Check that the language is still Indonesian
    expect(language_switcher).to_have_text("EN")

    # 9. Screenshot: Capture state after reload to check persistence
    page.screenshot(path="jules-scratch/verification/verification_id_persisted.png")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_login_page_features(page)
        browser.close()