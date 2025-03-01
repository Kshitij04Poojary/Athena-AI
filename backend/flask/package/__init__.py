from flask_cors import CORS
from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    from package.main.routes import main_bp

    app.register_blueprint(main_bp)
    return app