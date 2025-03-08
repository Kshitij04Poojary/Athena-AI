from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # MongoDB connection
    mongo_uri = os.getenv("MONGO_URL")  # MongoDB URI from environment variable
    client = MongoClient(mongo_uri)  # Initialize MongoClient with URI
    
    # Access MongoDB database and collections
    db = client.get_database()  # This will get the default database
    app.db = db  # Add db to the app context, so you can access it in your routes

    # Register blueprints
    from package.main.routes import main_bp
    from package.project_recommendation.routes import project_recomm
    from package.mentor_mentee.routes import mentor_mentee
    from package.internships.routes import internship_bp
    from package.users.routes import user_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(project_recomm, url_prefix="/recommendations")
    app.register_blueprint(mentor_mentee, url_prefix="/mentor-mentee")
    app.register_blueprint(internship_bp, url_prefix="/api/internships")
    app.register_blueprint(user_bp, url_prefix="/users")

    return app
