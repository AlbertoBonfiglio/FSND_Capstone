import os
import sys
from dotenv import load_dotenv

class Config:
    track_mods = False
    database_uri = ''
    debug = False
    port= 5001
    auth0_algorithms = '',
    auth0_audience = '',
    auth0_domain = ''

def load_config(env=".env"):
    # Grabs the folder where the script runs.
    basedir = os.path.abspath(os.path.dirname(__file__))
    print(f'{basedir}')
    load_dotenv(os.path.join(basedir, env))

    try:  # Makes sure the environment is configured
        Config.debug = os.getenv('DEBUG', False)
        Config.track_mods= os.getenv('TRACK_MODS', False)
        Config.database_uri = os.getenv('DATABASE_URI')
        Config.port = os.getenv('API_PORT', 5001)
        Config.auth0_domain = os.getenv('AUTH0_DOMAIN')
        Config.auth0_algorithms = os.getenv('AUTH0_ALGORITHMS', ['RS256'])
        Config.auth0_audience = os.getenv('AUTH0_AUDIENCE')
  
    except Exception as err:
        # Log the error to the console
        print("Error retrieving configuration values: ", err)
        # rethrow it
        sys.exit(1)
