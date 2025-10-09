from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Verify Login Page still works
        print("Verifying Login Page...")
        page.goto("http://localhost:5173/login")
        heading = page.get_by_role("heading", name="UDAWA Smart System")
        expect(heading).to_be_visible(timeout=15000)
        print("Login page loaded successfully.")
        page.screenshot(path="jules-scratch/verification/01_login_page.png")

        # 2. Verify the dummy home page with inlined layout
        print("Verifying dummy home page...")
        page.goto("http://localhost:5173/")
        expect(page.get_by_role("heading", name="Welcome Home")).to_be_visible()
        print("Dummy home page loaded successfully.")
        page.screenshot(path="jules-scratch/verification/02_dummy_home.png")

        print("\nInline component test passed!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)