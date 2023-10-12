from flask import request, render_template, jsonify, redirect, url_for, session
from app import app, db
import requests
import json
from app.models import FavoriteResult

api_url = "https://torre.ai/api/entities/_searchStream"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    
  
    headers = {
        'X-Torre-Identity': 'search',
        'User-Agent': 'prove_app'
    }

   
    params = {
        'query': query,
        'identityType': 'person',
        'limit': 10,
        'meta': True,
        'excluding': [],
        'excludedPeople': [],
        'excludeContacts': True
    }

    
    response = requests.post(api_url, headers=headers, json=params)
    
    if response.status_code == 200:
        results = []
        for line in response.iter_lines():
            if line:
                data = json.loads(line)
               
                result = {
                    'name': data.get('name', ''),
                    'image_url': data.get('imageUrl', ''),
                    'description': data.get('professionalHeadline', ''),
                    'username':data.get('username','')
                
                }
                results.append(result)

       
        return render_template('results.html', results=results)
    else:
        return jsonify([])


@app.route('/add_favorite/<name>', methods=['GET'])
def add_favorite(name):
    result = FavoriteResult.query.filter_by(name=name).first()  
    if result:
        return jsonify({"message": "They are already in favs!"})
    else:
        
        new_favorite = FavoriteResult(name=name, image_url=request.args.get('image_url'), description=request.args.get('description'))
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"message": "Added to favorites"})




@app.route('/favorites', methods=['GET'])
def favorites():
    favorites = FavoriteResult.query.all()
    return render_template('favorites.html', favorites=favorites)

@app.route('/search', methods=['GET'])
def back():
    return render_template('index.html')


