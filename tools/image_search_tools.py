import os
import json
import requests
from langchain.tools import tool
from config import GLOBAL_HTTP_TIMEOUT

class SerpImageSearchTools():
    @tool("Search Google Images for Retail Store Designs")
    def search_google_images_retail_design(company):
        """Searches Google Images for the most recent retail store design of a given company and returns links to the top 10 image results."""
        # Define the search query with the company variable
        query = f"most recent retail store design of {company}"
        
        # Set the number of results to return
        top_result_to_return = 10  # Updated to return 10 results
        
        # Base URL for the SerpAPI
        url = "https://serpapi.com/search"
        
        # Prepare the payload with required parameters
        params = {
            "q": query,
            "engine": "google_images",
            "ijn": "0",  # Page number, starting at 0 for the first page
            "api_key": os.environ['SERP_API_KEY']
        }
        
        # Make the request to SerpAPI
        response = requests.get(url, params=params, timeout=GLOBAL_HTTP_TIMEOUT)
        
        # Check for a successful response
        if response.status_code == 200:
            # Parse the results
            results = response.json().get("images_results", [])
            
            # Collect links to images
            image_links = [result.get('link') for result in results[:top_result_to_return]]
            
            # Format the links as a string for output
            links_string = '\n'.join(image_links)
            
            return links_string
        else:
            return "Failed to retrieve images. Please check your API key and query parameters."

