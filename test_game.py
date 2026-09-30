import http.server
import socketserver
import threading
import time
from playwright.sync_api import sync_playwright

PORT = 8080

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def start_server():
    handler = QuietHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        httpd.serve_forever()

def run_tests():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    time.sleep(1)

    console_errors = []

    with sync_playwright() as p:
        device = p.devices['iPhone 12']
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**device)
        page = context.new_page()

        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        print("Navigating to game...")
        page.goto(f"http://localhost:{PORT}/index.html")
        page.wait_for_selector("#menu-screen")

        page.screenshot(path="screenshot_menu.png")
        print("Captured screenshot_menu.png")

        # Test How To Play modal
        page.click("#btn-how-to-play")
        page.wait_for_selector("#how-to-play-screen:not(.hidden)")
        print("How To Play modal displayed successfully.")
        page.click("#btn-close-how-to-play")

        # Test Settings modal
        page.click("#btn-settings")
        page.wait_for_selector("#settings-screen:not(.hidden)")
        print("Settings modal displayed successfully.")

        # Toggle Auto Fire OFF to test manual fire button
        page.click("#btn-toggle-autofire")
        page.click("#btn-close-settings")

        # Start Game
        page.click("#btn-start-game")
        page.wait_for_selector("#hud-screen:not(.hidden)")
        print("Game started successfully, HUD visible.")

        # Verify Manual Fire button is visible when Auto Fire is OFF
        manual_btn = page.query_selector("#btn-manual-fire")
        assert manual_btn and not manual_btn.is_hidden(), "Manual Fire button should be visible when Auto Fire is OFF"

        # Simulate Touch Control drag
        canvas = page.query_selector("#game-canvas")
        box = canvas.bounding_box()

        # Touch down and drag across screen
        page.mouse.move(box["x"] + box["width"] * 0.5, box["y"] + box["height"] * 0.8)
        page.mouse.down()
        time.sleep(0.5)

        for i in range(10):
            page.mouse.move(box["x"] + box["width"] * (0.2 + i * 0.06), box["y"] + box["height"] * (0.8 - i * 0.03))
            time.sleep(0.05)

        page.screenshot(path="screenshot_gameplay.png")
        print("Captured screenshot_gameplay.png")

        page.mouse.up()

        # Test Pause Menu
        page.click("#btn-pause")
        page.wait_for_selector("#pause-screen:not(.hidden)")
        print("Pause menu works.")
        page.screenshot(path="screenshot_pause.png")

        page.click("#btn-resume")
        page.wait_for_selector("#pause-screen", state="hidden")
        print("Resumed game successfully.")

        browser.close()

    print("\n--- TEST RESULTS ---")
    if console_errors:
        print(f"FAILED with {len(console_errors)} console errors:")
        for err in console_errors:
            print(f" - {err}")
        exit(1)
    else:
        print("SUCCESS: 0 console errors detected. All UI & Touch mechanics verified!")

if __name__ == "__main__":
    run_tests()
