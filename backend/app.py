import os
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from backend.api.user_blueprint import user_api
from backend.api.robot_blueprint import robot_api
from backend.api.reading_blueprint import reading_api
from backend.database.connection import setup_db
from backend.config import load_config, Config

app: Flask

def create_app(env=".env"):
    print('Creating Flask App')
    app = Flask(__name__)
    load_config(env);
    
    # set up database
    # setup_db(app, Config)
    with app.app_context():
        setup_db(app, Config)

    # Sets up cors. For the time being sets the allowed origins to all
    CORS(app, resources={r"/api/*": {"origins": os.environ["CORS"]}})

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, PATCH, POST, DELETE, OPTIONS')
        return response

    app.register_blueprint(user_api)
    app.register_blueprint(robot_api)
    app.register_blueprint(reading_api)
    
    @app.route("/")
    @cross_origin()
    def get_status():
      return "Healthy"

    return app


# app = create_app()

#if __name__ == "__main__":
   
#        app.run(debug=Config.debug, port=Config.port)
