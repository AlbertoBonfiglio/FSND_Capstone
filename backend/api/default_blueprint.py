import secrets
import sys
from flask import Blueprint, request, jsonify, g
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
from api.enums import Status
from auth.auth import requires_auth, requires_ownership, requires_permissions
from database.connection import db
from database.models.user import User
from api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error
from version import __version__ 
endpoint = '/'
default_api = Blueprint(f'{endpoint}', __name__)

@default_api.route(f'{endpoint}status', methods=['GET'])
@cross_origin()
def get_status():
  return jsonify({
        'status': 'healthy',
        'version': __version__
    })
