from app import db
from app.models import FavoriteResult
import requests
import json

# Function to search for professionals on Torre.ai
def search_torre(query, result_limit):
    # URL of the Torre.ai API
    api_url = "https://torre.ai/api/entities/_searchStream"

    # Required headers for the request
    headers = {
        'X-Torre-Identity': 'search',
        'User-Agent': 'prove_app'
    }

    # Request parameters
    params = {
        'query': query,
        'identityType': 'person',
        'limit': result_limit, 
        'meta': True,
        'excluding': [],
        'excludedPeople': [],
        'excludeContacts': True
    }

    try:
        # POST request to the Torre.ai API
        response = requests.post(api_url, headers=headers, json=params)
        response.raise_for_status()  # Error handling

        results = []  # List to store the results

        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                # Process the data and get the results to display
                result = {
                    'name': data.get('name', ''),
                    'image_url': data.get('imageUrl', ''),
                    'description': data.get('professionalHeadline', ''),
                    'user': data.get('username', '')
                }
                results.append(result)

        return results  # Return the results

    except requests.exceptions.RequestException as e:
        # Request error handling
        print(f"Request error to Torre Api: {e}")
        return []

# Function to add a profile to favorites
def add_favorite(name, user, image_url, description):
    new_favorite = FavoriteResult(name=name, user=user, image_url=image_url, description=description)
    db.session.add(new_favorite)
    db.session.commit()
    return "Added to favorites (Click again to remove)"

# Function to remove a profile from favorites
def remove_favorite(name):
    result = FavoriteResult.query.filter_by(name=name).first()
    if result:
        db.session.delete(result)
        db.session.commit()
        return "Removed from favorites"
