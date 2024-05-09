from flask import Blueprint, jsonify
from flask_cors import cross_origin

from backend.auth.api_key import requires_api_key
from backend.database.models.reading import Reading
from backend.database.models.robot import Robot

endpoint = 'iot'
iot_api = Blueprint(f'{endpoint}', __name__)


@iot_api.route(f'/{endpoint}/getRobotSettings', methods=['POST'])
@cross_origin()
@requires_api_key
def get_robotConfiguration(robot: Robot):
  
  
  return jsonify({
      'success': True,
      'data': robot.format(),
  })


@iot_api.route(f'/{endpoint}/postSensorReadings', methods=['POST'])
@cross_origin()
@requires_api_key
def post_sensor_readings(robot):
  reading : Reading = None
  
  
  return jsonify({
      'success': True,
      'data': []
  })
