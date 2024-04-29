import os
import sys
from dotenv import load_dotenv

class Config:
    secret_key = ''
    track_mods = False
    database_uri = ''
    debug = False
    port= 5001
    init_db = False

def load_config(env=".env"):
    # Grabs the folder where the script runs.
    basedir = os.path.abspath(os.path.dirname(__file__))

    load_dotenv(os.path.join(basedir, env))

    try:  # Makes sure the environment is configured
        Config.secret_key = os.getenv("SECRET_KEY", os.urandom(32))
        Config.debug = os.getenv('DEBUG', False)
        Config.track_mods= os.getenv('TRACK_MODS', False)
        Config.database_uri = os.getenv('DATABASE_URI')
        Config.port = os.getenv('API_PORT', 5001)
        Config.init_db = os.getenv('INIT_DB', False)
    except Exception as err:
        # Log the error to the console
        print("Error retrieving configuration values: ", err)
        # rethrow it
        sys.exit(1)
