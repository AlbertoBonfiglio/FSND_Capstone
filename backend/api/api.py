import os
import sys
import json
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

def create_app(env=".env"):
    print('Creating Flask App')
    app = Flask(__name__)
    # loads the environment settings
    # load_config(env)
    # set up database
    #setup_db(app)
    # makes sure there are no sessions dangling
   # db.session.expire_all()

    if os.environ["INIT_DB"] == "True":
        print('Seeding Database')
        #db_drop_and_create_all()

    # Sets up cors. For the time being sets the allowed origins to all
    CORS(app, resources={r"/api/*": {"origins": os.environ["CORS"]}})

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, PATCH, POST, DELETE, OPTIONS')
        return response

    @app.route("/")
    def hello_world():
      return "Hello, World!"


    return app
