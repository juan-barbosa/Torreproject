from flask import request, render_template, jsonify
from app import app, db
from app.models import FavoriteResult
from app.services import search_torre, add_favorite, remove_favorite

# Index page - Renders the index.html page
@app.route('/')
def back():
    return render_template('index.html')


# Alias for the index route - Renders the index.html page
def index():
    return render_template('index.html')


# Search results page - Handles the search request and displays results
@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    result_limit = request.form.get('result_limit')
    
    # Set a default result limit of 10 if not specified
    if not result_limit:
        result_limit = 10

    results = search_torre(query, result_limit)
    return render_template('results.html', results=results)


# Add a profile to favorites - Handles adding a profile to favorites
@app.route('/add_favorite/<name>', methods=['POST'])
def add_favorite_route(name):
    message = add_favorite(name, request.json['user'], request.json['image_url'], request.json['description'])
    return jsonify({"message": message})


# Remove a profile from favorites - Handles removing a profile from favorites
@app.route('/remove_favorite/<name>', methods=['DELETE'])
def remove_favorite_route(name):
    message = remove_favorite(name)
    return jsonify({"message": message})


# Favorites page - Displays the favorite profiles
@app.route('/favorites', methods=['GET'])
def favorites():
    favorites = FavoriteResult.query.all()
    return render_template('favorites.html', favorites=favorites)
