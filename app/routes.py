from flask import request, render_template, jsonify
from app import app, db
from app.models import FavoriteResult
from app.services import search_torre, add_favorite, remove_favorite

# Index page
@app.route('/')
def back():
    return render_template('index.html')
def index():
    return render_template('index.html')


# Search results page
@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    result_limit=request.form.get('result_limit')
    if not result_limit:
        result_limit=10
    results = search_torre(query, result_limit)
    return render_template('results.html', results=results)


    
 
# Add / Remove from favorites
@app.route('/add_favorite/<name>', methods=['POST'])
def add_favorite_route(name):
    message = add_favorite(name, request.json['user'], request.json['image_url'], request.json['description'])
    return jsonify({"message": message})

@app.route('/remove_favorite/<name>', methods=['DELETE'])
def remove_favorite_route(name):
    message = remove_favorite(name)
    return jsonify({"message": message})


#Favorites page
@app.route('/favorites', methods=['GET'])
def favorites():
    favorites = FavoriteResult.query.all()
    return render_template('favorites.html', favorites=favorites)