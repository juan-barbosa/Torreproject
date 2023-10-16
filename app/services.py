from app import db
from app.models import FavoriteResult
import requests
import json

def search_torre(query, result_limit):
    api_url = "https://torre.ai/api/entities/_searchStream"

    headers = {
        'X-Torre-Identity': 'search',
        'User-Agent': 'prove_app'
    }

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
        response = requests.post(api_url, headers=headers, json=params)
        response.raise_for_status()  

        results = []  

        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                result = {
                    'name': data.get('name', ''),
                    'image_url': data.get('imageUrl', ''),
                    'description': data.get('professionalHeadline', ''),
                    'user': data.get('username', '')
                }
                results.append(result)

        return results 

    except requests.exceptions.RequestException as e:
        print(f"Request error to Torre Api: {e}")
        return []  

def add_favorite(name, user, image_url, description):

    new_favorite = FavoriteResult(name=name, user=user, image_url=image_url, description=description)
    db.session.add(new_favorite)
    db.session.commit()
    return "Added to favorites (Click again to remove)"


def remove_favorite(name):
    result = FavoriteResult.query.filter_by(name=name).first()
    if result:
        db.session.delete(result)
        db.session.commit()
        return "Removed from favorites"