from app import db

class FavoriteResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    image_url = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(80), nullable=False)
    user = db.Column(db.String(80), nullable=False)  