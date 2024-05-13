import os
from flask_sqlalchemy import SQLAlchemy
from backend.config import Config

db = SQLAlchemy()

"""
setup_db(app)
    binds a flask application and a SQLAlchemy service
"""
def setup_db(app, config: Config):
    try:
        app.config["SQLALCHEMY_DATABASE_URI"] = config.database_uri
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.track_mods
        db.app = app
        db.init_app(app)
        # when using Gunicorn with multiple processes the call to create_all may fail
        # due to the tables being already present in the database.
        # the simplest solution is to trap the uniqueviolation error
        # alternatively a migration solution could be implemented in version 2 that would
        # manage creating and updating tables separately from the connection initialization step 
        # in the app 
        try: # trap error caused by tables being already present 
            db.create_all()
        except Exception as e:
            print("Exception: " % e)
        db.session.expire_all()
        print("Database connection complete.")

        if os.environ["INIT_DB"] == "True":
            print('Seeding Database')
            #db_drop_and_create_all()

    except Exception as err:
        # Log the error to the console
        print("Error setting up the database connection", err)
        # rethrow it
        raise err
