from flask import Flask, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import re


app = Flask(__name__)

def scrape_data():
    # Set up ChromeDriver
    chrome_driver_path = "C:\\Users\\Rabie\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe"
    service = Service(executable_path=chrome_driver_path)
    options = webdriver.ChromeOptions()

    # 🚀 Block Images for Faster Scraping
    prefs = {"profile.managed_default_content_settings.images": 2}
    options.add_experimental_option("prefs", prefs)
    options.add_argument("--headless")  # Run headless for performance

    driver = webdriver.Chrome(service=service, options=options)

    # Open the webpage
    url = "https://elearningindustry.com/directory/software-categories/learning-management-systems"
    driver.get(url)

    # Wait for the main content to load
    WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, "listings")))

    # Scrolling logic
    last_number = 42729
    while True:
        driver.execute_script("window.scrollTo(0, 42729);")
        time.sleep(5)
        newHeight = driver.execute_script('return document.body.scrollHeight')

        if newHeight == last_number:
            break
        last_number = newHeight

    print("✅ Scrolling complete. Extracting data...")

    # Extract elements using Selenium
    results = []
    listings = driver.find_elements(By.CLASS_NAME, "listing")

    for item in listings:
        try:
            title = item.find_element(By.CLASS_NAME, "listing-title").text.strip()
        except:
            title = "N/A"
        
        try:
            description = item.find_element(By.CLASS_NAME, "listing-description").text.strip()
        except:
            description = "N/A"

        try:
            reviews_text = item.find_element(By.CLASS_NAME, "fs-15").text.strip()
            reviews = re.findall(r"\d+", reviews_text)  # Find all digits in the string
            reviews = reviews[0] if reviews else None  # Take the first match or None
        except:
            reviews = None

        # Generate random reviews if none exist
        if not reviews or reviews == "N/A":
            reviews = f"{random.randint(5, 1000)}"
        
        # Generate random score between 1 and 5
        score = round(random.uniform(3, 4.9), 1)

        results.append({"Title": title, "Description": description, "Reviews": reviews, "Score": score})

    driver.quit()

    return results

@app.route('/scrape', methods=['GET'])
def get_scraped_data():
    data = scrape_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
