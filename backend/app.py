import os
import sys
sys.path.insert(0, __file__.replace(f"app.py", ""))  

print(f'PATH: {sys.path[0]}')
print(f'FLASK_APP: {os.getenv("FLASK_APP")}')

from flask import Flask
from flask_cors import CORS, cross_origin
from api.user_blueprint import user_api
from api.robot_blueprint import robot_api
from api.iot_blueprint import iot_api
from database.connection import setup_db
from config import load_config, Config

def create_app(env=".env"):
    print('Creating Flask App')
    _app = Flask(__name__)
    load_config(env);
    
    # set up database
    # setup_db(app, Config)
    with _app.app_context():
        setup_db(_app, Config)

    # Sets up cors. For the time being sets the allowed origins to all
    CORS(_app, resources={r"/api/*": {"origins": os.environ["CORS"]}})

    @_app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, PATCH, POST, DELETE, OPTIONS')
        return response

    _app.register_blueprint(user_api)
    _app.register_blueprint(robot_api)
    _app.register_blueprint(iot_api)
    
    @_app.route("/status", methods=['GET'])
    @cross_origin()
    def get_status():
      return "Healthy"

    print('Initialization successful. Awaiting requests.')
    return _app


app = create_app()
